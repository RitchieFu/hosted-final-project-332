// Service for managing listings data in localStorage
const STORAGE_KEY = 'zagshelpzags_listings'

// Generate a unique ID for new listings
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Get all listings from localStorage
export const getListings = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading listings from localStorage:', error)
    return []
  }
}

// Save a new listing to localStorage
export const saveListing = (listingData) => {
  try {
    const listings = getListings()
    const newListing = {
      id: generateId(),
      ...listingData,
      createdAt: new Date().toISOString(),
      postedAt: new Date().toISOString()
    }
    
    listings.unshift(newListing) // Add to beginning of array (newest first)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings))
    return newListing
  } catch (error) {
    console.error('Error saving listing to localStorage:', error)
    throw error
  }
}

// Get a specific listing by ID
export const getListingById = (id) => {
  const listings = getListings()
  return listings.find(listing => listing.id === id)
}

// Delete a listing by ID
export const deleteListing = (id) => {
  try {
    const listings = getListings()
    const filteredListings = listings.filter(listing => listing.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredListings))
    return true
  } catch (error) {
    console.error('Error deleting listing from localStorage:', error)
    return false
  }
}

// Clear all listings (useful for testing)
export const clearAllListings = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error clearing listings from localStorage:', error)
    return false
  }
}

// Get listings count
export const getListingsCount = () => {
  return getListings().length
}

// Generate a random date between September 1, 2025 and October 21, 2025
export const generateRandomDate = () => {
  const startDate = new Date('2025-09-01')
  const endDate = new Date('2025-10-21')
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime())
  return new Date(randomTime).toISOString()
}
