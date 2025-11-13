// Service for managing listings data via API
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = 'http://localhost:3000/api'

// Helper to get auth headers
const getAuthHeaders = () => {
  const authStore = useAuthStore()
  const headers = {
    'Content-Type': 'application/json'
  }
  
  const authHeader = authStore.getAuthHeader()
  if (authHeader.Authorization) {
    headers.Authorization = authHeader.Authorization
  }
  
  return headers
}

// Helper to transform MongoDB _id to id for frontend compatibility
const transformListing = (listing) => {
  if (!listing) return listing
  return {
    ...listing,
    id: listing._id || listing.id
  }
}

// Get all listings from API
// Optional parameters:
// - hours: Filter listings created within the last X hours (e.g., { hours: 12 })
// - days: Filter listings created within the last X days (e.g., { days: 7 })
// - limit: Number of listings per page (default: 50)
// - skip: Number of listings to skip for pagination (default: 0)
// Returns: { listings: [...], pagination: { total, limit, skip, hasMore } }
export const getListings = async (options = {}) => {
  try {
    const { hours, days, limit, skip } = options
    
    // Build query string
    const queryParams = new URLSearchParams()
    if (hours && hours > 0) {
      queryParams.append('hours', hours.toString())
    } else if (days && days > 0) {
      queryParams.append('days', days.toString())
    }
    if (limit && limit > 0) {
      queryParams.append('limit', limit.toString())
    }
    if (skip && skip >= 0) {
      queryParams.append('skip', skip.toString())
    }
    
    const queryString = queryParams.toString()
    const url = queryString 
      ? `${API_BASE_URL}/listings?${queryString}`
      : `${API_BASE_URL}/listings`

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch listings')
    }

    // Transform listings to include id field
    const listings = (data.data || []).map(transformListing)
    
    // Return listings with pagination info
    return {
      listings,
      pagination: data.pagination || {
        total: listings.length,
        limit: limit || 50,
        skip: skip || 0,
        hasMore: false
      }
    }
  } catch (error) {
    console.error('Error loading listings from API:', error)
    // Return empty result on error
    return {
      listings: [],
      pagination: {
        total: 0,
        limit: options.limit || 50,
        skip: options.skip || 0,
        hasMore: false
      }
    }
  }
}

// Save a new listing to API (requires authentication)
export const saveListing = async (listingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create listing')
    }

    return transformListing(data.data)
  } catch (error) {
    console.error('Error saving listing to API:', error)
    throw error
  }
}

// Get a specific listing by ID
export const getListingById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch listing')
    }

    return transformListing(data.data)
  } catch (error) {
    console.error('Error fetching listing from API:', error)
    return null
  }
}

// Delete a listing by ID (requires authentication)
export const deleteListing = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete listing')
    }

    return true
  } catch (error) {
    console.error('Error deleting listing from API:', error)
    throw error // Re-throw so caller can handle it
  }
}

// Update a listing (requires authentication)
export const updateListing = async (id, listingData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(listingData)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update listing')
    }

    return transformListing(data.data)
  } catch (error) {
    console.error('Error updating listing via API:', error)
    throw error
  }
}

// Get listings by user ID
export const getListingsByUser = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/user/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch user listings')
    }

    // Transform listings to include id field
    const listings = (data.data || []).map(transformListing)
    return listings
  } catch (error) {
    console.error('Error fetching user listings from API:', error)
    return []
  }
}

// Get listings count (last 7 days only)
export const getListingsCount = async () => {
  const result = await getListings({ days: 7 })
  return result.pagination.total
}

// Generate a random date between September 1, 2025 and October 21, 2025
export const generateRandomDate = () => {
  const startDate = new Date('2025-09-01')
  const endDate = new Date('2025-10-21')
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTime).toISOString()
}
