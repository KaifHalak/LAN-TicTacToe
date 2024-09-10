const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const cors = require("cors")
app.use(cors())

app.use(express.static("client"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

server.listen(3000, () => {
  console.log('listening on 3000');
});

module.exports = server


