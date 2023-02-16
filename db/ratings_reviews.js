const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mysql = require('mysql2/promise');
const fs = require('fs');
const readline = require('readline');

const connectionOptions = {
  host: 'localhost',
  user: 'root',
  password: process.env.MySQL_PASSWORD,
  database: 'SDC'
};

function createReader(filePath) {
  const stream = fs.createReadStream(filePath);
  return readline.createInterface({ input: stream });
}

async function ESL_reviews_photos() {
  try {
    const filePath = path.join(__dirname, '../csv_data/characteristic_reviews.csv');
    const stream = fs.createReadStream(filePath);
    const reader = readline.createInterface({ input: stream });
    const connection = await mysql.createConnection(connectionOptions);
    const start = Date.now();
    let index = 0;
    let headers;

    //console.log('1111')

    for await (let line of reader) {
      console.log(index, headers, line)
      if (!index) {
        headers = line.split(',');
        index++;
        continue;
      }

      const rows = line.split(',');
      const queryString = `INSERT INTO reviews_photos SET ?`;
      const queryParams = headers.reduce((params, header, index) => {
        return { ...params, [header]: rows[index] };
      }, {});

      //console.log(headers, rows)
      /*
      await connection.query(queryString, queryParams);
      */
      console.log(`Line ${index++} Inserted...`)
      if (index === 10) break;
    }



    connection.end();
    return Math.floor((Date.now() - start)/1000);
  } catch (error) {
    return error;
  }
}

ESL_reviews_photos()
  .then(timeUsed => console.log(`Insertion finished, time used ${timeUsed} seconds`))
  .catch(err => console.log(err));




