import express from 'express'
import { signUp, login } from '../controllers/authController.js'

const router = express.Router()

// Sign up route
router.post('/signup', signUp)

// Login route
router.post('/login', login)

export default router

