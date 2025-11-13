import express from 'express'
import {
  createListing,
  getAllListings,
  getListingById,
  updateListing,
  deleteListing,
  getListingsByUser
} from '../controllers/listingsController.js'
import { authenticateUser } from '../middleware/authMiddleware.js'

const router = express.Router()

// Public routes (no authentication required)
router.get('/', getAllListings) // Get all listings
router.get('/:id', getListingById) // Get single listing by ID
router.get('/user/:userId', getListingsByUser) // Get listings by user ID

// Protected routes (authentication required)
router.post('/', authenticateUser, createListing) // Create new listing
router.put('/:id', authenticateUser, updateListing) // Update listing
router.delete('/:id', authenticateUser, deleteListing) // Delete listing

export default router

