<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1 class="profile-title">Profile</h1>
      
      <!-- Account Information Section -->
      <div class="info-section">
        <h2 class="section-title">Account Information</h2>
        
        <div class="info-item">
          <label class="info-label">First Name</label>
          <div class="info-value">{{ firstName || 'Not provided' }}</div>
        </div>
        
        <div class="info-item">
          <label class="info-label">Last Name</label>
          <div class="info-value">{{ lastName || 'Not provided' }}</div>
        </div>
        
        <div class="info-item">
          <label class="info-label">Email Address</label>
          <div class="info-value">{{ email || 'Not provided' }}</div>
        </div>
      </div>
      
      <!-- Delete Account Section -->
      <div class="delete-section">
        <h2 class="section-title section-title-danger">Account Management</h2>
        <p class="delete-warning">Account deletion is irreversible. Once you delete your account, you will not be able to recover it.</p>
        <button @click="showDeleteModal = true" class="btn-delete">
          Delete My Account
        </button>
      </div>
    </div>
    
    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
      <div class="modal-content">
        <h2 class="modal-title">Delete Account</h2>
        <p class="modal-message">
          Deleting your account is an irreversible action. Click the checkbox below to confirm your account deletion.
        </p>
        
        <div class="checkbox-container">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="confirmDelete"
              class="checkbox-input"
            >
            <span>I understand that this action cannot be undone</span>
          </label>
        </div>
        
        <div class="modal-actions">
          <button @click="closeDeleteModal" class="btn-cancel">
            Cancel
          </button>
          <button 
            @click="handleDeleteAccount" 
            class="btn-confirm-delete"
            :disabled="!confirmDelete || isDeleting"
          >
            <span v-if="isDeleting">Deleting...</span>
            <span v-else>Delete My Account</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { deleteUser } from '@/services/authService'

const router = useRouter()
const authStore = useAuthStore()
const showDeleteModal = ref(false)
const confirmDelete = ref(false)
const isDeleting = ref(false)

// Get user information
const firstName = computed(() => {
  return authStore.user?.name?.first_name || ''
})

const lastName = computed(() => {
  return authStore.user?.name?.last_name || ''
})

const email = computed(() => {
  return authStore.user?.emails?.[0]?.email || ''
})

const closeDeleteModal = () => {
  showDeleteModal.value = false
  confirmDelete.value = false
}

const handleDeleteAccount = async () => {
  if (!confirmDelete.value || isDeleting.value) {
    return
  }

  isDeleting.value = true

  try {
    const sessionToken = authStore.sessionToken
    
    console.log('Delete account attempt:', {
      hasSessionToken: !!sessionToken,
      tokenPreview: sessionToken ? sessionToken.substring(0, 20) + '...' : null
    })
    
    if (!sessionToken) {
      throw new Error('Session token not found. Please log in again.')
    }

    // Delete user account (session token authenticates the request)
    await deleteUser(sessionToken)

    // Clear session
    authStore.clearSession()
    
    // Set flag to allow access to account deleted page
    sessionStorage.setItem('accountDeleted', 'true')
    
    // Redirect to account deleted confirmation page
    router.push('/account-deleted')
  } catch (error) {
    console.error('Delete account error:', error)
    alert(error.message || 'Failed to delete account. Please try again.')
  } finally {
    isDeleting.value = false
  }
}
</script>

<style scoped>
.profile-container {
  --color-text-secondary: #666;
  
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 6rem 1rem 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 600px;
}

.profile-title {
  color: #041E42;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 2rem 0;
}

.info-section {
  margin-bottom: 3rem;
}

.section-title {
  color: #041E42;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #e1e5e9;
}

.section-title-danger {
  color: #c33;
  border-bottom-color: #fee;
}

.info-item {
  margin-bottom: 1.5rem;
}

.info-label {
  display: block;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.info-value {
  color: #041E42;
  font-size: 1rem;
  padding: 0.75rem;
  background-color: #eeeeee; /* TODO maybe standardize this color */
  border-radius: 4px;
}

.delete-section {
  border-top: 2px solid #fee;
  padding-top: 2rem;
}

.delete-warning {
  color: #444d56;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.btn-delete {
  background-color: #c33;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-delete:hover {
  background-color: #a22;
  transform: translateY(-1px);
}

/* Modal Styles */
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
  z-index: 2000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-title {
  color: #c33;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.modal-message {
  color: var(--color-text-secondary);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.checkbox-container {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #041E42;
  font-size: 0.95rem;
  cursor: pointer;
}

.checkbox-input {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
  flex-shrink: 0;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #041E42;
  border: 1px solid #e1e5e9;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover {
  background-color: #e1e5e9;
}

.btn-confirm-delete {
  background-color: #c33;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-confirm-delete:hover:not(:disabled) {
  background-color: #a22;
}

.btn-confirm-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .profile-container {
    padding: 1rem;
  }
  
  .profile-card {
    padding: 1.5rem;
  }
  
  .profile-title {
    font-size: 1.75rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-cancel,
  .btn-confirm-delete {
    width: 100%;
  }
}
</style>

