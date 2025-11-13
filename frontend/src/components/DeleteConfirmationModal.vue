<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2 class="modal-title">Delete Listing</h2>
        <button @click="handleClose" class="close-button" aria-label="Close modal">
          ×
        </button>
      </div>
      
      <div class="modal-body">
        <p class="confirmation-message">
          Are you sure you want to delete "<strong>{{ listingTitle }}</strong>"?
        </p>
        <p class="warning-text">This action cannot be undone.</p>
        
        <div class="modal-actions">
          <button type="button" @click="handleClose" class="cancel-button">Cancel</button>
          <button type="button" @click="handleConfirm" class="delete-button" :disabled="isDeleting">
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  listingTitle: {
    type: String,
    default: ''
  },
  isDeleting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'confirm'])

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  emit('confirm')
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
  max-width: 500px;
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

.confirmation-message {
  font-size: 1.1rem;
  color: #333;
  margin: 0 0 1rem 0;
  line-height: 1.5;
}

.confirmation-message strong {
  color: #041E42;
  font-weight: 600;
}

.warning-text {
  color: #dc3545;
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover:not(:disabled) {
  background-color: #c82333;
  transform: translateY(-1px);
}

.delete-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .modal-header,
  .modal-body {
    padding: 1rem;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .cancel-button,
  .delete-button {
    width: 100%;
  }
}
</style>

