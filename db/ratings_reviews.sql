---- Run this file only onced
---- mysql -u [your-username] -p < ratings_reviews.sql in the terminal

/* We use the database named SDC */
CREATE DATABASE IF NOT EXISTS SDC;
USE SDC;

/*
 * Two Tables
 * reviews & reviews_photos
 */
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rating TINYINT NOT NULL,
  created_at DATETIME DEFAULT NOW(),
  summary VARCHAR(60) NOT NULL,
  body VARCHAR(1000) NOT NULL,
  recommend BOOLEAN DEFAULT 0,
  reported BOOLEAN DEFAULT 0,
  reviewer_name VARCHAR(60) NOT NULL,
  reviewer_email VARCHAR(60) NOT NULL,
  response VARCHAR(1000),
  helpfulness INT DEFAULT 0,
  size TINYINT,
  width TINYINT,
  comfort TINYINT,
  quality TINYINT,
  length TINYINT,
  fit TINYINT,
  product_id INT NOT NULL -- this will be a foreign key later
); -- characteristics can be refactored if these data are sparse, otherwise leave it there

DROP TABLE IF EXISTS reviews_photos;
CREATE TABLE reviews_photos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  url TEXT NOT NULL COMMENT 'use TEXT in case of super long url',
  review_id INT NOT NULL
); -- this review_id is a foreign key

/* Index Candidates
 *
 * reviews_photos.review_id
 * reviews.helpfulness
 * reviews.created_at
 * reviews.product_id
 * ......
 */