// Import required pacakages
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const { reviews, photos, chars, charReviews, loadData } = require('./SQL_scripts.js');

// Read private inforamation into environment variables
const dotenvPath = path.join(__dirname, '../../.env');
require('dotenv').config({ path: dotenvPath });

const tableNames = ['reviews', 'reviews_photos', 'characteristics', 'characteristic_reviews'];

// Use LOAD DATA INFILE for best time efficiency
async function ESL() {
  // Connect to MySQL server
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: process.env.MySQL_USER || 'root',
    password: process.env.MySQL_PASSWORD || '',
    database: process.env.MySQL_DATABASE || 'SDC',
    multipleStatements: true
  });

  const startTime = new Date();

  // Create four tables
  await connection.query(reviews + photos + chars + charReviews);

  // Turn on LOCAL INFILE
  await connection.query('SET GLOBAL local_infile=1');

  // Load all CSV into SQL tables
  await Promise.all(tableNames.map(tableName => {
    const tablePath = path.join(__dirname, '../../csv_data', tableName + '.csv');
    return connection.query({
      sql: loadData,
      values: [tablePath, tableName],
      infileStreamFactory: () => fs.createReadStream(tablePath)
    });
  }));

  // Turn off LOCAL INFILE
  await connection.query('SET GLOBAL local_infile=0');

  // Close MySQL connection
  await connection.end();

  // Calculate time used in seconds
  return Math.floor((new Date() - startTime) / 1000);
}

ESL()
  .then(timeUsed => console.log(`Finished all, time used: ${timeUsed} seconds...`))
  .catch(err => console.log(err));


