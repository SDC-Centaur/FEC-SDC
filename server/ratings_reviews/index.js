require('dotenv').config();
const express = require('express');
const app = express();
const RatingReviewRouter = require('./RatingReviewRouter.js');
const { connect, disconnect } = require('../../model/ratings_reviews');

// Top-level middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use('/reviews', RatingReviewRouter);


// Listen app
const PORT = process.env.PORT || 3000;

(async() => {
  await connect();
  app.listen(PORT, () => console.log(`App listening on PORT ${PORT}`));
})();
