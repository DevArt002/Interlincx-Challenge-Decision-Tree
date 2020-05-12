const express = require("express");
const bodyParser = require("body-parser");

const routes = require('./routes/routes');
const app = express();
const port = 3000;

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect routes
app.use('/', routes);

const server = app.listen(port);

module.exports = server;