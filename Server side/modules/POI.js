var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var app = express();
var DButilsAzure = require('../DButils');
var Regex = require("regex");
var jwt = require('jsonwebtoken');
var  superSecret = "SUMsumOpen";
var currentUserName = 'galvai';


router.get('/getThreePopularRandomPoints',function (req,res) 
{
var threshHole = 4;
DButilsAzure.execQuery("select * from POIS where RANK >= "+threshHole+"")
.then(function(ans) {
    if (ans.length>3){
        ans = shuffle(ans);
    }
    var i=0;
    var finalAns = [];
    while (i<Math.min(3,ans.length)){
        finalAns.push(ans[i]);
        i=i+1;
    }  
    res.send(finalAns);                    
    }
)
.catch(ans=>res.send("" +ans));
});

router.get('/getTwoMostPopularPointsBasedOnUserCategories',function (req,res) {
	var sql ="select NAME,CATEGORY from POIS where Category in( select CATEGORY from FAVOURITE_CATEGORIES where USER_NAME ='"+currentUserName+"') order by RANK DESC";
	DButilsAzure.execQuery(sql)    
	.then(function(ans) {
        if (ans.length == 0 ){
            return Promise.reject('no Point of Interest from the given category');
        }
		var POI1 = ans[0].NAME;
		var category1 = ans[0].CATEGORY;		
		var POI2;
		var i = 1;
		var foundPOIfromAnotherCategory=false			
		while (i<ans.length && foundPOIfromAnotherCategory==false) {			
			if (ans[i].CATEGORY_NAME != category1){					
				POI2 = ans[i].Name;
				foundPOIfromAnotherCategory=true							
			}		
			i++;		
		}
		var query;
		if(!foundPOIfromAnotherCategory)
			 query="SELECT * FROM POIS WHERE Name in ('"+POI1+"')";
		else
			 query = "SELECT * FROM POIS WHERE Name in ('"+POI1+"','"+POI2+"')"
	
		DButilsAzure.execQuery(query)   
		.then(function(ans2) {
			res.send(ans2); 
		})
	})
	
	.catch(ans=>res.send("catch"));
	
 });


 router.get('/getTwoLastSavedPoints',function (req,res) {
    let sql ="select top 2 favouritePointID from FAVOURITE_POINTS where UserName ='"+currentUserName+"' order by FAVOURITE_POINTS.ID DESC";
    DButilsAzure.execQuery(sql)    
    .then(function(ans) {
        if (ans.length == 0)
            return Promise.reject('no saved points for this user');
        else if (ans.length == 1){  
            let POI_ID1 = ans[0].favouritePointID;
            let sql = "select * from POI where POI_Name in ('"+POI_ID1+"')";
            DButilsAzure.execQuery(sql)    
            .then(function(ans) {
                res.json({
                    poi: ans
                });	
            })
        }
        else{
            let POI_ID1 = ans[0].favouritePointID;
            let POI_ID2 = ans[1].favouritePointID;
            let sql = "select * from POIS where POI_ID in ('"+POI_ID1+"','"+POI_ID2+"')";
            DButilsAzure.execQuery(sql)    
            .then(function(ans) {
                res.json({
                    poi: ans
                });	
            })
        }
    })
    
        .catch(ans=>res.send("FALSE"));          
    });


    router.get('/getTwoLastReviewsOnPoint/:POI_ID',function (req,res) {
			var POI_ID=req.params.POI_ID;
			let sql ="UPDATE POIS SET NOV = NOV + 1 WHERE POI_ID ='"+POI_ID+"'";
            DButilsAzure.execQuery(sql);
            let sql2 ="select top 2 from REVIEWS where POI_ID ='"+POI_ID+"' order by REVIEW_ID DESC";
            DButilsAzure.execQuery(sql2)    
            .then(function(ans) {
                if (ans.length == 0)
                    return Promise.reject('no reviews for this POI');
                else{  
                    res.json({
                        poi: ans
                    });	
                }
            })
            .then(ans=> res.send("then"))
			.catch(ans=>res.send("catch"));
    });


    router.get('/GetAllPoints',function (req,res) 
    {
        let sql ="select * from POIS";
        DButilsAzure.execQuery(sql)   
        .then(function(ans) {
                res.json({
                    poi: ans
                });	
            }
       )
       
    });


    router.get('/getAllSavedPoints',function (req,res) {
		let sql ="select POI_ID, NAME, IMAGE, NOV, DESCRIPTION, RANK,"+
		 		 "CATEGORY from POIS join FAVOURITE_POINTS on  FAVOURITE_POINTS.POI_ID = POIS.POI_ID where UserName ='"+currentUserName+"'";
		DButilsAzure.execQuery(sql)   
        .then(function(ans) {
                res.json({
                    poi: ans
                });	
            }
       )
		//.then(ans=> res.send("TRUE"))
		.catch(ans=>res.send("FALSE"));
	 });


	 router.post('/saveFavoritePointsToServer',function (req,res) {
        var POIS_Array =req.body.POIS_Array;
        let sql2 = "select top 1 POSITION from FAVOURITE_POINTS UserName ='"+currentUserName+"' order by POSITION desc";
        DButilsAzure.execQuery(sql2)   
		.then(function(ans) {
            if (ans.length != 0){
                POSITION = ans[0].POSITION;
            }
        }
       )
		for(var i=0; i<POIS_Array.length; i++){
            POSITION = POSITION + 1;
			var POI_ID = POI_Array[i].POI_ID;
            let sql ="insert into FAVOURITE_POINTS (USER_NAME,POI_ID,POSITION) values('"+currentUserName+"','"+POI_ID+"','"+POSITION+"')";
			DButilsAzure.execQuery(sql) 
			.then(function(result){
				res.sendStatus(200);
			}).catch(function(err){
				res.send(err);
			})
		}   
	
	 });

	 
	 router.post('/saveFavoritePoint', function (req, res) {
        var POI_ID = req.body.POI_ID;
        var POSITION = 0;
        let sql2 = "select top 1 POSITION from FAVOURITE_POINTS UserName ='"+currentUserName+"' order by POSITION desc";
        DButilsAzure.execQuery(sql2)   
		.then(function(ans) {
            if (ans.length != 0){
                POSITION = ans[0].POSITION + 1;
            }
        }
	   )
	   .catch(ans=>res.send("FALSE"));
		let sql ="insert into FAVOURITE_POINTS (USER_NAME,POI_ID,POSITION) values('"+currentUserName+"','"+POI_ID+"','"+POSITION+"')";
		DButilsAzure.execQuery(sql)   
		.then(function(ans) {
			console.log(ans)}
	   )
	   .then(ans=> res.send("TRUE"))
	   .catch(ans=>res.send("FALSE"));
	});


	router.post('/reviewPoint',function (req,res) {
		var POI_ID =req.body.POI_ID;
		var Review =req.body.Review;
		var rank = req.body.rank;
		let sql ="UPDATE POIS SET NOR = NOR + 1 WHERE POI_ID ='"+POI_ID+"'";
		DButilsAzure.execQuery(sql);
		let sql4 ="UPDATE POIS SET RANK = (RANK * (NOR-1) + '"+rank+"')/NOR  WHERE POI_ID ='"+POI_ID+"'";
		DButilsAzure.execQuery(sql4);
		//let sql2="select count * as numberOfReviews FROM REVIEWS"; 
		//DButilsAzure.execQuery(sql2)    
		//.then(function(ans) {
			let sql3 ="insert into REVIEWS (POI_ID,REVIEW,) values('"+POI_ID+"','"+Review+"',GETDATE())";
			DButilsAzure.execQuery(sql3)    
			.then(function(ans) {
				console.log(ans)
			}).then(ans=> res.send("TRUE"))
			.catch(ans=>res.send("FALSE"));
		//})
		//.then(ans=> res.send("TRUE"))
		//.catch(ans=>res.send("FALSE"));
	 });


	 router.delete('/removeFavoritePoint', function (req, res, next) {
		var POI_ID=req.body.POI_ID;
        var sql ="DELETE FROM  FAVOURITE_POINTS WHERE POI_ID='"+POI_ID+"' AND UserName = '"+currentUserName+"'";  
        DButilsAzure.execQuery(sql)
        .then( res.send("TRUE"))
        .catch(ans=>res.send("FALSE"));
	});









 function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// router.use('/', function (req, res, next) {
