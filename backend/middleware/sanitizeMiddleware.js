import sanitize from 'mongo-sanitize'

/**
 * Middleware to sanitize request data to prevent MongoDB injection attacks
 * Sanitizes req.body (req.query and req.params are sanitized in controllers
 * since they are read-only properties in Express)
 */
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    req.body = sanitize(req.body)
  }
  // Note: req.query and req.params are read-only properties in Express,
  // so they are sanitized directly in the controllers where they are used
  next()
}

