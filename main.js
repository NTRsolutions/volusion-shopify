// const d3 = require("d3");
// const Papa = require("papaparse");
const fs = require('fs');
var http = require('http');
const express = require('express');
const app = express();

app.use(express.static("/public"));

// var csvFile = fs.readFile('./cities');

app.get("/", function(req, res){
  res.sendFile('/index.html', {root: __dirname + '/public'});
});

app.get("/csv", function(req, res){
  res.sendFile('/cities.csv', {root: __dirname + '/public'})
})

app.listen(8080, function(){
  console.log('Example app listening on port 8080!')
})

// d3.csv('/cities.csv');

//
// Papa.parse('./cities.csv', {
//   download: true,
//   complete: function(result) {
//     console.log("Finished: ", result.data);
//   }
// });
