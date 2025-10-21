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
          
          <form @submit.prevent="handleSubmit" class="form">
          <!-- Title Field -->
          <div class="form-group">
            <label for="title" class="form-label">Title</label>
            <input 
              type="text" 
              id="title" 
              v-model="formData.title" 
              class="form-input" 
              placeholder="Enter post title"
              required
            />
          </div>
  
          <!-- Description Field -->
          <div class="form-group">
            <label for="description" class="form-label">Description</label>
            <textarea 
              id="description" 
              v-model="formData.description" 
              class="form-textarea" 
              placeholder="Enter post description"
              rows="4"
              required
            ></textarea>
          </div>
  
          <!-- Tags Selection -->
          <div class="form-group">
            <label class="form-label">Tags</label>
            <div class="tags-container">
              <button 
                type="button"
                v-for="tag in availableTags" 
                :key="tag"
                @click="toggleTag(tag)"
                :class="['tag-button', { 'tag-selected': selectedTags.includes(tag) }]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
  
          <!-- Image Upload -->
          <div class="form-group">
            <label for="image" class="form-label">Upload Image</label>
            <input 
              type="file" 
              id="image" 
              @change="handleImageUpload" 
              accept="image/*"
              class="form-file"
            />
            <div v-if="imagePreview" class="image-preview">
              <img :src="imagePreview" alt="Preview" />
            </div>
          </div>
  
           <!-- Submit Button -->
           <button type="submit" class="submit-button">Create Post</button>
         </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { RouterLink } from 'vue-router'
  import { saveListing } from '@/services/listingsService'
  
  // Success state
  const showSuccess = ref(false)
  
  // Form data
  const formData = reactive({
    title: '',
    description: ''
  })
  
  // Tags functionality
  const availableTags = ['Homework Help', 'Creative Work', 'Professional Help', 'Manual Labor', 
                        'Business', 'Housing', 'For Sale', 'Other   ']
  const selectedTags = ref([])
  
  const toggleTag = (tag) => {
    const index = selectedTags.value.indexOf(tag)
    if (index > -1) {
      selectedTags.value.splice(index, 1)
    } else {
      selectedTags.value.push(tag)
    }
  }
  
  // Image upload
  const imagePreview = ref(null)
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagePreview.value = e.target.result
      }
      reader.readAsDataURL(file)
    }
  }
  
  // Form submission
  const handleSubmit = async () => {
    try {
      // Prepare the listing data
      const listingData = {
        title: formData.title,
        description: formData.description,
        tags: selectedTags.value,
        image: imagePreview.value
      }
      
      // Save to localStorage
      const savedListing = saveListing(listingData)
      console.log('Listing saved successfully:', savedListing)
      
      // Show success message
      showSuccess.value = true
    } catch (error) {
      console.error('Error saving listing:', error)
      alert('There was an error saving your listing. Please try again.')
    }
  }
  
  // Reset form to create another post
  const resetForm = () => {
    formData.title = ''
    formData.description = ''
    selectedTags.value = []
    imagePreview.value = null
    showSuccess.value = false
    // Reset file input
    const fileInput = document.getElementById('image')
    if (fileInput) {
      fileInput.value = ''
    }
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
  
  .form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .form-label {
    font-weight: 500;
    color: #041E42;
    font-size: 1rem;
  }
  
  .form-input,
  .form-textarea {
    padding: 0.75rem;
    border: 2px solid #e1e5e9;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
  }
  
  .form-input:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #041E42;
  }
  
  .form-textarea {
    resize: vertical;
    min-height: 100px;
  }
  
  .tags-container {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  
  .tag-button {
    padding: 0.5rem 1rem;
    border: 2px solid #e1e5e9;
    background-color: white;
    color: #041E42;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.9rem;
  }
  
  .tag-button:hover {
    border-color: #041E42;
    background-color: #f0f4f8;
  }
  
  .tag-selected {
    background-color: #041E42;
    color: white;
    border-color: #041E42;
  }
  
  .form-file {
    padding: 0.5rem;
    border: 2px dashed #e1e5e9;
    border-radius: 4px;
    background-color: #f8f9fa;
    cursor: pointer;
    transition: border-color 0.3s ease;
  }
  
  .form-file:hover {
    border-color: #041E42;
  }
  
  .image-preview {
    margin-top: 1rem;
    text-align: center;
  }
  
  .image-preview img {
    max-width: 200px;
    max-height: 200px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
    margin-top: 1rem;
  }
  
  .submit-button:hover {
    background-color: #033a7a;
    transform: translateY(-1px);
  }
  
  .submit-button:active {
    transform: translateY(0);
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