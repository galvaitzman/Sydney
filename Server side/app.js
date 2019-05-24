const express = require("express");
const app = express();
var DButilsAzure = require("./DButils");

var jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var port = 3000;


var Users = require('./modules/USERS'); 
app.use('/USERS', Users);

var POI = require('./modules/POI'); 
app.use('/POI', POI);


app.listen(port, function() {
  console.log("Example app listening on port " + port);
});


