const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.get('/', (req, res) => {
  res.status(200).send('Baku is working 🥳');
});
const server = http.createServer(app);

server.listen(port, () => {
  return console.log(`server is listening on http://localhost:${port}`);
});
