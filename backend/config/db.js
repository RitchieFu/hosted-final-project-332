import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables if not already loaded
dotenv.config({ path: join(__dirname, '..', '.env') })

// MongoDB connection URI - defaults to localhost if not set
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test'

/**
 * Connect to MongoDB
 * This function establishes a connection to MongoDB using Mongoose
 */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      // These options are recommended for Mongoose 6+
      // Remove useNewUrlParser and useUnifiedTopology as they're default in Mongoose 6+
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
    console.log(`Database: ${conn.connection.name}`)
    
    return conn
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message)
    process.exit(1)
  }
}

/**
 * Disconnect from MongoDB
 * Useful for graceful shutdowns
 */
export const disconnectDB = async () => {
  try {
    await mongoose.disconnect()
    console.log('MongoDB Disconnected')
  } catch (error) {
    console.error('Error disconnecting from MongoDB:', error.message)
  }
}

export default mongoose

