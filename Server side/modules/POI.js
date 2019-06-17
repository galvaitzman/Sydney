var express = require('express');
var router = express.Router();
var app = express();
var DButilsAzure = require('../DButils');
var jwt = require('jsonwebtoken');
var currentUserName = 'galvai';
var POSITION = 0;

router.get('/getAllPoints',function (req,res) 
    {
        let sql ="select * from POIS order by RANK desc";
        DButilsAzure.execQuery(sql)   
        .then(function(ans) {
                res.json({
                    poi: ans
                });	
            }
       )
       
});

router.get('/getAllCategories',function (req,res)
{
    let sql ="select * from CATEGORIES";
    DButilsAzure.execQuery(sql)
        .then(function(ans) {
                res.json({
                    poi: ans
                });
            }
        )

});


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


router.get('/getTwoLastReviewsOnPoint',function (req,res) {
    if (!req.query.POI_ID){
        res.send("no such attribute POI_ID in the given query");
    }
    var POI_ID=req.query.POI_ID;
    let sql ="UPDATE POIS SET NOV = NOV + 1 WHERE POI_ID ="+POI_ID;
    DButilsAzure.execQuery(sql)
    .then(function(ans) {
        var x=1;
    })
    .catch(ans=>res.send("illegal update"));
    let sql2 ="select top 2 * from REVIEWS where POI_ID ='"+POI_ID+"' order by REVIEW_ID DESC";
    DButilsAzure.execQuery(sql2)    
    .then(function(ans2) {
        if (ans2.length == 0)
            res.send('no reviews for this POI');
        else{  
            res.send(ans2);
        }
    })
    .catch(ans=>res.send("error"));
});


router.post('/reviewPoint',function (req,res) {
    if (!req.body.POI_ID || !req.body.REVIEW || !req.body.rank){
        res.send('one of the requierd attribute was not provided');
    }
    var POI_ID =req.body.POI_ID;
    var Review =req.body.REVIEW;
    var rank = req.body.rank;
    let sql ="UPDATE POIS SET NOR = NOR + 1 WHERE POI_ID ='"+POI_ID+"'";
    DButilsAzure.execQuery(sql);
    let sql4 ="UPDATE POIS SET RANK = (RANK * (NOR-1) + '"+rank+"')/NOR  WHERE POI_ID ='"+POI_ID+"'";
    DButilsAzure.execQuery(sql4);
    //let sql2="select count * as numberOfReviews FROM REVIEWS"; 
    //DButilsAzure.execQuery(sql2)    
    //.then(function(ans) {
        let sql3 ="insert into REVIEWS (POI_ID,REVIEW,DATE) values('"+POI_ID+"','"+Review+"',GETDATE())";
        DButilsAzure.execQuery(sql3)    
        .then(function(ans) {
            console.log(ans)
        }).then(ans=> res.send("TRUE"))
        .catch(function(err){
            res.send(err);
        })
    //})
    //.then(ans=> res.send("TRUE"))
    //.catch(ans=>res.send("FALSE"));
});


router.get('/Category',function (req,res) {
    if (!req.query.CATEGORY){
        res.send('no CATEGORY attribute');
        return;
    }
    var Category = req.query.CATEGORY;
    let sql ="select * from POIS where CATEGORY ='"+Category+"'"+" ORDER BY RANK DESC";
    DButilsAzure.execQuery(sql)    
    .then(function(ans) {
        if (ans.length ==0){
            res.send(ans);
            return;
        }
        else if (!(ans[0].CATEGORY=== Category)) {
            res.send(Category);
            return;}
        else{  
            res.send(ans);
            return;
        }
    })
   .catch(ans=>res.send("catch"));
});

router.use('/', (req, res, next) => {
    var token = req.body.token || req.query.token || req.header('token');  
    // no token
    if (!token) res.status(401).send("Access denied. No token provided.");
    // verify token
    try {
        const decoded = jwt.verify(token, 'superSecret');
        req.decoded = decoded;
        currentUserName = decoded.USER_NAME;

        next(); //move on to the actual function
    } 
    catch (exception) {
        res.status(400).send("Invalid token.");
    }
});


