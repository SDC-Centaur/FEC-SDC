// Import required packages
const mongoose = require('mongoose');
const { reviewSchema, reviewMetaSchema } = require('./schema.js');

// Suppress warning of strictQuery
mongoose.set('strictQuery', false);

// Build Models
const reviewModel = mongoose.model('Review', reviewSchema);
const reviewMetaModel = mongoose.model('ReviewMeta', reviewMetaSchema);

// Connect to a specific database, default SDC
async function connect(database = 'SDC') {
  await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);
}

// Disconnect to the current database
async function disconnect() {
  await mongoose.connection.close();
}

// Get all reviews of a product_id
// Three sort avaiable => relevant, newest, helpful
// Pagination enabled, default first page, page of 5
async function getReviewsById({ product_id, sort = 'relevant', page = 1, count = 5 }) {
  let results;

  // Algorithm: Relevance = Helpfulness - (Date - Now)/K
  // K is a static factor subject to change when data changed
  const K = 365*3*24*60*60*1000/50;
  if (sort === 'relevant') {
    results = await reviewModel.aggregate([
      { $match: { product_id, reported: false } },
      { 
        $set: { 
          relevance: { 
            $subtract: [
              '$helpfulness',
              { $divide: [{ $subtract: [ new Date(), '$date' ] }, K] }
            ]
          },
          review_id: { $toString: '$_id' }
        }
      },
      { $sort: { relevance: -1 } },
      { $skip: (page - 1) * count },
      { $limit: count },
      { 
        $unset: [
          'product_id', '__v', '_id', 'reported', 
          'reviewer_email', 'characteristics', 'relevance',
        ] 
      }
    ]); 
  } else {
    // When sort is by helpful or newest
    const sortBy = sort === 'helpful' ? 'helpfulness' : 'date';
    results = await reviewModel.aggregate([
      { $match: { product_id, reported: false } },
      { $sort: { [sortBy]: -1 } },
      { $set: { review_id: { $toString: '$_id' } } },
      { $skip: (page - 1) * count },
      { $limit: count },
      { 
        $unset: [
          'product_id', '__v', '_id', 'reported', 
          'reviwer_email', 'characteristics'
        ] 
      } 
    ]);
  }
  
  // Return in the API format
  return { product: product_id, page, count, results };
} 

// Get review meta information of a product_id
async function getReviewsMetaById(product_id) {
  // Get the raw review meta document
  const result = await reviewMetaModel.aggregate([
    { $match: { _id: product_id } },
    { $set: { product_id: '$_id' } },
    { $project: { _id: 0, __v: 0 } }
  ]);
  
  // Take document and review counts
  const document = result[0];
  const count = document.reviewCount;
 
  // For product with no reviews, just return
  if (!count) {
    delete document.reviewCount;
    return document; 
  }

  // Calculate the average for characterisitcs, to fixed 2 decimal point
  for (let char in document.characteristics) {
    const val = document.characteristics[char];
    document.characteristics[char] = (val / count).toFixed(2);
  }

  delete document.reviewCount;
  return document;
}

// This version is not ACID, no use of transaction
// later on we might come back and change this, when we set up replica sets
async function createReview(data) {
  await reviewModel.create(data);

  const charsInc = Object.entries(data.chars).reduce((obj, [key, value]) => {
    return { ...obj, [`characteristics.${key}`]: value };
  }, {});
  const ratingsInc = { [`ratings.${data.rating}`]: 1 };
  const recommendInc = { [`recommend.${data.recommend ? 'true' : 'false'}`]: 1 };

  await reviewMetaModel.findOneAndUpdate(
    { _id: data.product_id },
    { $inc: { reviewCount: 1, ...charsInc, ...ratingsInc, ...recommendInc } }
  );
}

// Creat a new review for a product
// No validation of input data needed in this layer
// Make two database requests: CREATE(reviews); UPDATE(reviewsMeta)
async function createReview_Transaction(data) {
  // Use transaction to enforce ACID
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // First, we insert into reviews
    await reviewModel.create([ data ], { session });
    
    // Prepare parameters for update
    const charsInc = Object.entries(data.chars).reduce((obj, [key, value]) => {
      return { ...obj, [`characteristics.${key}`]: value };
    }, {});
    const ratingsInc = { [`ratings.${data.rating}`]: 1 };
    const recommendInc = { [`${data.recommend ? 'true' : 'false'}`]: 1 };

    // Second, we update reviews meta
    await reviewMetaModel.FindOneAndUpdate(
      { _id: data.product_id },
      { $inc: { reviewCount: 1, ...charsInc, ...ratingsInc, ...recommendInc } },
      { session }
    );

    // If both succeed, commit the transaction
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
} 

// Mark a review as helpful
async function markHelpfulById(review_id) {
  const _id = mongoose.Types.ObjectId(review_id);
  const result = await reviewModel.updateOne({ _id }, { $inc: { helpfulness: 1 } });
  return result.acknowledged;
}

// Report a review
async function reportReviewById(review_id) {
  const _id = mongoose.Types.ObjectId(review_id);
  const result = await reviewModel.updateOne({ _id }, { reported: true });
  return result.acknowledged;
}

module.exports = {
  connect,
  disconnect,
  getReviewsById,
  getReviewsMetaById,
  createReview,
  markHelpfulById,
  reportReviewById
};
