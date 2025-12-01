<template>
  <div class="listings-container">
    <div class="listings-header">
      <h1 class="page-title">Browse Listings</h1>
      <p class="page-subtitle">Find help and opportunities in your community</p>
    </div>

    <!-- Filter Sidebar -->
    <FilterSidebar 
      v-model:selected-filters="selectedFilters"
      :filtered-count="filteredListings.length"
    />

    <!-- Listings -->
    <div class="listings-container-centered">
      <div class="listings-grid" ref="listingsGridRef">
        <ListingCard 
          v-for="listing in filteredListings" 
          :key="listing.id" 
          :listing="listing" 
        />
      </div>
      
      <!-- Loading indicator -->
      <div v-if="loadingMore" class="loading-more">
        <p>Loading more listings...</p>
        </div>
      
      <!-- End of results message -->
      <div v-if="!hasMore && listings.length > 0 && !loadingMore" class="end-of-results">
        <p>You've reached the end of the listings</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import ListingCard from '@/components/ListingCard.vue'
import FilterSidebar from '@/components/FilterSidebar.vue'
import { getListings, generateRandomDate } from '@/services/listingsService'

// Combined listings data (localStorage + mock data)
const listings = ref([])

// Filter state
const selectedFilters = ref([])

// Pagination state
const pagination = ref({
  limit: 10, // Load 10 listings at a time
  skip: 0,
  hasMore: true,
  total: 0
})
const loadingMore = ref(false)
const listingsGridRef = ref(null)

// Mock data for demonstration
const mockListings = [
  {
    id: 1,
    title: 'Need help with Calculus homework - willing to pay $20/hour',
    description:
      'Struggling with derivatives and integrals, need someone to explain concepts clearly.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    tags: ['Homework Help', 'Math'],
    postedAt: generateRandomDate(),
  },
  {
    id: 2,
    title: 'Looking for someone to help move furniture this weekend',
    description: 'Moving to a new apartment and need help with heavy furniture and boxes.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    tags: ['Manual Labor', 'Moving'],
  },
  {
    id: 3,
    title: 'Roommate needed for 2-bedroom apartment near campus',
    description: 'Looking for a clean, responsible roommate to share rent and utilities.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80',
    tags: ['Housing', 'Roommate'],
  },
  {
    id: 4,
    title: 'Selling MacBook Pro 2020 - excellent condition',
    description:
      'Hardly used MacBook Pro in perfect condition, comes with original charger and box.',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    tags: ['For Sale', 'Electronics'],
  },
  {
    id: 5,
    title: 'Need graphic design help for club flyer',
    description:
      'Student organization needs help creating an eye-catching flyer for our upcoming event.',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=400&q=80',
    tags: ['Creative Work', 'Design'],
  },
  {
    id: 6,
    title: 'Tutoring available for Chemistry and Biology',
    description:
      'Experienced tutor offering help with organic chemistry and cell biology concepts.',
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
    tags: ['Homework Help', 'Tutoring'],
  },
  {
    id: 7,
    title: 'Part-time job opportunity at local coffee shop',
    description: 'Flexible hours, great tips, and free coffee for barista position.',
    image: null,
    tags: ['Business', 'Job'],
  },
  {
    id: 8,
    title: 'Looking for study group for CS 332',
    description: 'Forming a study group to prepare for the upcoming midterm exam.',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=80',
    tags: ['Homework Help', 'Study Group'],
  },
  {
    id: 9,
    title: 'Selling textbooks - various subjects available',
    description: 'Textbooks from previous semesters in good condition, prices negotiable.',
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
    tags: ['For Sale', 'Books'],
  },
  {
    id: 10,
    title: 'Need help with resume writing and job applications',
    description:
      'Recent graduate seeking assistance with resume formatting and job search strategies.',
    image: null,
    tags: ['Professional Help', 'Career'],
  },
  {
    id: 11,
    title: 'Looking for someone to help with yard work',
    description: 'Need help with lawn mowing, weeding, and general yard maintenance.',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80',
    tags: ['Manual Labor', 'Yard Work'],
  },
  {
    id: 12,
    title: 'Photography services for events and portraits',
    description:
      'Professional photographer available for graduation photos, events, and portraits.',
    image: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&q=80',
    tags: ['Creative Work', 'Photography'],
  },
  {
    id: 13,
    title: 'Car wash service - mobile and convenient',
    description: 'Professional car detailing service that comes to your location.',
    image: null,
    tags: ['Manual Labor', 'Services'],
  },
  {
    id: 14,
    title: 'Guitar lessons for beginners',
    description: 'Learn to play guitar with patient, experienced instructor.',
    image: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80',
    tags: ['Creative Work', 'Music'],
  },
]

