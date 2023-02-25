const db = require("../db/qa_db-connection.js")

exports.questionById = (id) => {
  return db.queryAsync(`SELECT * FROM Questions WHERE product_id = ${id}`)
    .then(questions => questions)
    .catch(err => console.log(err)
  )
};

exports.postQuestion = ({product_id, body, name, email}) => {
  return db.queryAsync(`INSERT INTO Questions (product_id, body, asker_name, asker_email) VALUES ("${product_id}", "${body}", "${name}", "${email}")`)
    .then(newQuestion => newQuestion)
    .catch(err => console.log(err))
};

exports.answerById = (id) => {
  return db.queryAsync( `SELECT * FROM Answers WHERE question_id = ${id}`
  )
 // `SELCET * FROM Answers WHERE question_id = ${id},
 // SELECT Answers.*, Photos.url FROM Answers INNER JOIN Photos ON Anwers.id = Photos.answer_id`
    .then(answers => answers)
    .catch(err => console.log(err))
}

exports.photosById = (id) => {
  return db.queryAsync( `SELECT id, url FROM Photos WHERE answer_id = ${id}`
  )
    .then(photos => photos)
    .catch(err => console.log(err))
}

exports.postAnswer = ({question_id, body, name, email}) => {
  return db.queryAsync(`INSERT INTO Answers (question_id, body, answerer_name, answerer_email) VALUES ("${question_id}", "${body}", "${name}", "${email}")`)
    .then(newAnswer => newAnswer)
    .catch(err => console.log(err))
}

exports.postPhotos = ({answer_id, url}) => {
  return db.queryAsync(`INSERT INTO Photos (answer_id, url) VALUES ("${answer_id}", "${url})`)
    .then(newPhoto => newPhoto)
    .catch(err => console.log(err))
}

exports.updateHelp = (id) => {
  return db.queryAsync(`UPDATE Questions SET helpful = helpful + 1 WHERE id = ${Number(id)}`)
    .then(helpNum => helpNum)
    .catch(err => console.log(err))
}

exports.updateReport = (id) => {
  return db.queryAsync(`UPDATE Questions SET reported = 1 WHERE id = ${Number(id)}`)
    .then(reported => reported)
    .catch(err => console.log(err))
}

exports.updateHelpAns = (id) => {
  return db.queryAsync(`UPDATE Answers SET helpful = helpful + 1 WHERE id = ${Number(id)}`)
    .then(helpNum => helpNum)
    .catch(err => console.log(err))
}

exports.updateReportAns = (id) => {
  return db.queryAsync(`UPDATE Answers SET reported = 1 WHERE id = ${Number(id)}`)
    .then(reported => reported)
    .catch(err => console.log(err))
}