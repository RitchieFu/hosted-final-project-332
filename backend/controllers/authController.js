import stytchClient from '../config/stytch.js'
import { deleteAllListingsByUser } from './listingsController.js'
import sanitize from 'mongo-sanitize'

// Sign up a new user
export const signUp = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { email, password, firstName, lastName, phone } = sanitize(req.body)

    console.log('Signup request received:', {
      email: email,
      firstName: firstName,
      lastName: lastName,
      hasPhone: !!phone
    })

    // Validate required fields and ensure they are strings (not objects)
    // This prevents MongoDB injection via nested objects like {"$ne": null}
    if (!email || typeof email !== 'string') {
      console.log('Validation failed: Missing or invalid email')
      return res.status(400).json({
        success: false,
        error: 'Email is required and must be a string'
      })
    }

    if (!password || typeof password !== 'string') {
      console.log('Validation failed: Missing or invalid password')
      return res.status(400).json({
        success: false,
        error: 'Password is required and must be a string'
      })
    }

    // Validate optional fields are strings if provided
    if (firstName !== undefined && firstName !== null && typeof firstName !== 'string') {
      console.log('Validation failed: Invalid firstName type')
      return res.status(400).json({
        success: false,
        error: 'First name must be a string'
      })
    }

    if (lastName !== undefined && lastName !== null && typeof lastName !== 'string') {
      console.log('Validation failed: Invalid lastName type')
      return res.status(400).json({
        success: false,
        error: 'Last name must be a string'
      })
    }

    if (phone !== undefined && phone !== null && typeof phone !== 'string') {
      console.log('Validation failed: Invalid phone type')
      return res.status(400).json({
        success: false,
        error: 'Phone number must be a string'
      })
    }

    // Validate email domain (must be @zagmail.gonzaga.edu)
    if (!email.toLowerCase().endsWith('@zagmail.gonzaga.edu')) {
      console.log('Validation failed: Invalid email domain')
      return res.status(400).json({
        success: false,
        error: 'Only @zagmail.gonzaga.edu email addresses are allowed'
      })
    }

    console.log('Creating user with Stytch...')
    
    // Create user with Stytch
    const stytchResponse = await stytchClient.passwords.create({
      email: email.toLowerCase(),
      password: password,
      name: {
        first_name: firstName || '',
        last_name: lastName || ''
      },
      phone_number: phone || undefined
    })

    console.log('User created successfully:', {
      user_id: stytchResponse.user_id,
      email: email
    })

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email to verify your account.',
      user_id: stytchResponse.user_id
    })
  } catch (error) {
    console.error('Sign up error:', {
      status_code: error.status_code,
      error_message: error.error_message || error.message,
      email: req.body?.email
    })

    // Handle Stytch-specific errors
    if (error.status_code === 400) {
      return res.status(400).json({
        success: false,
        error: error.error_message || 'Invalid request. Please check your input.'
      })
    }

    if (error.status_code === 409) {
      return res.status(409).json({
        success: false,
        error: 'A user with this email already exists'
      })
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An error occurred during sign up. Please try again.'
    })
  }
}

// Login a user
export const login = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { email, password } = sanitize(req.body)

    console.log('Login request received:', {
      email: email
    })

    // Validate required fields and ensure they are strings (not objects)
    if (!email || typeof email !== 'string') {
      console.log('Validation failed: Missing or invalid email')
      return res.status(400).json({
        success: false,
        error: 'Email is required and must be a string'
      })
    }

    if (!password || typeof password !== 'string') {
      console.log('Validation failed: Missing or invalid password')
      return res.status(400).json({
        success: false,
        error: 'Password is required and must be a string'
      })
    }

    console.log('Authenticating user with Stytch...')
    
    // Authenticate user with Stytch
    const stytchResponse = await stytchClient.passwords.authenticate({
      email: email.toLowerCase(),
      password: password,
      session_duration_minutes: 60
    })

    console.log('User authenticated successfully:', {
      user_id: stytchResponse.user_id,
      email: email
    })

    // Return success response with session info
    res.status(200).json({
      success: true,
      message: 'Login successful',
      user_id: stytchResponse.user_id,
      session_token: stytchResponse.session_token,
      session_jwt: stytchResponse.session_jwt,
      session: stytchResponse.session,
      user: stytchResponse.user
    })
  } catch (error) {
    console.error('Login error:', {
      status_code: error.status_code,
      error_message: error.error_message || error.message,
      error_type: error.error_type,
      email: req.body?.email
    })

    // Handle Stytch-specific errors
    //
    if (error.status_code === 400) {
      return res.status(400).json({
        success: false,
        // error: error.error_message || 'Invalid request. Please check your input.'
        error: "Invalid request. Please check your input."
      })
    }

    if (error.status_code === 401) {
      return res.status(401).json({
        success: false,
        // error: error.error_message || 'Invalid email or password'
        error: "Invalid email or password."
      })
    }

    if (error.status_code === 404) {
      return res.status(404).json({
        success: false,
        // error: error.error_message || 'Email not found'
        error: "Invalid email or password."
      })
    }

    // Handle password reset required
    if (error.error_type === 'reset_password') {
      return res.status(400).json({
        success: false,
        error: 'Password reset required. Please reset your password.',
        requires_password_reset: true
      })
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An error occurred during login. Please try again.'
    })
  }
}

