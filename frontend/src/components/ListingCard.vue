<template>
  <div class="listing-card">
    <div class="image-container">
      <img 
        v-if="listing.image" 
        :src="listing.image" 
        :alt="listing.title" 
        class="listing-image"
        loading="lazy"
        decoding="async"
      />
      <div v-else class="image-placeholder">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      </div>
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
      <div class="listing-meta">
        <span class="posted-date" v-if="isUpdated">
          Updated at: {{ formatDate(listing.updatedAt) }}
        </span>
        <span class="posted-date" v-else>
          Posted on {{ formatDate(listing.createdAt || listing.postedAt) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatDate } from '@/utils/dateFormatter.js'

const props = defineProps({
  listing: {
    type: Object,
    required: true
  }
})

// Check if listing has been updated (updatedAt exists and is different from createdAt)
const isUpdated = computed(() => {
  if (!props.listing.updatedAt || !props.listing.createdAt) {
    return false
  }
  
  const createdAt = new Date(props.listing.createdAt).getTime()
  const updatedAt = new Date(props.listing.updatedAt).getTime()
  
  // Consider them different if the difference is more than 1 second (to account for minor timing differences)
  return Math.abs(updatedAt - createdAt) > 1000
})
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
  aspect-ratio: 1 / 1; /* Square image */
  overflow: hidden;
  position: relative;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
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

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  background-color: #f5f5f5;
}

.image-placeholder svg {
  width: 48px;
  height: 48px;
  opacity: 0.5;
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

.listing-meta {
  margin-bottom: 0.1rem;
}

.posted-date {
  color: #888;
  font-size: 0.8rem;
  font-weight: 500;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  overflow: hidden;
  max-height: 60px;
  margin-bottom: 0.5rem;
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
