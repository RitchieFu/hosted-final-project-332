import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const STORAGE_KEY = 'auth_session'
const SESSION_EXPIRY_KEY = 'auth_session_expires_at'

export const useAuthStore = defineStore('auth', () => {
  // State
  const sessionToken = ref(null)
  const sessionJwt = ref(null)
  const userId = ref(null)
  const user = ref(null)
  const expiresAt = ref(null)

  // Initialize from localStorage on store creation
  const initializeFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const storedExpiry = localStorage.getItem(SESSION_EXPIRY_KEY)
      
      if (stored && storedExpiry) {
        const sessionData = JSON.parse(stored)
        const expiryTime = new Date(storedExpiry)
        
        // Check if session is still valid
        if (expiryTime > new Date()) {
          sessionToken.value = sessionData.session_token
          sessionJwt.value = sessionData.session_jwt
          userId.value = sessionData.user_id
          user.value = sessionData.user
          expiresAt.value = storedExpiry
        } else {
          // Session expired, clear storage
          clearSession()
        }
      }
    } catch (error) {
      console.error('Error initializing auth from storage:', error)
      clearSession()
    }
  }

  // Computed
  const isAuthenticated = computed(() => {
    if (!sessionToken.value || !expiresAt.value) {
      return false
    }
    // Check if session is still valid
    const expiryTime = new Date(expiresAt.value)
    return expiryTime > new Date()
  })

  // Actions
  const setSession = (sessionData) => {
    sessionToken.value = sessionData.session_token
    sessionJwt.value = sessionData.session_jwt
    userId.value = sessionData.user_id
    user.value = sessionData.user
    
    // Use session expiry from Stytch if available, otherwise calculate 60 minutes from now
    if (sessionData.session?.expires_at) {
      expiresAt.value = sessionData.session.expires_at
    } else {
      // Fallback: Calculate expiry time (60 minutes from now)
      const expiryTime = new Date()
      expiryTime.setMinutes(expiryTime.getMinutes() + 60)
      expiresAt.value = expiryTime.toISOString()
    }

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        session_token: sessionToken.value,
        session_jwt: sessionJwt.value,
        user_id: userId.value,
        user: user.value
      }))
      localStorage.setItem(SESSION_EXPIRY_KEY, expiresAt.value)
    } catch (error) {
      console.error('Error saving session to storage:', error)
    }
  }

  const clearSession = () => {
    sessionToken.value = null
    sessionJwt.value = null
    userId.value = null
    user.value = null
    expiresAt.value = null

    // Clear localStorage
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(SESSION_EXPIRY_KEY)
    } catch (error) {
      console.error('Error clearing session from storage:', error)
    }
  }

  const getAuthHeader = () => {
    if (sessionToken.value) {
      return {
        'Authorization': `Bearer ${sessionToken.value}`
      }
    }
    return {}
  }

  // Initialize on store creation
  initializeFromStorage()

  return {
    // State
    sessionToken,
    sessionJwt,
    userId,
    user,
    expiresAt,
    // Computed
    isAuthenticated,
    // Actions
    setSession,
    clearSession,
    getAuthHeader,
    initializeFromStorage
  }
})

