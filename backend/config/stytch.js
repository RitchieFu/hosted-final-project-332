import stytch from 'stytch'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables if not already loaded (idempotent)
// This ensures it works even if imported before server.js loads dotenv
dotenv.config({ path: join(__dirname, '..', '.env') })

// Validate required environment variables
if (!process.env.STYTCH_PROJECT_ID || !process.env.STYTCH_SECRET) {
  throw new Error(
    'Missing Stytch credentials. Please ensure STYTCH_PROJECT_ID and STYTCH_SECRET are set in your .env file.'
  )
}

// Initialize Stytch client
const client = new stytch.Client({
  project_id: process.env.STYTCH_PROJECT_ID,
  secret: process.env.STYTCH_SECRET
})

export default client

