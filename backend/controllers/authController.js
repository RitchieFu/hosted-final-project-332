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