// Filtered listings
const filteredListings = computed(() => {
  if (selectedFilters.value.length === 0) {
    return listings.value
  }
  return listings.value.filter(listing => 
    selectedFilters.value.some(filterTag => listing.tags.includes(filterTag))
  )
})


// Check if page needs more content (not scrollable yet)
const checkIfNeedsMoreContent = () => {
  // Wait a bit for DOM to render
  setTimeout(() => {
    const documentHeight = document.documentElement.scrollHeight
    const windowHeight = window.innerHeight
    
    // If page isn't scrollable and we have more listings, load more
    if (documentHeight <= windowHeight && pagination.value.hasMore && !loadingMore.value) {
      console.log('Page not scrollable, loading more content automatically')
      loadMoreListings()
    }
  }, 500)
}

// Load listings on component mount
onMounted(async () => {
  await loadListings(true) // Reset and load initial listings
  window.addEventListener('scroll', handleScroll)
  checkIfNeedsMoreContent()
})

// Clean up scroll listener
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})

// Function to load listings from API (initial load)
const loadListings = async (reset = false) => {
  try {
    if (reset) {
      listings.value = []
      pagination.value.skip = 0
      pagination.value.hasMore = true
    }
    
    // Get user-submitted listings from API (last 7 days only)
    const result = await getListings({ 
      days: 7,
      limit: pagination.value.limit,
      skip: pagination.value.skip
    })
    
    // Append new listings to existing ones
    if (reset) {
      listings.value = result.listings
    } else {
      listings.value = [...listings.value, ...result.listings]
    }
    
    // Update pagination state
    pagination.value = {
      ...pagination.value,
      ...result.pagination,
      hasMore: result.pagination.hasMore
    }
    
    // Debug logging
    console.log('Loaded listings:', {
      count: result.listings.length,
      total: result.pagination.total,
      skip: pagination.value.skip,
      hasMore: result.pagination.hasMore,
      totalListings: listings.value.length
    })
  } catch (error) {
    console.error('Error loading listings:', error)
    // Fallback to mock data only on initial load
    if (listings.value.length === 0) {
    listings.value = mockListings
  }
}
}

// Function to load more listings (for infinite scroll)
const loadMoreListings = async () => {
  if (loadingMore.value || !pagination.value.hasMore) {
    console.log('Skipping load more:', { loadingMore: loadingMore.value, hasMore: pagination.value.hasMore })
    return
  }
  
  try {
    loadingMore.value = true
    const newSkip = pagination.value.skip + pagination.value.limit
    
    console.log('Loading more listings:', {
      currentSkip: pagination.value.skip,
      newSkip,
      limit: pagination.value.limit
    })
    
    const result = await getListings({ 
      days: 7,
      limit: pagination.value.limit,
      skip: newSkip
    })
    
    // Append new listings
    listings.value = [...listings.value, ...result.listings]
    
    // Update pagination state
    pagination.value = {
      ...pagination.value,
      skip: newSkip,
      ...result.pagination,
      hasMore: result.pagination.hasMore
    }
    
    console.log('Loaded more listings:', {
      newCount: result.listings.length,
      totalListings: listings.value.length,
      hasMore: result.pagination.hasMore
    })
    
    // Check if we need to load more after this batch (page might still not be scrollable)
    if (result.pagination.hasMore) {
      setTimeout(() => {
        checkIfNeedsMoreContent()
      }, 300)
    }
  } catch (error) {
    console.error('Error loading more listings:', error)
  } finally {
    loadingMore.value = false
  }
}

// Scroll detection for infinite scroll (with throttling)
let scrollTimeout = null
const handleScroll = () => {
  // Throttle scroll events
  if (scrollTimeout) {
    return
  }
  
  scrollTimeout = setTimeout(() => {
    scrollTimeout = null
    
    if (loadingMore.value || !pagination.value.hasMore) {
      return
    }
    
    // Check if user has scrolled near the bottom (within 300px)
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    // Check if user has scrolled near the bottom
    if (scrollTop + windowHeight >= documentHeight - 300) {
      loadMoreListings()
    }
  }, 100) // Throttle to every 100ms
}

// Computed property for hasMore
const hasMore = computed(() => pagination.value.hasMore)
</script>

<style scoped>
html { overflow-y: scroll; }
*, *::before, *::after { box-sizing: border-box; }


.listings-container {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem;
}

.listings-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  color: #041e42;
  font-size: 2.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.page-subtitle {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

/* Layout */
.listings-container-centered {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Responsive design */
@media (max-width: 900px) {
  .listings-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .listings-container {
    padding: 1rem;
  }

  .listings-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
  
  .listings-container-centered {
    padding: 0 1rem;
  }
}

.loading-more {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.end-of-results {
  text-align: center;
  padding: 2rem;
  color: #888;
  font-size: 0.9rem;
}
</style>
