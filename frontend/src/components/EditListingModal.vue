<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Edit Listing</h2>
        <button @click="handleClose" class="close-button" aria-label="Close modal">
          ×
        </button>
      </div>
      
      <div class="modal-body">
        <ListingForm 
          :initial-data="listing"
          :submit-button-text="'Save Changes'"
          :is-submitting="isSaving"
          form-id="edit-listing"
          @submit="handleSubmit"
        >
          <template #submit-button>
            <div class="form-actions">
              <button type="button" @click="handleClose" class="cancel-button">Cancel</button>
              <button type="submit" class="submit-button" :disabled="isSaving">
                <span v-if="isSaving">Saving...</span>
                <span v-else>Save Changes</span>
              </button>
            </div>
          </template>
        </ListingForm>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { updateListing } from '@/services/listingsService'
import ListingForm from '@/components/ListingForm.vue'
import { storage } from '@/config/firebase'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  listing: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const isSaving = ref(false)

const handleClose = () => {
  emit('close')
}

const handleSubmit = async (listingData) => {
  if (!props.listing || !props.listing.id) {
    console.error('No listing ID available')
    return
  }

  try {
    isSaving.value = true
    
    // Upload image to Firebase if new file exists
    if (listingData.imageFile) {
      try {
        const fileName = `listings/${Date.now()}_${listingData.imageFile.name}`
        const imageRef = storageRef(storage, fileName)
        const snapshot = await uploadBytes(imageRef, listingData.imageFile)
        const downloadURL = await getDownloadURL(snapshot.ref)
        listingData.image = downloadURL
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError)
        throw new Error('Failed to upload image. Please try again.')
      }
    }
    
    // Explicitly set image to null if it was removed in the form but no new file was added
    // The ListingForm sets listingData.image to null when removed, so we just need to ensure
    // we respect that if imageFile is also null.
    if (!listingData.imageFile && listingData.image === null) {
        // This confirms removal. The API expects `image: null` to remove it.
    }
    
    // Update listing via API
    // listingData.image will be: new URL if uploaded, existing URL/string if not changed, or null if removed
    await updateListing(props.listing.id, listingData)
    
    // Emit saved event to refresh the list
    emit('saved')
    
    // Close modal
    handleClose()
  } catch (error) {
    console.error('Error updating listing:', error)
    alert(error.message || 'There was an error updating your listing. Please try again.')
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
}

.modal-title {
  color: #041E42;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background-color: #f0f0f0;
  color: #041E42;
}

.modal-body {
  padding: 1.5rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-button {
  background-color: white;
  color: #041E42;
  border: 2px solid #041E42;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background-color: #041E42;
  color: white;
}

.submit-button {
  background-color: #041E42;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  background-color: #033a7a;
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}


/* Responsive design */
@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-button,
  .submit-button {
    width: 100%;
  }
}
</style>

