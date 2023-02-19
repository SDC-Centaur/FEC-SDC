// Import required packages
const path = require('path');
const express = require('express');
const app = express();
const { RatingReviewRouter } = require('./RatingReviewRouter.js');
require('dotenv').config(path.join(__dirname, '../.env'));

// Top level middlewares
app.use(express.json());

// Routers
app.use('/reviews', RatingReviewRouter);

// Run app
const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => console.log(`App listening on PORT ${PORT}...`));