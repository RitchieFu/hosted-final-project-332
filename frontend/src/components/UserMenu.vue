<template>
  <div class="user-menu" ref="dropdownRef">
    <button @click="toggleDropdown" class="btn-welcome">
      Welcome, {{ firstName }}
      <span class="dropdown-arrow" :class="{ 'open': showDropdown }">▼</span>
    </button>
    
    <div v-if="showDropdown" class="dropdown-menu">
      <button @click="handleProfile" class="dropdown-item">
        Profile
      </button>
      <button @click="handleMyListings" class="dropdown-item">
        My Listings
      </button>
      <button 
        @click="handleLogout" 
        class="dropdown-item dropdown-item-danger"
        :disabled="isLoggingOut"
      >
        <span v-if="isLoggingOut">Logging out...</span>
        <span v-else>Log out</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { logout as logoutService } from '@/services/authService'

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)
const dropdownRef = ref(null)
const isLoggingOut = ref(false)

// Get user's first name
const firstName = computed(() => {
  if (authStore.user?.name?.first_name) {
    return authStore.user.name.first_name
  }
  // Fallback to email if name not available
  if (authStore.user?.emails?.[0]?.email) {
    return authStore.user.emails[0].email.split('@')[0]
  }
  return 'User'
})

// Toggle dropdown
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

// Handlers
const handleProfile = () => {
  showDropdown.value = false
  router.push('/profile')
}

// Placeholder handlers
const handleMyListings = () => {
  console.log('My Listings clicked')
  showDropdown.value = false
  // TODO: Navigate to My Listings page
}

const handleLogout = async () => {
  if (isLoggingOut.value) {
    return // Prevent multiple clicks
  }

  isLoggingOut.value = true
  showDropdown.value = false

  try {
    // Get session token before clearing
    const sessionToken = authStore.sessionToken

    // Revoke session on backend
    if (sessionToken) {
      await logoutService(sessionToken)
    }

    // Clear session from store (this also clears localStorage)
    authStore.clearSession()

    // Redirect to login page
    router.push('/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Even if backend logout fails, clear local session
    authStore.clearSession()
    router.push('/login')
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu {
  position: relative;
}

.btn-welcome {
  background-color: white;
  color: #041E42;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
}

.btn-welcome:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

.dropdown-arrow {
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.dropdown-arrow.open {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  overflow: hidden;
  z-index: 1000;
  animation: slideDown 0.2s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 0.95rem;
  color: #041E42;
  transition: background-color 0.2s ease;
  display: block;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item-danger {
  color: #c33;
  border-top: 1px solid #e1e5e9;
}

.dropdown-item-danger:hover:not(:disabled) {
  background-color: #fee;
}

.dropdown-item:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .dropdown-menu {
    right: auto;
    left: 0;
  }
}
</style>

