const mysql = require('mysql2');
const Promise = require('bluebird');
const fs = require('fs')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'SDC',
  multipleStatements: true,
});

const db = Promise.promisifyAll(connection, { multiArgs: true });

db.connectAsync()
  .then(() => console.log(`Connected to MySQL as id: ${db.threadId}`))
  .then(() => db.queryAsync(
    `
    CREATE TABLE IF NOT EXISTS Questions (
        id INTEGER NOT NULL AUTO_INCREMENT,
        product_id INTEGER NULL,
        body VARCHAR(1000) NULL,
        date_written BIGINT NULL,
        asker_name VARCHAR(60) NULL,
        asker_email VARCHAR(60) NULL,
        reported INTEGER NULL,
        helpful INTEGER NULL,
        PRIMARY KEY (id)
      )`
  ))
  .then(() => db.queryAsync({
    sql: `LOAD DATA LOCAL INFILE '../csv_data/questions.csv'
    INTO TABLE Questions
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    `,
    infileStreamFactory: (path) => {return fs.createReadStream(path)}
  }))
  .then(() => {
    console.log('QUESTIONS DONE!')
  })
  .then(() => db.queryAsync(`
      DROP TABLE IF EXISTS Answers;
      CREATE TABLE IF NOT EXISTS Answers (
        id INTEGER NOT NULL AUTO_INCREMENT,
        question_id INTEGER NULL,
        body VARCHAR(1000) NULL,
        date_written BIGINT NULL,
        answerer_name VARCHAR(60) NULL,
        answerer_email VARCHAR(60) NULL,
        reported INTEGER NULL,
        helpful INTEGER NULL,
        PRIMARY KEY (id)
      )`
  ))
  .then(() => db.queryAsync({
    sql: `LOAD DATA LOCAL INFILE '../csv_data/answers.csv'
    INTO TABLE Answers
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    `,
    infileStreamFactory: (path) => {return fs.createReadStream(path)}
  }))
  .then(() => {
    console.log('ANSWERS DONE!')
  })
  .then(() => db.queryAsync(`
    DROP TABLE IF EXISTS Photos;
      CREATE TABLE IF NOT EXISTS Photos (
        id INTEGER NOT NULL AUTO_INCREMENT,
        answer_id INTEGER NULL,
        url VARCHAR(1000) NULL,
        PRIMARY KEY (id)
      )`))
  .then(() => db.queryAsync({
    sql: `LOAD DATA LOCAL INFILE '../csv_data/answers_photos.csv'
    INTO TABLE Photos
    FIELDS TERMINATED BY ','
    ENCLOSED BY '"'
    LINES TERMINATED BY '\n'
    IGNORE 1 ROWS
    `,
    infileStreamFactory: (path) => {return fs.createReadStream(path)}
  }))
  .then(() => {
    connection.end();
    console.log('PHOTOS DONE!')
  })
  .catch((err) => console.log(err));


module.exports = db;

