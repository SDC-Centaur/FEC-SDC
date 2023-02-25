const mysql = require('mysql2');
const Promise = require('bluebird');
// const fs = require('fs')
// const path = require('../csv_data/questions.csv')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'SDC',
  multipleStatements: true,
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

module.exports = db;