<template>
  <div class="listing-card">
    <div v-if="listing.image" class="image-container">
      <img 
        :src="listing.image" 
        :alt="listing.title" 
        class="listing-image"
        @load="handleImageLoad"
        ref="imageRef"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="content">
      <h3 class="listing-title">{{ listing.title }}</h3>
      <p v-if="listing.description" class="listing-description">{{ listing.description }}</p>
      <div class="tags-container">
        <span 
          v-for="tag in listing.tags" 
          :key="tag" 
          class="tag"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  listing: {
    type: Object,
    required: true
  }
})

const imageRef = ref(null)

const handleImageLoad = () => {
  if (!imageRef.value) return
  
  const img = imageRef.value
  const container = img.parentElement
  
  // Use requestAnimationFrame for better performance
  requestAnimationFrame(() => {
    // Get the natural dimensions of the image
    const naturalWidth = img.naturalWidth
    const naturalHeight = img.naturalHeight
    
    if (naturalWidth === 0 || naturalHeight === 0) return
    
    const aspectRatio = naturalWidth / naturalHeight
    
    // Set container dimensions based on aspect ratio, but respect max-height
    const containerWidth = container.offsetWidth
    let containerHeight
    
    if (aspectRatio > 1) {
      // Landscape image - make it shorter
      containerHeight = containerWidth * 0.75
    } else if (aspectRatio < 1) {
      // Portrait image - make it taller
      containerHeight = containerWidth * 1.5
    } else {
      // Square image - keep it square
      containerHeight = containerWidth
    }
    
    // Ensure we don't exceed the max-height of 300px
    containerHeight = Math.min(containerHeight, 300)
    container.style.height = `${containerHeight}px`
  })
}
</script>

<style scoped>
.listing-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  break-inside: avoid;
  margin-bottom: 1rem;
  will-change: transform;
  contain: layout style paint;
  max-height: 600px;
  display: flex;
  flex-direction: column;
}

.listing-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.image-container {
  width: 100%;
  max-height: 300px;
  overflow: hidden;
  position: relative;
  contain: layout;
  flex-shrink: 0;
}

.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.listing-card:hover .listing-image {
  transform: scale(1.05);
}

.content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}
 
.listing-title {
  color: #041E42;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.listing-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0 0 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  overflow: hidden;
  max-height: 60px;
}

.tag {
  background-color: #f0f4f8;
  color: #041E42;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  border: 1px solid #e1e5e9;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .content {
    padding: 0.75rem;
  }
  
  .listing-title {
    font-size: 1rem;
  }
  
  .tag {
    font-size: 0.75rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
