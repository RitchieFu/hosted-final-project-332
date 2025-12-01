<template>
    <div class="post-form-container">
      <div class="post-form">
        <!-- Success Message -->
        <div v-if="showSuccess" class="success-message">
          <h1 class="success-header">Thanks for submitting your form!</h1>
          <p class="success-text">Would you like to submit another one?</p>
          <div class="success-actions">
            <RouterLink to="/listings" class="action-button listings-btn">View Listings</RouterLink>
            <button @click="resetForm" class="action-button create-btn">Create Another Post</button>
          </div>
        </div>

        <!-- Form (hidden when success is shown) -->
        <div v-else>
          <h1 class="form-header">Create Post</h1>
          
          <ListingForm 
            ref="formRef"
            :submit-button-text="'Create Post'"
            :is-submitting="isSubmitting"
            @submit="handleSubmit"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import { saveListing } from '@/services/listingsService'
  import ListingForm from '@/components/ListingForm.vue'
  import { storage } from '@/config/firebase'
  import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
  
  // Success state
  const showSuccess = ref(false)
  const isSubmitting = ref(false)
  const formRef = ref(null)
  
  // Form submission
  const handleSubmit = async (listingData) => {
    try {
      isSubmitting.value = true
      
      // Upload image to Firebase if exists
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
      } else {
        // If no image file but image exists (base64 preview), we might want to clear it or handle it
        // But for new posts, if no file, image should be null unless we want to support base64 submission (which is what it was doing before)
        // If we only want firebase URLs, we should probably ignore the base64 preview string if no file is present
        // However, listingData.image currently holds the preview string.
        // Let's assume for new posts we only want uploaded images.
        if (!listingData.imageFile) {
            listingData.image = null
        }
      }
      
      // Save to API (requires authentication)
      const savedListing = await saveListing(listingData)
      console.log('Listing saved successfully:', savedListing)
      
      // Show success message
      showSuccess.value = true
    } catch (error) {
      console.error('Error saving listing:', error)
      alert(error.message || 'There was an error saving your listing. Please try again.')
    } finally {
      isSubmitting.value = false
    }
  }
  
  // Reset form to create another post
  const resetForm = () => {
    if (formRef.value) {
      formRef.value.reset()
    }
    showSuccess.value = false
  }
  </script>
  
  <style scoped>
  .post-form-container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: calc(100vh - 80px);
    padding: 1rem 2rem;
    background-color: #f5f5f5;
  }
  
  .post-form {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 600px;
  }
  
  .form-header {
    text-align: center;
    color: #041E42;
    margin-bottom: 2rem;
    font-size: 2rem;
    font-weight: 600;
  }
  
  
  /* Success Message Styles */
  .success-message {
    text-align: center;
    padding: 2rem;
  }
  
  .success-header {
    color: #041E42;
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  
  .success-text {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .success-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .action-button {
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-block;
  }
  
  .listings-btn {
    background-color: #041E42;
    color: white;
  }
  
  .listings-btn:hover {
    background-color: #033a7a;
    transform: translateY(-1px);
  }
  
  .create-btn {
    background-color: white;
    color: #041E42;
    border: 2px solid #041E42;
  }
  
  .create-btn:hover {
    background-color: #041E42;
    color: white;
    transform: translateY(-1px);
  }
  
  /* Responsive design */
  @media (max-width: 768px) {
    .post-form-container {
      padding: 1rem;
    }
    
    .post-form {    
      padding: 1.5rem;
    }
    
    .tags-container {
      justify-content: center;
    }
    
    .success-actions {
      flex-direction: column;
      align-items: center;
    }
    
    .action-button {
      width: 100%;
      max-width: 200px;
    }
  }
  </style>