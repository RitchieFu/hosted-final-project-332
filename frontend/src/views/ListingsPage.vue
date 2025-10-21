<template>
  <div class="listings-container">
    <div class="listings-header">
      <h1 class="page-title">Browse Listings</h1>
      <p class="page-subtitle">Find help and opportunities in your community</p>
    </div>

    <div class="masonry-grid">
      <div v-for="listing in listings" :key="listing.id" class="masonry-item">
        <ListingCard :listing="listing" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ListingCard from '@/components/ListingCard.vue'

// Static listings data
const listings = ref([
  {
    id: 1,
    title: 'Need help with Calculus homework - willing to pay $20/hour',
    description:
      'Struggling with derivatives and integrals, need someone to explain concepts clearly.',
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
    tags: ['Homework Help', 'Math'],
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
])
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

.masonry-grid {
  column-width: 320px; /* browser decides column count based on width */
  column-gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
  contain: layout;
  will-change: auto;
}

.masonry-item {
  break-inside: avoid; /* keep a card intact */
  margin-bottom: 1.5rem;
  display: inline-block; /* needed so items respect column flow */
  width: 100%;
  contain: layout style paint;
  will-change: transform;
}

/* Responsive design */
@media (max-width: 1100px) {
  .masonry-grid {
    column-count: 3;
  }
  .masonry-item {
    margin-bottom: 1rem;
  }
}

@media (max-width: 700px) and (max-width: 1099.98px) {
  .listings-container {
    padding: 1rem;
  }

  .masonry-grid {
    column-count: 2;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }
}

@media (max-width: 699.98px) {
  .listings-container {
    padding: 0.5rem;
  }

  .masonry-grid {
    column-count: 1;
  }
}
</style>
