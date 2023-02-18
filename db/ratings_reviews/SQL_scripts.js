// SQL table creation script

// ## Add indexes & foreign keys after ETL, subject to refactor
// ## summary should be VARCHAR(60), use 1000 for safe insertion
const reviews = `
  DROP TABLE IF EXISTS reviews;
  CREATE TABLE reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    rating TINYINT NOT NULL,
    date INT UNSIGNED NOT NULL,
    summary VARCHAR(1000) NOT NULL COMMENT 'should be 60, put 1000 for safe bulk insert',
    body VARCHAR(1000) NOT NULL,
    recommend BOOLEAN DEFAULT 0,
    reported BOOLEAN DEFAULT 0,
    reviewer_name VARCHAR(60) NOT NULL,
    reviewer_email VARCHAR(60) NOT NULL,
    response VARCHAR(1000),
    helpfulness INT DEFAULT 0
  );
`;

const photos = `
  DROP TABLE IF EXISTS reviews_photos;
  CREATE TABLE reviews_photos (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    review_id INT UNSIGNED NOT NULL,
    url VARCHAR(255) NOT NULL COMMENT 'disallow long data url'
  );
`;

const chars = `
  DROP TABLE IF EXISTS characteristics;
  CREATE TABLE characteristics (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    product_id INT UNSIGNED NOT NULL,
    name VARCHAR(10) NOT NULL
  );
`;

const charReviews = `
  DROP TABLE IF EXISTS characteristic_reviews;
  CREATE TABLE characteristic_reviews (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    characteristic_id INT UNSIGNED NOT NULL,
    review_id INT UNSIGNED NOT NULL,
    value TINYINT NOT NULL
  );
`;

const loadData = `
  LOAD DATA LOCAL
  INFILE ?
  INTO TABLE ??
  FIELDS TERMINATED BY ','
  LINES TERMINATED BY '\n'
  IGNORE 1 LINES;
`;

module.exports = { reviews, photos, chars, charReviews, loadData };