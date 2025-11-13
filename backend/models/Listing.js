import mongoose from 'mongoose'

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  tags: {
    type: [String],
    default: [],
    validate: {
      validator: function(tags) {
        // Optional: validate against allowed tags if needed
        return tags.length <= 10 // Limit to 10 tags max
      },
      message: 'Cannot have more than 10 tags'
    }
  },
  image: {
    type: String, // Store as base64 string or URL
    // TODO NEED TO FIND A WAY TO STORE THE IMAGE IN A DIFFERENT DATABASE LIKE AWS S3
    default: null
  },
  // Reference to the user who created the listing
  // Using String to store Stytch user_id (can be changed to ObjectId if you create a User model)
  createdBy: {
    type: String,
    required: true,
    index: true // Index for faster queries
  },
  // User email for display purposes (optional, can be populated from Stytch)
  createdByEmail: {
    type: String,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
})

// Index for faster queries
listingSchema.index({ createdAt: -1 }) // Sort by newest first
listingSchema.index({ tags: 1 }) // Index for tag filtering

// Virtual for formatted date
listingSchema.virtual('postedAt').get(function() {
  return this.createdAt
})

// Ensure virtuals are included in JSON output
listingSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    // Remove MongoDB internal fields from JSON output
    delete ret.__v
    return ret
  }
})

const Listing = mongoose.model('Listing', listingSchema)

export default Listing

