<template>
  <div class="home-container">
    <!-- Left side - Image -->
    <div class="image-section">
      <img 
        src="https://images.unsplash.com/photo-1602440758852-f7a1e4696127?" 
        alt="Students helping each other" 
        class="hero-image"
      />
    </div>
    
    <!-- Right side - Text and buttons -->
    <div class="text-section">
      <h1 class="main-title">Zags Help Zags</h1>
      <p class="subtitle">Contribute meaningfully to your community today!</p>
      
      <div class="button-group">
        <router-link to="/login" class="btn btn-primary">Log In</router-link>
        <router-link to="/signup" class="btn btn-secondary">Sign Up</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.image-section {
  flex: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.hero-image {
  width: 90%;
  height: 70%;
  object-fit: cover;
  border-radius: 8px;
}

.text-section {
  flex: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
  background-color: #f8f9fa;
}

.main-title {
  font-size: 4rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.3rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-weight: 300;
  line-height: 1.4;
}

.button-group {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  min-width: 140px;
}

.btn-primary {
  background-color: #2c3e50;
  color: white;
}

.btn-primary:hover {
  background-color: #34495e;
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: transparent;
  color: #2c3e50;
  border: 2px solid #2c3e50;
}

.btn-secondary:hover {
  background-color: #2c3e50;
  color: white;
  transform: translateY(-2px);
}

/* Responsive design */
@media (max-width: 768px) {
  .home-container {
    flex-direction: column;
  }
  
  .image-section {
    height: 50vh;
    padding: 1rem;
  }
  
  .text-section {
    height: 50vh;
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.2rem;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }
  
  .btn {
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    min-width: 120px;
  }
}
</style>