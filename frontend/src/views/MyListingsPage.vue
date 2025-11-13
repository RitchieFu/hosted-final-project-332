<template>
  <div class="my-listings-container">
    <div class="my-listings-header">
      <h1 class="page-title">My Listings</h1>
      <hr class="title-divider" />
    </div>
  </div>
</template>

<script setup>
// Component logic will be added later
</script>

<style scoped>
.my-listings-container {
  min-height: calc(100vh - 80px);
  background-color: #f5f5f5;
  padding: 2rem;
}

.my-listings-header {
  margin: 2rem auto 0;
  max-width: 80%;
}

.page-title {
  color: #041e42;
  font-size: 3rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.title-divider {
  border: none;
  border-top: 2px solid #e1e5e9;
  margin: 0;
  width: 100%;
}

/* Responsive design */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .my-listings-container {
    padding: 1rem;
  }
  
  .my-listings-header {
    margin: 1rem auto 0;
    max-width: 90%;
  }
}
</style>

