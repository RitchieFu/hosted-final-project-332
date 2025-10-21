<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="navbar">
    <div class="nav-container">
      <div class="nav-brand">
        <h2>ZagsHelpZags</h2>
      </div>
      
      <nav class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
        <RouterLink to="/listings" class="nav-link">Listings</RouterLink>
        <RouterLink to="/post" class="nav-link">Post</RouterLink>
      </nav>
      
      <div class="nav-auth">
        <RouterLink to="/login" class="btn-login">Login</RouterLink>
        <RouterLink to="/signup" class="btn-signup">Sign Up</RouterLink>
      </div>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
.navbar {
  background-color: #041E42;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand h2 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.router-link-active {
  background-color: rgba(255, 255, 255, 0.2);
}

.nav-auth {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn-login {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid white;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.btn-login:hover {
  background-color: white;
  color: #041E42;
}

.btn-signup {
  background-color: white;
  color: #041E42;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-signup:hover {
  background-color: #f0f0f0;
  transform: translateY(-1px);
}

/* Responsive design */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  .nav-links {
    gap: 1rem;
  }
  
  .nav-auth {
    gap: 0.5rem;
  }
}
</style>