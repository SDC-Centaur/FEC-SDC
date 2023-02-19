// Import required packages
const express = require('express');
const router = express.Router();

// This router is for /reviews
// ---------------------------

/* GET /reviews
 * QueryString [page, count, sort, product_id]
 *
 * page => default 1
 * count => default 5
 * sort => [newest, helpful, relevant]
 *
 */
router.get('/', (req, res) => {
  res.sendStatus(501);
});

/* POST /reviews
 * Body Parameters [product_id, rating, summary, body, recommend, name, email, photos, characteristics]
 *
 * product_id
 * rating => Int [1, 5]
 * summary => String [0, 60]
 * body => String [0, 1000]
 * recommond => Boolean
 * name => String [0, 60]
 * email => String [0, 60]
 * photos => String [0, 100] ## don't allow long url
 * characteristics => { key: value }
 *
 */
router.post('/', (req, res) => {
  res.sendStatus(501);
});


// GET /reviews/meta
// QueryString: product_id
router.get('/meta', (req, res) => {
  res.sendStatus(501);
});


// PUT /reviews/:review_id/helpful
router.put('/:review_id/helpful', (req, res) => {
  res.sendStatus(501);
});

// PUT /reviews/:review_id/report
router.put('/:review_id/report', (req, res) => {
  res.sendStatus(501);
});