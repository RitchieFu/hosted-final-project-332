import stytchClient from '../config/stytch.js'

/**
 * Authentication middleware
 * Verifies the session token and attaches the authenticated user_id to the request
 */
export const authenticateUser = async (req, res, next) => {
  try {
    // Extract session token from Authorization header or request body
    let sessionToken = null
    
    // Try Authorization header first (Bearer token)
    // Express lowercases headers, so check both 'authorization' and 'Authorization'
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (authHeader && authHeader.startsWith('Bearer ')) {
      sessionToken = authHeader.substring(7).trim() // Remove 'Bearer ' prefix and trim whitespace
    }
    
    // Fallback to request body if not in header
    if (!sessionToken && req.body?.session_token) {
      sessionToken = req.body.session_token
    }

    // Debug logging
    console.log('Authentication attempt:', {
      hasAuthHeader: !!authHeader,
      authHeaderValue: authHeader ? authHeader.substring(0, 20) + '...' : null,
      hasBodyToken: !!req.body?.session_token,
      extractedToken: sessionToken ? sessionToken.substring(0, 20) + '...' : null
    })

    // Validate session token is present
    if (!sessionToken) {
      console.log('Authentication failed: Missing session token')
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please log in.'
      })
    }

    // Authenticate session with Stytch
    // According to Stytch docs: https://stytch.com/docs/api/session-auth
    // Response has user_id at root level and also in session.user_id
    const sessionResponse = await stytchClient.sessions.authenticate({
      session_token: sessionToken
    })

    // Log response structure for debugging
    console.log('Stytch response keys:', Object.keys(sessionResponse))
    console.log('Has user_id at root:', !!sessionResponse.user_id)
    console.log('Has session object:', !!sessionResponse.session)
    if (sessionResponse.session) {
      console.log('Session keys:', Object.keys(sessionResponse.session))
      console.log('Has session.user_id:', !!sessionResponse.session.user_id)
    }

    // Extract user_id from response - try root level first, then session object
    const userId = sessionResponse.user_id || sessionResponse.session?.user_id

    if (!userId) {
      console.error('No user_id found in Stytch response. Full response structure:', {
        rootKeys: Object.keys(sessionResponse),
        hasSession: !!sessionResponse.session,
        sessionKeys: sessionResponse.session ? Object.keys(sessionResponse.session) : null
      })
      return res.status(401).json({
        success: false,
        error: 'Unable to identify user from session. Please log in again.'
      })
    }

    console.log('Session authenticated successfully:', {
      user_id: userId,
      session_id: sessionResponse.session?.session_id
    })

    // Attach authenticated user info to request object
    req.authenticatedUserId = userId
    req.sessionToken = sessionToken

    // Continue to the next middleware/controller
    next()
  } catch (error) {
    console.error('Authentication error:', {
      status_code: error.status_code,
      error_message: error.error_message || error.message,
      error_type: error.error_type
    })

    // Handle Stytch-specific errors
    if (error.status_code === 401) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session. Please log in again.'
      })
    }

    if (error.status_code === 404) {
      return res.status(401).json({
        success: false,
        error: 'Session not found. Please log in again.'
      })
    }

    // Generic authentication error
    return res.status(401).json({
      success: false,
      error: 'Authentication failed. Please log in again.'
    })
  }
}

