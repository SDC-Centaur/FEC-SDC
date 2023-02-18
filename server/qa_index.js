const qa_queries = require("./qa_queries.js")
const express = require('express');
const path = require('path');

const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


app.get('/questions', (req, res) => {
  const id = req.query.product_id
  qa_queries.questionById(id);
});

app.post('/questions', (req, res) => {
  const {product_id, body, name, email} = req.body;
  qa_queries.postQuestion({product_id, body, name, email});
});

app.get('/answers', (req, res) => {
  const q_id = req.query.question_id
  //const p_id = req.query.answers
  qa_queries.answerById(q_id)
  //qa_queries.photosById(i)
});

app.post('/answers', (req, res) => {
  const {question_id, body, name, email} = req.body;
  qa_queries.postAnswer({question_id, body, name, email, photo})
  // qa_queries.postPhotos({})

  // console.log(req.body);
  // axios({
  //   method: 'post',
  //   url: `https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/questions/${req.body.question_id}/answers`,
  //   headers: { Authorization: process.env.AUTH_SECRET },
  //   data: {
  //     body: req.body.body,
  //     name: req.body.name,
  //     email: req.body.email,
  //     photo: req.body.photo,
  //   },
  // })
  //   .then(() => {
  //     res.sendStatus(201);
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

app.post('/helpful', (req, res) => {
  // axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/${req.query.type}/${req.query.id}/helpful`, null, {
  //   headers: {
  //     Authorization: process.env.AUTH_SECRET,
  //   },
  // })
  //   .then(() => {
  //     console.log('done');
  //     res.status(200);
  //   })
  //   .catch(() => res.send('Error occurred when updating helpfulness'));
});

app.post('/report', (req, res) => {
  // console.log(req.body);
  // axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-rfe/qa/answers/${req.body.answerId}/report`, null, {
  //   headers: {
  //     Authorization: process.env.AUTH_SECRET,
  //   },
  // })
  //   .then(() => {
  //     console.log('REPORTED');
  //     res.status(204);
  //   })
  //   .catch(() => res.send('Error occurred when reporting'));
});

app.listen(3000);
console.log('Listening at http://localhost:3000');
