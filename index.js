const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const bodyparser = require('body-parser');

app.use(cors())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users_data = [];

app.get('/api/test', (req, res) => {
  res.json({ msg: "test" });
})

app.post('/api/users', (req, res) => {
  const { userName } = req.body;
  const id = userName.slice(0, 5) + Math.floor(Math.random() * 9999999);
  users_data.push({ _id: id, username: userName });
  console.log(users_data);
  res.json({ msg: 'test' })
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  const newDate = date ? new Date(date) : new Date();
  const data = {
    _id,
    description,
    duration: Number(duration),
  }
  res.json({ msg: 'test01' })
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
