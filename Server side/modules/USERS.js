var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
var DButilsAzure = require('../DButils');
//var Regex = require("regex");
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var  superSecret = "SUMsumOpen";

router.post("/Login", function(req, res) {
    var userPass = req.body;
    var name = userPass.USER_NAME;
    var pass = userPass.PASSWORD;
    DButilsAzure.execQuery("SELECT PASSWORD FROM USERS WHERE USER_NAME= '"+name+"'")
      .then(function(result) {
        if(result.length == 0)
            return Promise.reject('Wrong Username');
        else if (!(result[0].PASSWORD === userPass.PASSWORD)) {
            return Promise.reject('Wrong Password');}      
            /*
            NEED TO ADD CODE TO SEND TOKEN
            */
            //sendToken(userName,password,res)	
        else return Promise.resolve("log in succesfully");	
      })
      .then(function(result){
        console.log(result);
        res.status(200).send(result);
      })
      .catch(function(err) {
        console.log(err);
        res.status(400).send(err);
      });
  });





  module.exports = router;