//         // check header or url parameters or post parameters for token
//         var token = req.body.token || req.query.token || req.headers['token'];  
//         // decode token
//         if (token) {
//             jwt.verify(token, 'superSecret', function (err, decoded) {
//                 if (err) {
//                     return res.json({ success: false, message: 'Failed to authenticate token.' });
//                 } else {
//                     // if everything is good, save to request for use in other routes
//                     // get the decoded payload and header
//                     var decoded = jwt.decode(token, {complete: true});
//                     req.decoded= decoded;
// 					currentUserName=decoded.payload.userName;					
//                     next();
//                 }
//             });
    
//         } 
// 	else {
    
//             // if there is no token
//             // return an error
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.'
//             });
//         }
    
//     })

 
 	router.get('/Category/:Category',function (req,res) {
		var Category = req.params.Category;
		let sql ="select * from POIS where Category ='"+Category+"'";
		DButilsAzure.execQuery(sql)    
		.then(function(ans) {
			if (!(ans[0].Category === Category)) {
				return Promise.reject('Wrong Answer');}
			else{  
				res.json({
					poi: ans
				});	
			}
		})
	   .catch(ans=>res.send("catch"));
	 });

 router.post('/setNewOrderForSavedPoints',function (req,res) {
    var POI_Array =req.body.POI_Array;
    var i=0;
    for(var i=0; i < POI_Array.length; i++){
        var POI_ID = POI_Array[i].POI_ID;
        var POSITION = POI_Array[i].POSITION;
        var sql = "UPDATE FAVOURITE_POINTS set POSITION = "+POSITION+" where USER_NAME = '"+currentUserName+"' AND POI_ID = '"+POI_ID+"' "
        DButilsAzure.execQuery(sql) 
        .then(function(result){
            res.sendStatus(200);
        }).catch(function(err){
            res.send(err);
        })
    }   
 });


module.exports = router;


