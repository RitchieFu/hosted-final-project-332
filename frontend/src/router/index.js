import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/views/HomePage.vue'
import ListingsPage from '@/views/ListingsPage.vue'
import PostForm from '@/views/PostForm.vue'
import LoginPage from '@/views/LoginPage.vue'
import SignUpPage from '@/views/SignUpPage.vue'

const routes = [
  {path: '/', name: 'home', component: HomePage},
  {path: '/listings', name: 'listings', component: ListingsPage},
  {path: '/post', name: 'post', component: PostForm},
  {path: '/login', name: 'login', component: LoginPage},
  {path: '/signup', name: 'signup', component: SignUpPage},
]

export default createRouter({
  history: createWebHistory(),
  routes,
})