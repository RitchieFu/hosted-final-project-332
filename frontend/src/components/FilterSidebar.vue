<template>
  <div class="sidebar">
    <h3>Filter by Tags</h3>
    <div class="tags-container">
      <button 
        v-for="tag in sortedTags" 
        :key="tag"
        @click="toggleFilter(tag)"
        :class="['tag-button', { 'tag-selected': selectedFilters.includes(tag) }]"
      >
        {{ tag }}
      </button>
    </div>
    <button @click="clearFilters" class="clear-btn">Clear All</button>
    <p class="results">{{ filteredCount }} listings</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  selectedFilters: {
    type: Array,
    default: () => []
  },
  filteredCount: {
    type: Number,
    default: 0
  }
})

// Emits
const emit = defineEmits(['update:selectedFilters'])

// Available tags
const availableTags = [
  'Books', 'Business', 'Career', 'Creative Work', 'Design', 'Electronics',
  'For Sale', 'Homework Help', 'Housing', 'Job', 'Manual Labor', 'Math',
  'Moving', 'Music', 'Other', 'Photography', 'Professional Help', 'Roommate',
  'Services', 'Study Group', 'Tutoring', 'Yard Work'
]

// Sorted tags
const sortedTags = computed(() => [...availableTags].sort())

// Filter functions
const toggleFilter = (tag) => {
  const newFilters = [...props.selectedFilters]
  const index = newFilters.indexOf(tag)
  
  if (index > -1) {
    newFilters.splice(index, 1)
  } else {
    newFilters.push(tag)
  }
  
  emit('update:selectedFilters', newFilters)
}

const clearFilters = () => {
  emit('update:selectedFilters', [])
}
</script>

<style scoped>
.sidebar {
  position: fixed;
  left: 2rem;
  top: 8rem;
  width: 300px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: fit-content;
  z-index: 10;
}

.sidebar h3 {
  margin: 0 0 1rem 0;
  color: #041E42;
  font-size: 1.1rem;
}

.tags-container {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
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

.clear-btn {
  width: 100%;
  padding: 0.5rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.results {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
  text-align: center;
}

/* Mobile responsive */
@media (max-width: 699.98px) {
  .sidebar {
    position: static;
    left: auto;
    top: auto;
    width: 100%;
    margin-bottom: 1rem;
    z-index: auto;
  }
  
  .tags-container {
    justify-content: center;
  }
}
</style>
