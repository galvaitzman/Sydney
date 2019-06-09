var express = require('express');
var router = express.Router();
var app = express();
var DButilsAzure = require('../DButils');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var Countries = ["Ausralia","Bolovia","China","Denemark","Israel","Latvia","Monaco","August","Norway","Panama","Switzerland","USA"];



router.post("/Login", function(req, res) {
    var userPass = req.body;
    var name = userPass.USER_NAME;
    var password = userPass.PASSWORD;

    console.log(req.body);

    DButilsAzure.execQuery("SELECT PASSWORD FROM USERS WHERE USER_NAME= '"+name+"'").then(function(result) {
        console.log(result);
        if(result.length == 0) {
            return res.send('Wrong Username');
        } else if (!(result[0].PASSWORD === userPass.PASSWORD)) {
            return res.send('Wrong Password');
        } else{
            payload = {  USER_NAME: name, admin: true };
            options = { expiresIn: "1d" };
            const token = jwt.sign(payload, 'superSecret', options);
            res.send(token);
        }   
           		        
      }
    ).catch(ans=>res.send("aviya FALSE"));
});

router.post('/Register', function (req, res) {
  
    if(!req.body){
        res.send("Register Failure");
        return; 
    }
    var userName=req.body.USER_NAME;
    if (userName.length>8 || userName.length<3 ){
        res.send("User name should contain 3 to 8 letters");
        return;
    }
    if (req.body.PASSWORD.length>10 || req.body.PASSWORD.length<5 ){
        res.send("password should contain 5 to 10 letters/digits");
        return;
    }
    if(!/^[a-zA-Z]+$/.test(userName)){
        res.send("User name should contain only letters");
        return;
    }
    var lettersNumbers  =/^[0-9a-zA-Z]+$/;
    
    if(!(lettersNumbers.test(req.body.PASSWORD))){
        res.send("password should contain only letters and numbers");
        return;
    }
    DButilsAzure.execQuery("select * from USERS where USER_NAME= '"+userName+"'")
    .then(function(ans){   
        if(ans.length != 0){ 
            res.send("Please Choose Another User Name");  
            return;    
        }    
    });

    if (!req.body.QuestionsAnswers || req.body.QuestionsAnswers.length<2){
        res.send("not enough answers provided. at least 2 answer requierd");
        return;
    }  

    if (!req.body.favoriteCategories || req.body.favoriteCategories.length<2){
        res.send("not enough categories provided. at least 2 categories requierd");
        return;
    } 
    
    if (!req.body.Country || !Countries.includes(req.body.Country)){
        res.send(req.body.Country);
        return;
    }

    var wrongCategory = 0;
    for (var i=0; i< req.body.favoriteCategories.length; i=i+1) {
        let sql3 =  "select * from CATEGORIES where CATEGORY='"+ req.body.favoriteCategories[i] + "'";
        DButilsAzure.execQuery(sql3)
        .then(function(ans){
            if (ans.length==0){
                res.send("one or more of the categories does not exist. please provide correct categories");
                res.end();
                process.exit();
                return;
            }
        });        
    }

    // if (wrongCategory > 0){
    //     res.send("one or more of the categories does not exist. please provide correct categories");
    //     return;
    // }

    
    var firstName=req.body.FirstName;
    var lastName=req.body.LastName;
    var city=req.body.City;
    var country = req.body.Country;
    var email=req.body.Email;
    var password=req.body.PASSWORD; 
    

    let sql="insert into Users values(\'"+userName + "\', \'" +password + "\', \'" + firstName +
    "\', \'" + lastName + "\',\'" + city + "\',\'" + country + "\', \'" + email + "\');";
    DButilsAzure.execQuery(sql)
    .then(function(ans){
       
        for (var i=0; i< req.body.QuestionsAnswers.length; i=i+1) {
            let sql2 =  "insert into ANSWERS_USER values('" + userName + "','" + req.body.QuestionsAnswers[i].QUESTION_ID + "','" + req.body.QuestionsAnswers[i].ANSWER + "')";
            DButilsAzure.execQuery(sql2);
        }
         
        for (var i=0; i< req.body.favoriteCategories.length; i=i+1) {
            let sql4 =  "insert into FAVOURITE_CATEGORIES values('" + userName + "','" + req.body.favoriteCategories[i] + "')";
            DButilsAzure.execQuery(sql4)
            .then(function(ans){
                res.send("registed successfuly");
            })        
            .catch(ans=>res.send("something went wrong. please try again"));
        }
        
        //sendToken(userName,password,res) ;
      
    })        
    .catch(ans=>res.send("error" +ans));
});



router.get('/getAllQuestions',function(req,res) {
    let sql = "select * from QUESTIONS";
    DButilsAzure.execQuery(sql)
    .then(function(ans){
        res.send(ans);
    })        
    .catch(ans=>res.send("error"));
});


router.get('/getRandomQuestion',function(req,res) {
    if (!req.query.USER_NAME){
        res.send("no USER_NAME attribute");
        return;
    }
    var userName = req.query.USER_NAME;
    let sql = "select QUESTION_ID from ANSWERS_USER where USER_NAME = '" + userName +"'";
    DButilsAzure.execQuery(sql)
    .then(function(ans){
        if (ans.length != 0){
            var rand = ans[Math.floor(Math.random() * ans.length)];
            res.send(rand);
        }
    })        
    .catch(ans=>res.send("error"));
});


router.post('/RetrievePassword',function (req,res) {
    var userToCheck=req.body;
    if(!userToCheck){
        res.send("Restore Password Failure");
        res.end();
        return;    
    }
    var userName=userToCheck.USER_NAME;
    var answer = userToCheck.ANSWER;
    var question = userToCheck.QUESTION;
    DButilsAzure.execQuery("select * from ANSWERS_USER where USER_NAME = '"+userName+"' and QUESTION_ID ='"+question+"'")    
        .then(function(ans) {		   
            if (ans.length == 0)
                return Promise.reject('the given user did not answer the given question when registerd');		
            else
            {
                if (ans[0].ANSWER == answer){
                    DButilsAzure.execQuery("select PASSWORD from USERS where USER_NAME = '"+userName+"'")
                    .then(function(ans2) {
                        res.send(ans2[0].PASSWORD);		   
                    })
                    .catch(ans2=>res.send("error"));
                }
                else{
                    res.send('wrong answer. please try again');
                }
            }
        })
    .catch(ans=>res.send("" +ans));
});


// router.post('/authenticate', function (req, res) {

// if (!req.body.userName || !req.body.password)
//     res.send({ message: "bad values" })

// else {

//     for (id in Users) {
//         var user = Users[id]

//         if (req.body.userName == user.userName)
//             if (req.body.password == user.password)
//                 sendToken(user, res)
//             else {
//                 res.send({ success: false, message: 'Authentication failed. Wrong Password' })
//                 return
//             }
//     }

//     res.send({ success: false, message: 'Authentication failed. No such user name' })
// }

// })





module.exports = router;