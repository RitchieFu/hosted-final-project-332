<template>
  <div class="verification-container">
    <div class="verification-card">
      <h1 class="verification-title">Check Your Email</h1>
      <p class="verification-message">
        A link has been sent to your account if the provided email exists. Please click on the link to verify your email.
      </p>
      <div class="verification-actions">
        <RouterLink to="/login" class="link-button">Go to Login</RouterLink>
        <RouterLink to="/" class="link-button secondary">Return to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.verification-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 6rem 1rem 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.verification-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.verification-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
}

.verification-title {
  color: #041E42;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.verification-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.verification-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

.link-button {
  background-color: #041E42;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
}

.link-button:hover {
  background-color: #033a7a;
  transform: translateY(-1px);
}

.link-button.secondary {
  background-color: transparent;
  color: #041E42;
  border: 2px solid #041E42;
}

.link-button.secondary:hover {
  background-color: #f8f9fa;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .verification-container {
    padding: 1rem;
  }
  
  .verification-card {
    padding: 2rem 1.5rem;
  }
  
  .verification-title {
    font-size: 1.75rem;
  }
}
</style>

