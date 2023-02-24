const express = require('express');
const path = require('path');
const router = express.Router();
const Joi = require('joi');
const Review = require('../../model/ratings_reviews/index.js');

// Joi Schema for post data
const Rating = Joi.number().integer().min(1).max(5).required();
const ShortText = Joi.string().max(60).required();
const LongText = Joi.string().min(50).max(1000).required();

const schema = Joi.object({
  product_id: Joi.number().integer().required(),
  rating: Rating,
  summary: ShortText,
  body: LongText,
  recommend: Joi.boolean().required(),
  reviewer_name: ShortText,
  reviewer_email: ShortText.email(),
  photos: Joi.array().items(Joi.string().max(1000)),
  characteristics: Joi.object().pattern(/[a-zA-Z]+/, Rating)
}).rename(/(name|email)/, Joi.expression(`reviewer_{#1}`));


// GET /reviews
router.get('/', async (req, res) => {
  // Parse from query strings
  const { product_id, page = 1, count = 5, sort = 'relevant' } = req.query;

  // If no product_id, then this is bad request
  if (!product_id) {
    res.sendStatus(400);
    return;
  }
  
  // Convert to Integer if needed 
  const params = { product_id: +product_id, page: +page, count: +count, sort };

  try {
    const result = await Review.getReviewsById(params);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  } 
});

// GET /reviews/meta
router.get('/meta', async (req, res) => {
  const { product_id } = req.query;

  // If no product_id, then this is bad request
  if (!product_id) {
    res.sendStatus(400);
    return;
  }

  try {
    const result = await Review.getReviewsMetaById(+product_id);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// POST /reviews
router.post('/', async (req, res) => {
  try {
    const value = await schema.validateAsync(req.body);
    await Review.createReview(value);
    res.sendStatus(201); 
  } catch (err) {
    console.log(err);
    if (err.name === 'ValidationError') {
      res.status(401).json({ error });
    } else {
      res.sendStatus(500);
    }
  }
});

// PUT /reviews/:review_id/helpful
router.put('/:review_id/helpful', async (req, res) => {
  const { review_id } = req.params;
  console.log(review_id);
  
  try {
    await Review.markHelpfulById(review_id);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// PUT /reviews/:review_id/report
router.put('/:review_id/report', async (req, res) => {
  const { review_id } = req.params;

  try {
    await Review.reportReviewById(review_id);
    res.sendStatus(201);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

module.exports = router;
