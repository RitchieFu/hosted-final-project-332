<template>
  <div class="my-listings-container">
    <div class="my-listings-header">
      <h1 class="page-title">My Listings</h1>
      <hr class="title-divider" />
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-message">
      <p>Loading your listings...</p>
    </div>

    <!-- Empty state -->
    <div v-else-if="!loading && listings.length === 0" class="empty-state">
      <p>You haven't created any listings yet.</p>
      <RouterLink to="/post" class="create-listing-link">Create your first listing</RouterLink>
    </div>

    <!-- Listings -->
    <div v-else class="listings-list-container">
      <div v-for="listing in listings" :key="listing.id" class="listing-item">
        <!-- Header Row: Title and Action Buttons -->
        <div class="listing-item-header">
          <h3 class="listing-item-title">{{ listing.title }}</h3>
          <div class="action-buttons">
            <button @click="openEditModal(listing)" class="action-button edit-button" aria-label="Edit listing">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button @click="openDeleteModal(listing)" class="action-button delete-button" aria-label="Delete listing">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Image -->
        <div v-if="listing.image" class="listing-item-image">
          <img :src="listing.image" :alt="listing.title" />
        </div>
        
        <!-- Content -->
        <div class="listing-item-content">
          <p v-if="listing.description" class="listing-item-description">{{ listing.description }}</p>
          
          <!-- Tags -->
          <div v-if="listing.tags && listing.tags.length > 0" class="listing-item-tags">
            <span v-for="tag in listing.tags" :key="tag" class="tag">
              {{ tag }}
            </span>
          </div>
          
          <!-- Meta info -->
          <div class="listing-item-meta">
            <span class="posted-date">Posted on {{ formatDate(listing.createdAt || listing.postedAt) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <EditListingModal 
      :is-open="isEditModalOpen"
      :listing="selectedListing"
      @close="closeEditModal"
      @saved="handleListingSaved"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      :is-open="isDeleteModalOpen"
      :listing-title="selectedListing?.title || ''"
      :is-deleting="isDeleting"
      @close="closeDeleteModal"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getListingsByUser, deleteListing } from '@/services/listingsService'
import { formatDate } from '@/utils/dateFormatter.js'
import EditListingModal from '@/components/EditListingModal.vue'
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal.vue'

const router = useRouter()
const authStore = useAuthStore()
const listings = ref([])
const loading = ref(true)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const selectedListing = ref(null)
const isDeleting = ref(false)

// Load user's listings on component mount
onMounted(async () => {
  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    router.push('/login')
    return
  }

  await loadMyListings()
})

// Function to load only the current user's listings
const loadMyListings = async () => {
  try {
    loading.value = true
    
    if (!authStore.userId) {
      console.error('No user ID found')
      listings.value = []
      return
    }

    // Get only the current user's listings
    const userListings = await getListingsByUser(authStore.userId)
    listings.value = userListings
  } catch (error) {
    console.error('Error loading your listings:', error)
    listings.value = []
  } finally {
    loading.value = false
  }
}

// Edit modal functions
const openEditModal = (listing) => {
  selectedListing.value = listing
  isEditModalOpen.value = true
}

const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedListing.value = null
}

const handleListingSaved = async () => {
  // Reload listings after successful edit
  await loadMyListings()
}

// Delete modal functions
const openDeleteModal = (listing) => {
  selectedListing.value = listing
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  selectedListing.value = null
}

const handleDeleteConfirm = async () => {
  if (!selectedListing.value || !selectedListing.value.id) {
    console.error('No listing ID available for deletion')
    return
  }

  try {
    isDeleting.value = true
    
    // Delete listing via API
    await deleteListing(selectedListing.value.id)
    
    // Close modal
    closeDeleteModal()
    
    // Reload listings after successful deletion
    await loadMyListings()
  } catch (error) {
    console.error('Error deleting listing:', error)
    alert(error.message || 'There was an error deleting your listing. Please try again.')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.my-listings-container {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem;
}

.my-listings-header {
  margin: 2rem auto 0;
  max-width: 80%;
}

.page-title {
  color: #041e42;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.title-divider {
  border: none;
  border-top: 2px solid #e1e5e9;
  margin: 0;
  width: 100%;
}

/* Listings grid layout */
.listings-list-container {
  max-width: 80%;
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 1.5rem;
}

.listing-item {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: box-shadow 0.3s ease;
}

.listing-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.listing-item-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  min-width: 0;
}

.listing-item-title {
  color: #041e42;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.action-button {
  background-color: #041E42;
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;
}

.action-button:hover {
  transform: scale(1.05);
}

.action-button:active {
  transform: scale(0.95);
}

.edit-button:hover {
  background-color: #033a7a;
}

.delete-button {
  background-color: #dc3545;
}

.delete-button:hover {
  background-color: #c82333;
}

.action-button svg {
  width: 16px;
  height: 16px;
}

.listing-item-image {
  width: 100%;
  height: 200px;
  border-radius: 4px;
  overflow: hidden;
  background-color: #f0f0f0;
}

.listing-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-item-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.listing-item-description {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.listing-item-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.listing-item-tags .tag {
  background-color: #f0f4f8;
  color: #041e42;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e1e5e9;
}

.listing-item-meta {
  margin-top: 0.5rem;
}

.posted-date {
  color: #888;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Loading and empty states */
.loading-message,
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.empty-state p {
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.create-listing-link {
  display: inline-block;
  background-color: #041e42;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.create-listing-link:hover {
  background-color: #033a7a;
}

/* Responsive design */
@media (max-width: 1200px) {
  .listings-list-container {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .listings-list-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .my-listings-container {
    padding: 1rem;
  }
  
  .my-listings-header {
    margin: 1rem auto 0;
    max-width: 90%;
  }

  .listings-list-container {
    max-width: 90%;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .listing-item {
    padding: 1rem;
  }

  .listing-item-header {
    flex-wrap: wrap;
  }

  .listing-item-title {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .action-buttons {
    width: 100%;
    justify-content: flex-end;
  }

  .listing-item-image {
    height: 200px;
  }
}
</style>

