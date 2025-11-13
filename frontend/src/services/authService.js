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
 * Logout the current user and revoke the session
 * @param {string} sessionToken - The session token to revoke
 * @returns {Promise<Object>} Response data
 */
export const logout = async (sessionToken) => {
  try {
    if (!sessionToken) {
      throw new Error('Session token is required')
    }

    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_token: sessionToken
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Logout failed')
    }

    return data
  } catch (error) {
    console.error('Logout service error:', error)
    throw error
  }
}

/**
 * Delete a user account
 * @param {string} sessionToken - The session token for authentication
 * @returns {Promise<Object>} Response data
 */
export const deleteUser = async (sessionToken) => {
  try {
    if (!sessionToken) {
      throw new Error('Session token is required')
    }

    const response = await fetch(`${API_BASE_URL}/auth/user`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete account')
    }

    return data
  } catch (error) {
    console.error('Delete user service error:', error)
    throw error
  }
}