// Logout a user (revoke session)
export const logout = async (req, res) => {
  try {
    // Sanitize input to prevent MongoDB injection attacks
    const { session_token } = sanitize(req.body)

    console.log('Logout request received')

    // Validate required fields and ensure it's a string (not an object)
    if (!session_token || typeof session_token !== 'string') {
      console.log('Validation failed: Missing or invalid session_token')
      return res.status(400).json({
        success: false,
        error: 'Session token is required and must be a string'
      })
    }

    console.log('Revoking session with Stytch...')
    
    // Revoke session with Stytch
    await stytchClient.sessions.revoke({
      session_token: session_token
    })

    console.log('Session revoked successfully')

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    })
  } catch (error) {
    console.error('Logout error:', {
      status_code: error.status_code,
      error_message: error.error_message || error.message,
      error_type: error.error_type
    })

    // Handle Stytch-specific errors
    if (error.status_code === 400) {
      return res.status(400).json({
        success: false,
        error: error.error_message || 'Invalid session token'
      })
    }

    if (error.status_code === 404) {
      return res.status(404).json({
        success: false,
        error: 'Session not found'
      })
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An error occurred during logout. Please try again.'
    })
  }
}

// Delete a user account
// Note: This requires authentication middleware to set req.authenticatedUserId
export const deleteUser = async (req, res) => {
  try {
    // Get user_id from authenticated session (set by middleware)
    const user_id = req.authenticatedUserId

    if (!user_id) {
      console.log('Delete user failed: No authenticated user ID')
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      })
    }

    console.log('Delete user request received:', {
      user_id: user_id
    })

    // Delete all listings created by this user first
    console.log('Deleting user listings...')
    let deletedListingsCount = 0
    try {
      const listingsResult = await deleteAllListingsByUser(user_id)
      deletedListingsCount = listingsResult.deletedCount
      console.log(`Deleted ${deletedListingsCount} listings for user ${user_id}`)
    } catch (error) {
      console.error('Error deleting user listings:', error)
      // Continue with account deletion even if listing deletion fails
      // (user might not have any listings)
    }

    console.log('Deleting user with Stytch...')
    
    // Delete user with Stytch
    await stytchClient.users.delete({
      user_id: user_id
    })

    console.log('User deleted successfully:', {
      user_id: user_id,
      listings_deleted: deletedListingsCount
    })

    // Return success response
    res.status(200).json({
      success: true,
      message: 'User account deleted successfully',
      user_id: user_id,
      listings_deleted: deletedListingsCount
    })
  } catch (error) {
    console.error('Delete user error:', {
      status_code: error.status_code,
      error_message: error.error_message || error.message,
      error_type: error.error_type,
      user_id: req.authenticatedUserId
    })

    // Handle Stytch-specific errors
    if (error.status_code === 400) {
      return res.status(400).json({
        success: false,
        error: error.error_message || 'Invalid user ID'
      })
    }

    if (error.status_code === 404) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      })
    }

    // Generic error response
    res.status(500).json({
      success: false,
      error: 'An error occurred while deleting the account. Please try again.'
    })
  }
}

