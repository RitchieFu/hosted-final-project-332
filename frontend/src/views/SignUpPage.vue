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
              :class="{ 'input-error': showPasswordMismatch }"
              required
            >
            <p v-if="showPasswordMismatch" class="error-message">
              Passwords do not match
            </p>
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
                I agree to the <a href="#" @click.prevent="openPrivacyModal" class="privacy-link">Privacy Policy</a> and understand that my information will be used to provide community services and may be shared with other users for legitimate purposes.
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

    <!-- Privacy Policy Modal -->
    <div v-if="showPrivacyModal" class="modal-overlay" @click="closePrivacyModal">
      <div class="privacy-modal" @click.stop>
        <div class="privacy-header">
          <h2>Privacy Policy</h2>
          <button @click="closePrivacyModal" class="close-button">&times;</button>
        </div>
        <div class="privacy-content">
          <p><strong>Information Collection and Use</strong></p>
          <p>ZagsHelpZags collects personal information including your name, email address, phone number, and any content you post to help facilitate community connections and services. We use this information to match you with relevant opportunities, enable communication between users, and improve our platform's functionality.</p>
          
          <p><strong>Data Sharing</strong></p>
          <p>Your contact information and profile details may be shared with other users when you participate in listings or respond to posts. We do not sell your personal information to third parties, but we may share aggregated, anonymized data for research and platform improvement purposes.</p>
          
          <p><strong>Data Security</strong></p>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
          
          <p><strong>Your Rights</strong></p>
          <p>You have the right to access, update, or delete your personal information at any time. You can also opt out of certain communications by adjusting your account settings or contacting us directly.</p>
        </div>
        <div class="privacy-footer">
          <button @click="closePrivacyModal" class="accept-button">I Understand</button>
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
const showPrivacyModal = ref(false)

// Password mismatch validation
const showPasswordMismatch = computed(() => {
  return formData.value.confirmPassword.length > 0 && 
         formData.value.password !== formData.value.confirmPassword
})

// Form validation
const isFormValid = computed(() => {
  return formData.value.firstName && 
         formData.value.lastName && 
         formData.value.email && 
         formData.value.password && 
         formData.value.confirmPassword &&
         formData.value.password === formData.value.confirmPassword
})

// Modal functions
const openPrivacyModal = () => {
  showPrivacyModal.value = true
}

const closePrivacyModal = () => {
  showPrivacyModal.value = false
}

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

.form-input.input-error {
  border-color: #dc3545;
  outline: 2px solid rgba(220, 53, 69, 0.2);
}

.form-input.input-error:focus {
  border-color: #dc3545;
  outline: 2px solid rgba(220, 53, 69, 0.3);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin: 0.25rem 0 0 0;
  font-weight: 500;
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

/* Privacy Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.privacy-modal {
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.privacy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  background-color: #f8f9fa;
}

.privacy-header h2 {
  margin: 0;
  color: #041E42;
  font-size: 1.5rem;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #e9ecef;
}

.privacy-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.privacy-content p {
  margin: 0 0 1rem 0;
  line-height: 1.6;
  color: #333;
}

.privacy-content p:last-child {
  margin-bottom: 0;
}

.privacy-content strong {
  color: #041E42;
  font-weight: 600;
}

.privacy-footer {
  padding: 1.5rem;
  border-top: 1px solid #e1e5e9;
  background-color: #f8f9fa;
  text-align: center;
}

.accept-button {
  background-color: #041E42;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.accept-button:hover {
  background-color: #033a7a;
  transform: translateY(-1px);
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
  
  .modal-overlay {
    padding: 0.5rem;
  }
  
  .privacy-modal {
    max-height: 90vh;
  }
  
  .privacy-header,
  .privacy-content,
  .privacy-footer {
    padding: 1rem;
  }
}
</style>
