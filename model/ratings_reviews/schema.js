// Import required class and functions from mongoose
const { Schema } = require('mongoose');

// Create reviews Schema, the data type and validation are based on CSV and client requirement
// Do not set up index here, leave it for later optimzation
const reviewSchema = new Schema({
  product_id: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
  summary: { type: String, required: true, maxLength: 60 },
  body: { type: String, required: true, minLength: 50, maxLength: 1000 },
  recommend: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
  reviewer_name: { type: String, required: true, maxLength: 60 },
  reviewer_email: { type: String, required: true, maxLength: 60 },
  response: { type: String, default: null },
  helpfulness: { type: Number, default: 0, min: 0},
  photos: [ String ],
  characteristics: { type: Map, of: Number }
});

// Create reviews meta Schema.
// The model can only be updated, not deleted nor created
const reviewMetaSchema = new Schema({
  _id: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  ratings: { type: Map, of: { type: Number, min: 0 } },
  recommend: {
    'true': Number,
    'false': Number
  },
  characteristics: { type: Map, of: { type: Number, min: 0 } }
});


// Export the schemas
module.exports = { reviewSchema, reviewMetaSchema };
