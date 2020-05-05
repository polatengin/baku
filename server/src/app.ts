const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app);

server.listen(port, () => {
  return console.log(`server is listening on http://localhost:${port}`);
});
