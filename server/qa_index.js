const qa_queries = require("./qa_queries.js")
const express = require('express');
const path = require('path');

const app = express();
const cors = require('cors');


app.use(express.json());

// app.get('/questions', (req, res) => {
//   let start = Date.now();
//   const id = req.query.product_id
//   let questions = qa_queries.questionById(id);
//   questions.then((question) => {
//     res.send(question[0])
//     console.log((Date.now() - start) / 1000, 'sec')
//   })
// });
app.get('/questions', async (req, res) => {
  try {
    let start = Date.now();
    const id = req.query.product_id

    const [questions] = await qa_queries.questionById(id);
    const resultQuest = [];

    for (const questionsArr of questions) {
      const [answersArray] = await qa_queries.answerById(questionsArr.id);
      questionsArr.answers = answersArray;
      for (const answerObj of answersArray) {
        const [photosArr] = await qa_queries.photosById(answerObj.id);
        answerObj.photos = photosArr;
        console.log(answerObj)
      }
      resultQuest.push(questionsArr);
    }
    console.log((Date.now() - start) / 1000, 'sec')
    res.status(200).json(resultQuest);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

app.post('/questions', (req, res) => {
  let start = Date.now();
  const {product_id, body, name, email} = req.body;
  console.log({product_id})
  qa_queries.postQuestion({product_id, body, name, email});
  res.send('received')
  console.log((Date.now() - start) / 1000, 'sec')
});

app.get('/answers', async (req, res) => {
  try {
    let start = Date.now();
    const q_id = req.query.question_id;

    const [answers] = await qa_queries.answerById(q_id);
    const resultArr = [];

    for (const answerObj of answers) {
      const [photosArr] = await qa_queries.photosById(answerObj.id);

      answerObj.photos = photosArr;
      resultArr.push(answerObj);
      console.log('result: ', resultArr)
    }
    console.log((Date.now() - start) / 1000, 'sec')
    res.status(200).json(resultArr);
  } catch (error) {
    console.log(error);
    res.sendStatus(401);
  }
});

app.post('/answers', (req, res) => {
  let start = Date.now();
  const {question_id, body, name, email} = req.body;
  qa_queries.postAnswer({question_id, body, name, email})
  res.send('received')
  console.log((Date.now() - start) / 1000, 'sec')
});

app.put('/helpful', (req, res) => {
  let id;
  if (req.query.question_id !== undefined) {
    id = req.query.question_id
    qa_queries.updateHelp(id)
  } else {
    id = req.query.answer_id
    qa_queries.updateHelpAns(id)
  }
  res.send('updated')
});

app.put('/report', (req, res) => {
  let id;
  if (req.query.question_id !== undefined) {
    id = req.query.question_id
    qa_queries.updateReport(id)
  } else {
    id = req.query.answer_id
    qa_queries.updateReportAns(id)
  }
  res.send('reported')
});


app.listen(3000, () => {console.log('Listening at http://localhost:3000');});


// GET answers old version
  // let start = Date.now();
  // const q_id = req.query.question_id
  // let answers = qa_queries.answerById(q_id);
  // answers.then((answer) => {
  //   let answersArray = answer[0];
  //   answersArray.map((answerObj) => {
  //     answerObj.photos = [];
  //     let photosArr = qa_queries.photosById(answerObj.id)
  //      photosArr.then((photo) => {
  //       if (photo[0].length > 0) {
  //         answerObj.photos = photo[0];
  //         //res.send(answerObj)
  //       }
  //     })
  //   })
  //   res.send(answer[0])
  //   console.log((Date.now() - start) / 1000, 'sec')
  // })

  // app.get('/answers', (req, res) => {
//   let start = Date.now();
//   const q_id = req.query.question_id
//   let answers = qa_queries.answerById(q_id);
//   answers.then((answer) => {
//     console.log(answer[0])
//     answer[0].map((answerObj) => {
//     answerObj.photos = [];
//     let photosArr = qa_queries.photosById(answerObj.id)
//     photosArr.then((photo) => {
//       if (photo[0].length > 0) {
//         answerObj.photos = photo[0];
//       }
//       res.send(answer[0])
//       console.log((Date.now() - start) / 1000, 'sec')
//     })
//     .catch(err => console.log(err))
//     })
//   })
//   .catch(err => console.log(err))
// });