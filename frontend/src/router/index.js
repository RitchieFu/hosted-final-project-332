import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ListingsPage from '@/views/ListingsPage.vue'
import PostForm from '@/views/PostForm.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'
import EmailVerificationPage from '@/views/EmailVerificationPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import AccountDeletedPage from '@/views/AccountDeletedPage.vue'

const routes = [
  {path: '/', name: 'home', component: HomePage},
  {path: '/listings', name: 'listings', component: ListingsPage},
  {path: '/post', name: 'post', component: PostForm},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/signup', name: 'signup', component: SignUpPage},
  {path: '/profile', name: 'profile', component: ProfilePage},
  {
    path: '/verify-email', 
    name: 'verify-email', 
    component: EmailVerificationPage,
    beforeEnter: (to, from, next) => {
      // Check if user has just completed signup
      const signupCompleted = sessionStorage.getItem('signupCompleted')
      if (signupCompleted === 'true') {
        // Clear the flag so it can't be accessed again by typing the URL
        sessionStorage.removeItem('signupCompleted')
        next()
      } else {
        // Redirect to signup page if trying to access directly
        next({ name: 'signup' })
      }
    }
  },
  {
    path: '/account-deleted', 
    name: 'account-deleted', 
    component: AccountDeletedPage,
    beforeEnter: (to, from, next) => {
      // Check if user has just deleted their account
      const accountDeleted = sessionStorage.getItem('accountDeleted')
      if (accountDeleted === 'true') {
        // Clear the flag so it can't be accessed again by typing the URL
        sessionStorage.removeItem('accountDeleted')
        next()
      } else {
        // Redirect to home page if trying to access directly
        next({ name: 'home' })
      }
    }
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})