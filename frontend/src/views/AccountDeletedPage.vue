<template>
  <div class="deleted-container">
    <div class="deleted-card">
      <h1 class="deleted-title">Account Deleted</h1>
      <p class="deleted-message">
        You have successfully deleted your account!
      </p>
      <div class="deleted-actions">
        <RouterLink to="/" class="link-button">Go to Home</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.deleted-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 6rem 1rem 2rem 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.deleted-card {
  background: white;
  padding: 3rem 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  text-align: center;
}

.deleted-title {
  color: #041E42;
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.deleted-message {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 2rem 0;
}

.deleted-actions {
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

/* Responsive design */
@media (max-width: 768px) {
  .deleted-container {
    padding: 1rem;
  }
  
  .deleted-card {
    padding: 2rem 1.5rem;
  }
  
  .deleted-title {
    font-size: 1.75rem;
  }
}
</style>