router.get('/getTwoMostPopularPoints',function (req,res) {
	var sql ="select NAME,CATEGORY from POIS where Category in( select CATEGORY from FAVOURITE_CATEGORIES where USER_NAME ='"+currentUserName+"') order by RANK DESC";
	DButilsAzure.execQuery(sql)    
	.then(function(ans) {
        if (ans.length == 0 ){
            res.send('no Point of Interest from the given category');
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
    let sql ="select top 2 POI_ID from FAVOURITE_POINTS where USER_NAME ='"+currentUserName+"' order by ID DESC";
    DButilsAzure.execQuery(sql)    
    .then(function(ans) {
        if (ans.length == 0)
            res.send('no saved points for this user');
        else if (ans.length == 1){  
            let POI_ID1 = ans[0].POI_ID;
            let sql = "select * from POIS where POI_ID in ('"+POI_ID1+"')";
            DButilsAzure.execQuery(sql)    
            .then(function(ans2) {
                res.send(ans2); 
            })
        }
        else{
            let POI_ID1 = ans[0].POI_ID;
            let POI_ID2 = ans[1].POI_ID;
            let sql = "select * from POIS where POI_ID in ('"+POI_ID1+"','"+POI_ID2+"')";
            DButilsAzure.execQuery(sql)    
            .then(function(ans3) {
                res.send(ans3); 
            })
        }
    })
    
        .catch(ans=>res.send("," + ans.length + ","));          
    });


router.get('/getAllSavedPoints',function (req,res) {
		let sql ="select POIS.POI_ID, NAME, IMAGE, NOV, DESCREPTION, RANK,"+
		 		 "CATEGORY from POIS join FAVOURITE_POINTS on FAVOURITE_POINTS.POI_ID = POIS.POI_ID where FAVOURITE_POINTS.USER_NAME ='"+currentUserName+"'";
		DButilsAzure.execQuery(sql)   
        .then(function(ans) {
                res.send(ans);
            }
       )
		.catch(ans=>res.send(""+ans));
});


router.post('/saveFavoritePointsToServer',function (req,res) { //position is +1 even when illegal record is inserted
        if (!req.body.POIS_Array || !req.body){
            res.send("no POIS_Array attribute");
        }
        var POIS_Array =req.body.POIS_Array;
        var POI_ID = 0;
        var sql2 = "select top 1 POSITION from FAVOURITE_POINTS where USER_NAME = '"+currentUserName+"' order by POSITION desc";
        DButilsAzure.execQuery(sql2)   
		.then(function(ans) {
            if (ans.length != 0){
                POSITION = ans[0].POSITION;
            }
            for(var i=0; i<POIS_Array.length; i=i+1){
                POSITION = POSITION + 1;
                if (!req.body.POIS_Array[i].POI_ID){
                    res.send("no POI_ID attribute in the " + i + " index");
                    return;
                }
                POI_ID = POIS_Array[i].POI_ID;
                var sql ="insert into FAVOURITE_POINTS (USER_NAME,POI_ID,POSITION) values('"+currentUserName+"','"+POI_ID+"',"+POSITION+")";
                DButilsAzure.execQuery(sql) 
                .then(function(result){

                }).catch(function(err){
                    res.send(err);
                    return;
                })
            }   
        }
       ).then(ans=> res.send("TRUE")).catch(function(err){
        res.send("," + POI_ID + ",");
    })
	
	
});
     
     
router.post('/saveFavoritePoint', function (req, res) {
        if (!req.body.POI_ID){
            res.send('no POI_ID attribute');
        }
        var POI_ID = req.body.POI_ID;
        var POSITION=0;
        
        var sql2 = "select top 1 POSITION from FAVOURITE_POINTS where User_Name ='"+currentUserName+"' order by POSITION desc";
        DButilsAzure.execQuery(sql2)   
		.then(function(ans) {
            ans3 = ans;
            if (ans.length > 0){
                
                POSITION = ans[0].POSITION + 1;
            }
            var sql ="insert into FAVOURITE_POINTS (USER_NAME,POI_ID,POSITION) values ('"+currentUserName+"','"+POI_ID+"',"+POSITION+")";
		    DButilsAzure.execQuery(sql)   
		    .then(function(ans) {
			    console.log(ans)}
	        )
	        .then(ans=> res.send("TRUE"))
	        .catch(ans=>res.send("," +POSITION+ ","));
        }
       )
       .catch(ans=>res.send(ans));
		
});





router.delete('/removeFavoritePoint', function (req, res) {
        if (!req.body.POI_ID){
            res.send("no POI_ID attribute");
            return;
        }
		var POI_ID=req.body.POI_ID;
        var sql ="DELETE FROM  FAVOURITE_POINTS WHERE POI_ID='"+POI_ID+"' AND USER_NAME = '"+currentUserName+"'";  
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


router.post('/setNewOrderForSavedPoints',function (req,res) {
    if (!req.body.POI_Array){
        res.send('no POI_Array attribute');
    }
    var POI_Array =req.body.POI_Array;
    var i=0;
    for(var i=0; i < POI_Array.length; i++){
        if (!POI_Array[i].POI_ID || POI_Array[i].POSITION){

        }
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


