const express = require('express')
const app = express()
const port = 3000
const { Database } = require('./db')
const model = require('./model')

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/object/:key', async (req, res) => {
  let time = req.query.timestamp;

  if(time) {
    if (time.length === 10) {
      time = new Date(parseFloat(req.query.timestamp + '000'))
    } else {
      time = new Date(parseFloat(req.query.timestamp))
    }
  }

  const result = await model.query(req.params.key, time)

  if (result){
    res.send(JSON.stringify({value: result.value}))
  } else {
    res.send(JSON.stringify({}))
  }
})

app.post('/object', async (req, res) => {
  const key = Object.keys(req.body)[0]

  const result = await model.insertOne(key, req.body[key]);

  if (result){
    res.send(JSON.stringify({value: result.ops[0].value}))
  } else {
    res.send(JSON.stringify({}))
  }
})

Database.connect()

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

