const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config();
const bodyparser = require('body-parser');
const { use } = require('express/lib/application');
const { flatten } = require('express/lib/utils');

app.use(cors())
app.use(express.static('public'))
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users_data = [];
const user_logs = [];

app.get('/api/test', (req, res) => {
  res.json({ msg: "test" });
})

app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const length = username.length;
  const id = username.slice(0, length/2) + Math.floor(Math.random() * 9999999);
  users_data.push({ _id: id, username: username });
  res.json({ _id: id, username: username})
})

app.post('/api/users/:_id/exercises', (req, res) => {
  const { description, duration, date } = req.body;
  const { _id } = req.params;
  const indexOfData = users_data.findIndex(user => user?._id === _id);
  const userData = users_data[indexOfData];
  const newDate = date ? new Date(date) : new Date();
  const data = {
    description: String(description),
    duration: Number(duration),
    date: newDate.toDateString(),
  }
  const userLogIndex = user_logs.findIndex(user => user?._id === _id);
  // const usersLogs = user_logs[findIndexofLogs];
  if(userLogIndex !== -1){
    user_logs[userLogIndex].log.push(data);
    user_logs[userLogIndex].count += 1;
  }else{
    user_logs.push({_id: _id, username: userData?.username, count: 1, log: [data] })
  }
  res.json({username: userData?.username, ...data, _id: _id})
});

app.get('/api/users', (req, res)=> {
  res.json(users_data)
});

app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const {from, to , limit} = req.query;
  console.log(from , to , limit);
  // const date = user_logs[0].log[0].date.toDate
  const date =(date)=> {
    return new Date(date);
  }

  const indexOfData = user_logs.findIndex(user => user?._id === _id);
  const userData = user_logs[indexOfData];
  let logs = userData?.log;

 if(from){
  const formDate = new Date(from);
  console.log(new Date(logs[0].date), formDate)
  logs = logs.filter(item=> new Date(item?.date) >= formDate );
 }

 if(to){
  const toDate = new Date(to);
  logs = logs.filter(item=> new Date(item?.date) <= toDate );
 }
  
 if(limit ){
      logs = logs.slice(0, Number(limit));
    }

  if(from || to || limit){
    console.log(logs)
    res.json({
      _id: userData?._id,
      username: userData?.username,
      count: logs.length,
      log: logs,
    });

  }else{
    res.json(userData);
  }
  
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
