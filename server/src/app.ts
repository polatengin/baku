import * as bodyParser from 'body-parser';
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({origin: 'http://localhost:5000'}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.status(200).send('Baku is working 🥳');
});
const attendees: any[] = [];
app.post('/register', (req, res) => {
  attendees.push(req.body);
  res.json(attendees);
});
app.get('/list', (req, res) => {
  res.json(attendees);
});

const server = http.createServer(app);

server.listen(port, () => {
  return console.log(`server is listening on http://localhost:${port}`);
});
