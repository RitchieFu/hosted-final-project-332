<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-form">
        <h1 class="login-title">Sign In</h1>
        <p class="login-subtitle">Welcome back to ZagsHelpZags</p>
        
        <form @submit.prevent="handleLogin" class="form">
          <div class="form-group">
            <label for="email" class="form-label">Email Address</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email"
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input 
              type="password" 
              id="password" 
              v-model="formData.password"
              class="form-input"
              required
            >
          </div>
          
          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="login-button"
            :class="{ 'disabled': !isFormValid }"
            :disabled="!isFormValid"
          >
            <span v-if="isLoading">Signing In...</span>
            <span v-else>Sign In</span>
          </button>
        </form>
        
        <div class="signup-link">
          <p>Don't have an account? <RouterLink to="/signup" class="link">Sign up here</RouterLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { login as loginService } from '@/services/authService'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const formData = ref({
  email: '',
  password: ''
})

// Loading and error states
const isLoading = ref(false)
const errorMessage = ref('')

// Form validation
const isFormValid = computed(() => {
  return formData.value.email && formData.value.password && !isLoading.value
})

// Handle form submission
const handleLogin = async () => {
  if (!isFormValid.value) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    // Call login service
    const response = await loginService(
      formData.value.email,
      formData.value.password
    )

    if (response.success) {
      // Store session in auth store
      authStore.setSession({
        session_token: response.session_token,
        session_jwt: response.session_jwt,
        user_id: response.user_id,
        user: response.user,
        session: response.session
      })

      // Redirect to home page
      router.push('/')
    } else {
      errorMessage.value = response.error || 'Login failed. Please try again.'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = error.message || 'Failed to connect to server. Please check if the backend is running.'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 6rem 1rem 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.login-form-container {
  width: 100%;
  max-width: 500px;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-title {
  color: #041E42;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0 0 2rem 0;
  text-align: center;
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
  color: #041E42;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #041E42;
}

.login-button {
  background-color: #041E42;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.login-button:hover:not(.disabled) {
  background-color: #033a7a;
  transform: translateY(-1px);
}

.login-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.signup-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.signup-link p {
  margin: 0;
  color: #666;
}

.link {
  color: #041E42;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  text-decoration: underline;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  border: 1px solid #fcc;
}

/* Responsive design */
@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
  }
  
  .login-form {
    padding: 1.5rem;
  }
  
  .login-title {
    font-size: 1.75rem;
  }
}
</style>
