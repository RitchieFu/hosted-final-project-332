<template>
  <div class="signup-container">
    <div class="signup-form-container">
      <div class="signup-form">
        <h1 class="signup-title">Create Account</h1>
        <p class="signup-subtitle">Join ZagsHelpZags to start helping your community</p>
        
        <form @submit.prevent="handleSignUp" class="form">
          <div class="form-group">
            <label for="firstName" class="form-label">First Name</label>
            <input 
              type="text" 
              id="firstName" 
              v-model="formData.firstName"
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="lastName" class="form-label">Last Name</label>
            <input 
              type="text" 
              id="lastName" 
              v-model="formData.lastName"
              class="form-input"
              required
            >
          </div>
          
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
          
          <div class="form-group">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              v-model="formData.confirmPassword"
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label for="phone" class="form-label">Phone Number (Optional)</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone"
              class="form-input"
            >
          </div>
          
          <div class="privacy-section">
            <div class="checkbox-container">
              <input 
                type="checkbox" 
                id="privacyAgreement" 
                v-model="privacyAccepted"
                class="privacy-checkbox"
              >
              <label for="privacyAgreement" class="privacy-label">
                I agree to the <a href="#" class="privacy-link">Privacy Policy</a> and understand that my information will be used to provide community services and may be shared with other users for legitimate purposes.
              </label>
            </div>
          </div>
          
          <button 
            type="submit" 
            class="signup-button"
            :class="{ 'disabled': !privacyAccepted || !isFormValid }"
            :disabled="!privacyAccepted || !isFormValid"
          >
            Create Account
          </button>
        </form>
        
        <div class="login-link">
          <p>Already have an account? <RouterLink to="/login" class="link">Sign in here</RouterLink></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'

// Form data
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

// Privacy agreement
const privacyAccepted = ref(false)

// Form validation
const isFormValid = computed(() => {
  return formData.value.firstName && 
         formData.value.lastName && 
         formData.value.email && 
         formData.value.password && 
         formData.value.confirmPassword &&
         formData.value.password === formData.value.confirmPassword
})

// Handle form submission
const handleSignUp = () => {
  if (privacyAccepted.value && isFormValid.value) {
    // TODO: Implement actual sign up logic
    console.log('Sign up data:', formData.value)
    alert('Account created successfully! (This is just a demo)')
  }
}
</script>

<style scoped>
.signup-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.signup-form-container {
  width: 100%;
  max-width: 500px;
}

.signup-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.signup-title {
  color: #041E42;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  text-align: center;
}

.signup-subtitle {
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

.privacy-section {
  margin: 1rem 0;
}

.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.privacy-checkbox {
  margin: 0;
  transform: scale(1.2);
  accent-color: #041E42;
}

.privacy-label {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.4;
  cursor: pointer;
  flex: 1;
}

.privacy-link {
  color: #041E42;
  text-decoration: underline;
}

.privacy-link:hover {
  color: #033a7a;
}

.signup-button {
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

.signup-button:hover:not(.disabled) {
  background-color: #033a7a;
  transform: translateY(-1px);
}

.signup-button.disabled {
  background-color: #ccc;
  cursor: not-allowed;
  transform: none;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e1e5e9;
}

.login-link p {
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

/* Responsive design */
@media (max-width: 768px) {
  .signup-container {
    padding: 1rem;
  }
  
  .signup-form {
    padding: 1.5rem;
  }
  
  .signup-title {
    font-size: 1.75rem;
  }
}
</style>
