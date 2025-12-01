<template>
  <form @submit.prevent="handleFormSubmit" class="form">
    <!-- Title Field -->
    <div class="form-group">
      <label :for="`title-${formId}`" class="form-label">Title</label>
      <input 
        type="text" 
        :id="`title-${formId}`" 
        v-model="formData.title" 
        class="form-input" 
        placeholder="Enter post title"
        required
      />
    </div>

    <!-- Description Field -->
    <div class="form-group">
      <label :for="`description-${formId}`" class="form-label">Description</label>
      <textarea 
        :id="`description-${formId}`" 
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
      <label :for="`image-${formId}`" class="form-label">Upload Image</label>
      
      <!-- Image Preview Area (Shows either current existing image OR new upload preview) -->
      <div v-if="(isEditMode && initialImage && !imagePreview) || imagePreview" class="image-preview-container">
        <p class="preview-label">{{ imagePreview ? 'New Image Preview:' : 'Current Image:' }}</p>
        <img :src="imagePreview || initialImage" alt="Listing image" class="preview-image" />
        <button 
          type="button" 
          @click="removeImage" 
          class="remove-image-btn"
        >
          Remove Image
        </button>
      </div>

      <input 
        type="file" 
        :id="`image-${formId}`" 
        @change="handleImageUpload" 
        accept="image/*"
        class="form-file"
      />
    </div>

    <!-- Submit Button Slot (for custom button text/behavior) -->
    <slot name="submit-button">
      <button type="submit" class="submit-button" :disabled="isSubmitting">
        <span v-if="isSubmitting">Submitting...</span>
        <span v-else>{{ submitButtonText }}</span>
      </button>
    </slot>
  </form>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  },
  submitButtonText: {
    type: String,
    default: 'Submit'
  },
  isSubmitting: {
    type: Boolean,
    default: false
  },
  formId: {
    type: String,
    default: () => Math.random().toString(36).substr(2, 9)
  }
})

const emit = defineEmits(['submit', 'image-removed'])

// Determine if we're in edit mode
const isEditMode = computed(() => !!props.initialData)

// Form data
const formData = reactive({
  title: '',
  description: '',
  image: null,
  imageFile: null
})

// Tags functionality
const availableTags = ['Homework Help', 'Creative Work', 'Professional Help', 'Manual Labor', 
                      'Business', 'Housing', 'For Sale', 'Math', 'Moving', 'Roommate', 
                      'Electronics', 'Design', 'Tutoring', 'Job', 'Study Group', 'Books', 
                      'Career', 'Yard Work', 'Photography', 'Services', 'Music', 'Other']
const selectedTags = ref([])
const imagePreview = ref(null)
const imageRemoved = ref(false)

// Initial image (for edit mode)
const initialImage = computed(() => {
  if (isEditMode.value && props.initialData?.image && !imagePreview.value && !imageRemoved.value) {
    return props.initialData.image
  }
  return null
})

// Watch for initial data changes to populate form
watch(() => props.initialData, (newData) => {
  if (newData) {
    formData.title = newData.title || ''
    formData.description = newData.description || ''
    formData.image = newData.image || null
    formData.imageFile = null
    selectedTags.value = newData.tags ? [...newData.tags] : []
    imagePreview.value = null // Reset preview when initial data changes
    imageRemoved.value = false // Reset removed state
  } else {
    // Reset form for create mode
    formData.title = ''
    formData.description = ''
    formData.image = null
    formData.imageFile = null
    selectedTags.value = []
    imagePreview.value = null
    imageRemoved.value = false
  }
}, { immediate: true })

const toggleTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    formData.imageFile = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
      imageRemoved.value = false // Un-remove if they upload a new one
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  formData.image = null
  formData.imageFile = null
  imagePreview.value = null
  imageRemoved.value = true // Mark as removed to hide initialImage
  const fileInput = document.getElementById(`image-${props.formId}`)
  if (fileInput) {
    fileInput.value = ''
  }
  emit('image-removed')
}

const handleFormSubmit = () => {
  // Prepare the listing data
  const listingData = {
    title: formData.title,
    description: formData.description,
    tags: selectedTags.value,
    // If new image uploaded, use it. 
    // If image was removed (and no new one), use null.
    // Otherwise use existing image.
    image: imagePreview.value || (imageRemoved.value ? null : formData.image) || null,
    // Pass the raw file for uploading
    imageFile: formData.imageFile
  }
  
  // Emit submit event with form data
  emit('submit', listingData)
}

// Expose reset function for parent components
defineExpose({
  reset: () => {
    formData.title = ''
    formData.description = ''
    formData.image = null
    formData.imageFile = null
    selectedTags.value = []
    imagePreview.value = null
    imageRemoved.value = false
    const fileInput = document.getElementById(`image-${props.formId}`)
    if (fileInput) {
      fileInput.value = ''
    }
  }
})
</script>

<style scoped>
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

.image-preview-container {
  margin-bottom: 1rem;
  text-align: center;
  border: 1px solid #e1e5e9;
  border-radius: 4px;
  padding: 1rem;
  background-color: #f8f9fa;
}

.preview-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.preview-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
  margin: 0 auto 1rem;
  object-fit: contain;
}

.remove-image-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.remove-image-btn:hover {
  background-color: #c82333;
}

.form-file {
  padding: 0.5rem;
  border: 2px dashed #e1e5e9;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.3s ease;
  width: 100%;
  box-sizing: border-box; /* Ensure padding doesn't affect width */
  overflow: hidden; /* Prevent text overflow */
  text-overflow: ellipsis; /* Add ellipsis if filename is too long */
  white-space: nowrap; /* Keep on one line */
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

.submit-button:hover:not(:disabled) {
  background-color: #033a7a;
  transform: translateY(-1px);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}
</style>

