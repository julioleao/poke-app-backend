const badyParser = require('body-parser');
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const server = express();

const port = 3003;

server.use(badyParser.urlencoded({ extended: true }));
server.use(badyParser.json());
server.use(cors());

server.listen(process.env.PORT || port, () => {
  console.log(`Backend is running on port ${port}.`);
});

module.exports = server;
