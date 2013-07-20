#!/usr/bin node

var express = require('express');
var fs = require('fs');
var htmlfile = 'index.html';

//var app = express.createServer(express.logger());
var app = express(express.logger());

app.get('/', function(request, response) {
  // 2013.07.17: response.send(fs.readFileSync(htmlfile,'utf8'));
  response.send(fs.readFileSync(htmlfile).toString()); // 2013.07.17
});

var port = process.env.PORT || 5080; // 2013.07.17: || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
