import express from 'express'
import { signUp, login, logout } from '../controllers/authController.js'

const router = express.Router()

// Sign up route
router.post('/signup', signUp)

// Login route
router.post('/login', login)

// Logout route
router.post('/logout', logout)

export default router

