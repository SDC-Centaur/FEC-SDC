const db = require("../db/question_answers.js")

exports.questionById = (id) => {
  return db.queryAsync(`SELECT * FROM Questions WHERE product_id = ${id}`)
    .then(questions => questions)
    .catch(err => console.log(err)
  )
};

exports.postQuestion = ({product_id, body, name, email}) => {
  return db.queryAsync(`INSERT INTO Questions (product_id, body, asker_name, asker_email) VALUES ("${product_id}", "${body}", "${name}", "${email}")`
    .then(newQuestion => newQuestion)
    .catch(err => console.log(err))
  )
};

exports.answerById = (id) => {
  return db.queryAsync(`SELCET * FROM Answers WHERE question_id = ${id}`)
  `SELECT Answers.*, Photos.url FROM Answers INNER JOIN Photos ON Anwers.id = Photos.answer_id`
    .then(answers => answers)
    .catch(err => console.log(err))
}

exports.postAnswer = ({question_id, body, name, email}) => {
  return dc.queryAsync(`INSERT INTO Answers (question_id, body, answerer_name, answerer_email) VALUES ("${question_id}", "${body}", "${name}", "${email}")`)
    .then(newAnswer => newAnswer)
    .catch(err => console.log(err))
}

// postPhotos = () => {
//   return db.queryAsync(`INSERT INTO Photos (answer_id, url)`)
//     .then(newPhoto => newPhoto)
//     .catch(err => console.log(err))
// }