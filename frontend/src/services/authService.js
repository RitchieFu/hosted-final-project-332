const API_BASE_URL = 'http://localhost:3000/api'

/**
 * Login a user with email and password
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Response data with session info
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    return data
  } catch (error) {
    console.error('Login service error:', error)
    throw error
  }
}

/**
 * Logout the current user (client-side only)
 * The actual session revocation would be handled by the backend if needed
 */
export const logout = async () => {
  // For now, just clear client-side session
  // In the future, you might want to call a backend endpoint to revoke the session
  return Promise.resolve()
}

