/**
 * Format date to MM/DD/YYYY HH:MM AM/PM format in Pacific Time
 * @param {string|Date} dateValue - Date string or Date object
 * @returns {string} Formatted date string or 'Unknown date' if invalid
 */
export const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Unknown date'
  }
  
  try {
    // Handle both string and Date object
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue)
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Unknown date'
    }
    
    // Get Pacific Time components (handles PST/PDT automatically)
    const pacificTimeString = date.toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles',
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
    
    // Parse the formatted string to extract components
    // Format will be like "01/15/2025, 3:45 PM"
    const parts = pacificTimeString.split(', ')
    if (parts.length !== 2) {
      return 'Unknown date'
    }
    
    const datePart = parts[0] // "01/15/2025"
    const timePart = parts[1] // "3:45 PM"
    
    return `${datePart} at ${timePart}`
  } catch {
    return 'Unknown date'
  }
}

