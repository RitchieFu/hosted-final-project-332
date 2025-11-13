import express from 'express'
import { signUp, login, logout, deleteUser } from '../controllers/authController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// Sign up route
router.post('/signup', signUp)

// Login route
router.post('/login', login)

// Logout route
router.post('/logout', logout)

// Delete user route (requires authentication)
router.delete('/user', authenticateUser, deleteUser)

export default router

