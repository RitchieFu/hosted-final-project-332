import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { connectDB } from './config/db.js'
import authRoutes from './routes/auth.js'
import listingsRoutes from './routes/listings.js'
import { sanitizeInput } from './middleware/sanitizeMiddleware.js'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables from backend directory
dotenv.config({ path: join(__dirname, '.env') })

const app = express()
const PORT = process.env.PORT || 3000

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

// Middleware
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// Sanitize all inputs to prevent MongoDB injection attacks
app.use(sanitizeInput)

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running!',
    timestamp: new Date().toISOString()
  })
})

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err)
  process.exit(1)
})

// Authentication routes
app.use('/api/auth', authRoutes)

// Listings routes
app.use('/api/listings', listingsRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`)
})

export default app

