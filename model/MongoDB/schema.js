// Import required class and functions from mongoose
const { Schema } = require('mongoose');

// Create reviews Schema, the data type and validation are based on CSV and client requirement
// Do not set up index here, leave it for later optimzation
const reviewSchema = new mongoose.Schema({
  _id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  date: { type: Date, default: Date.now },
  summary: { type: String, required: true, maxLength: 60 },
  body: { type: String, required: true, maxLength: 1000 },
  recommend: { type: Boolean, default: false },
  reported: { type: Boolean, default: false },
  reviewer_name: { type: String, required: true, maxLength: 60 },
  reviewer_email: { type: String, required: true, maxLength: 60 },
  response: { type: String, default: null },
  helpfulness: { type: Number, default: 0, min: 0},
  photos: [ { type: String, maxLength: 100 } ],
  char_keys: [ { type: String, maxLength: 10 } ],
  char_values: [ { type: Number, min: 1, max: 5 } ],
});

// Export the Review Schema
module.exports = { reviewSchema };
