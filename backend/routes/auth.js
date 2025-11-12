import express from 'express'
import { signUp } from '../controllers/authController.js'

const router = express.Router()

// Sign up route
router.post('/signup', signUp)

export default router

