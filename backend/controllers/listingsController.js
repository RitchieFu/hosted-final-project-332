import Listing from '../models/Listing.js'
import sanitize from 'mongo-sanitize'

/**
 * Create a new listing
 * POST /api/listings
 */
export const createListing = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { title, description, tags, image } = sanitize(req.body)
    const userId = req.authenticatedUserId // From auth middleware

    // Validate required fields and ensure they are strings (not objects)
    // This prevents MongoDB injection via nested objects like {"$ne": null}
    if (!title || typeof title !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be a string'
      })
    }
    
    if (!description || typeof description !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Description is required and must be a string'
      })
    }

    // Create new listing
    const listing = new Listing({
      title,
      description,
      tags: tags || [],
      image: image || null,
      createdBy: userId,
      createdByEmail: null // Can be populated from Stytch if needed
    })

    const savedListing = await listing.save()

    console.log('Listing created successfully:', {
      listingId: savedListing._id,
      title: savedListing.title,
      createdBy: savedListing.createdBy,
      createdAt: savedListing.createdAt 
    })

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: savedListing
    })
  } catch (error) {
    console.error('Error creating listing:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create listing',
      details: error.message
    })
  }
}

/**
 * Get all listings
 * GET /api/listings
 * Optional query params: tags (comma-separated), limit, skip, hours, days
 * - hours: Filter listings created within the last X hours (e.g., ?hours=12)
 * - days: Filter listings created within the last X days (e.g., ?days=7)
 */
export const getAllListings = async (req, res) => {
  try {
    // Sanitize query parameters to prevent MongoDB injection attacks
    const { tags, limit = 50, skip = 0, hours, days } = sanitize(req.query)

    // Build query
    const query = {}
    
    // Filter by tags if provided
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim())
      query.tags = { $in: tagArray }
    }

    // Filter by time period if provided (hours takes precedence over days)
    if (hours || days) {
      const hoursValue = hours ? parseInt(hours) : null
      const daysValue = days ? parseInt(days) : null
      
      // Calculate cutoff date in milliseconds
      let cutoffMilliseconds = 0
      if (hoursValue && hoursValue > 0) {
        cutoffMilliseconds = hoursValue * 60 * 60 * 1000 // Convert hours to milliseconds
      } else if (daysValue && daysValue > 0) {
        cutoffMilliseconds = daysValue * 24 * 60 * 60 * 1000 // Convert days to milliseconds
      }
      
      if (cutoffMilliseconds > 0) {
        const cutoffDate = new Date(Date.now() - cutoffMilliseconds)
        // Show listings if either created OR updated within the time period
        query.$or = [
          { createdAt: { $gte: cutoffDate } },
          { updatedAt: { $gte: cutoffDate } }
        ]
      }
    }

    // Execute query with pagination
    const listings = await Listing.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .lean() // Return plain JavaScript objects

    // Ensure dates are properly serialized (lean() returns Date objects)
    const serializedListings = listings.map(listing => ({
      ...listing,
      createdAt: listing.createdAt ? listing.createdAt.toISOString() : listing.createdAt,
      updatedAt: listing.updatedAt ? listing.updatedAt.toISOString() : listing.updatedAt
    }))

    // Get total count for pagination
    const total = await Listing.countDocuments(query)

    res.json({
      success: true,
      data: serializedListings,
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + serializedListings.length < total
      }
    })
  } catch (error) {
    console.error('Error fetching listings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch listings',
      details: error.message
    })
  }
}

/**
 * Get a single listing by ID
 * GET /api/listings/:id
 */
export const getListingById = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { id } = sanitize(req.params)

    const listing = await Listing.findById(id).lean()

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      })
    }

    res.json({
      success: true,
      data: listing
    })
  } catch (error) {
    console.error('Error fetching listing:', error)
    
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to fetch listing',
      details: error.message
    })
  }
}

/**
 * Update a listing
 * PUT /api/listings/:id
 * Only the creator can update their listing
 */
export const updateListing = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { id } = sanitize(req.params)
    const { title, description, tags, image } = sanitize(req.body)
    const userId = req.authenticatedUserId

    // Find the listing
    const listing = await Listing.findById(id)

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      })
    }

    // Check if user is the creator
    if (listing.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only update your own listings'
      })
    }

    // Update fields
    if (title !== undefined) listing.title = title
    if (description !== undefined) listing.description = description
    if (tags !== undefined) listing.tags = tags
    if (image !== undefined) listing.image = image

    const updatedListing = await listing.save()

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    })
  } catch (error) {
    console.error('Error updating listing:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to update listing',
      details: error.message
    })
  }
}

/**
 * Delete a listing
 * DELETE /api/listings/:id
 * Only the creator can delete their listing
 */
export const deleteListing = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { id } = sanitize(req.params)
    const userId = req.authenticatedUserId

    // Find the listing
    const listing = await Listing.findById(id)

    if (!listing) {
      return res.status(404).json({
        success: false,
        error: 'Listing not found'
      })
    }

    // Check if user is the creator
    if (listing.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        error: 'You can only delete your own listings'
      })
    }

    await Listing.findByIdAndDelete(id)

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting listing:', error)
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid listing ID format'
      })
    }

    res.status(500).json({
      success: false,
      error: 'Failed to delete listing',
      details: error.message
    })
  }
}

/**
 * Delete all listings by a user ID
 * This is used when a user deletes their account
 * @param {string} userId - Stytch user ID
 * @returns {Promise<{deletedCount: number}>} Number of listings deleted
 */
export const deleteAllListingsByUser = async (userId) => {
  try {
    if (!userId) {
      throw new Error('User ID is required')
    }

    const result = await Listing.deleteMany({ createdBy: userId })
    
    console.log(`Deleted ${result.deletedCount} listings for user ${userId}`)
    
    return {
      deletedCount: result.deletedCount
    }
  } catch (error) {
    console.error('Error deleting listings by user:', error)
    throw error
  }
}

/**
 * Get listings by user
 * GET /api/listings/user/:userId
 */
export const getListingsByUser = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { userId } = sanitize(req.params)

    const listings = await Listing.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .lean()

    // Ensure dates are properly serialized (lean() returns Date objects)
    const serializedListings = listings.map(listing => ({
      ...listing,
      createdAt: listing.createdAt ? listing.createdAt.toISOString() : listing.createdAt,
      updatedAt: listing.updatedAt ? listing.updatedAt.toISOString() : listing.updatedAt
    }))

    res.json({
      success: true,
      data: serializedListings
    })
  } catch (error) {
    console.error('Error fetching user listings:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user listings',
      details: error.message
    })
  }
}

