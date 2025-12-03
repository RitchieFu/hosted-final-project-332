import sanitize from 'mongo-sanitize'

/**
 * Middleware to sanitize request data to prevent MongoDB injection attacks
 */

export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body)
  }
  next()
}

