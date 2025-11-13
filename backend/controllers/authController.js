import stytchClient from '../config/stytch.js'

// Sign up a new user
export const signUp = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body

    console.log('Signup request received:', {
      email: email,
      firstName: firstName,
      lastName: lastName,
      hasPhone: !!phone
    })

    // Validate required fields
    if (!email || !password) {
      console.log('Validation failed: Missing email or password')
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
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
    const { email, password } = req.body

    console.log('Login request received:', {
      email: email
    })

    // Validate required fields
    if (!email || !password) {
      console.log('Validation failed: Missing email or password')
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
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
    const { session_token } = req.body

    console.log('Logout request received')

    // Validate required fields
    if (!session_token) {
      console.log('Validation failed: Missing session_token')
      return res.status(400).json({
        success: false,
        error: 'Session token is required'
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

