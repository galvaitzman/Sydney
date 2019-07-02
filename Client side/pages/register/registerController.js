


angular.module("myApp").service('registerServices',['$http', function ($http) {

    this.Register = function (userToPass) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/USERS/Register',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            data: userToPass
        };

        return $http(req);
    }

    this.getAllCategories = function () {
        var req = {
            method: 'GET',
            url: "http://localhost:3000/POI/getAllCategories",
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            }
        };
        return $http(req);
    }
   

/*
    $http.get("http://localhost:3000/USERS/getAllQuestions").then(function (data) {
        $scope.questaions = data;
    }).catch(function(Object) {
        alert(Object.data);
    });
*/

/*
    this.signUp = function (userToPass) {
            return $http.post("http://localhost:3000/USERS/Register", userToPass);
        }

        this.getAllQuestaions = function () {
            return $http.get("http://localhost:3000/USERS/getAllQuestions");
        }
*/




/*
    this.set = function (t) {
        $http.defaults.headers.common[ 'x-access-token' ] = t
    }

    this.showRandomPOI = function () {
        return $http.get("http://localhost:3000/Users/PopularPOI");
    }

    this.FavPOI = function (token) {
        return $http.get("http://localhost:3000/POI/GetUsersAllFavPOI?token="+token)  }

    this.getUserFavOrder=function(token){
        return $http.get("http://localhost:3000/POI/UserOrder?token="+token)
        }
          */
}])



.controller('registerController', function ($scope,$http,registerServices){

    var self = this;
    self.question1List = '';
    self.question2List = '';
    self.categories1List = '';
    self.categories2List = '';
    $scope.questions = [];
    $scope.categories = [];

// TODO: move http function to Service
    $http({
        method: 'GET',
        url: "http://localhost:3000/USERS/getAllQuestions",
        headers: {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
            'Access-Control-Allow-Headers' : '*',
            'Access-Control-Max-Age' : '*',
            'Content-Type': 'application/json'
        }
    }).then(function mysuccess(response) {
        $scope.questions = response.data;
    }, function nosuccess(response) {
        alert("failed" + response.data.toString());
    });


    self.getAllCategories = function () {
        registerServices.getAllCategories().then(function (response){
            $scope.categories = response.data.poi;
        }, function (response) {
            alert("Get categories failed");
        });
    };

    
    self.getAllCategories();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4) {
            self.countriesFunc(this);
        }
    };
    xhttp.open("GET", "pages/register/countries.xml", true);
    xhttp.send();

    self.countriesFunc = function (xmlInput) {
        var temp = [];
        var xmlFile = xmlInput.responseXML;
        var xmlCountries = xmlFile.getElementsByTagName("Country");
        var i;
        for (i = 0; i < xmlCountries.length; i= i+1) {
            temp.push({"Name": xmlCountries[i].getElementsByTagName("Name")[0].childNodes[0].nodeValue.toString()});
        }
        $scope.countries_list = temp;
        console.log($scope.countries_list)
    };

    /*
        $scope.$watch('selected', function(nowSelected){
            // reset to nothing, could use `splice` to preserve non-angular references
            $scope.selectedValues = [];

            if( ! nowSelected ){
                // sometimes selected is null or undefined
                return;
            }

            // here's the magic
            angular.forEach(nowSelected, function(val){
                $scope.selectedValues.push( val.id.toString() );
            });
        });
    */


    self.Register = function () {
        var quesAns1 =
            {
                QUESTION_ID: document.getElementById("ques1").options[document.getElementById("ques1").selectedIndex].text,
                ANSWER : self.ans1
            };

        var quesAns2 =
            {

                QUESTION_ID: document.getElementById("ques2").options[document.getElementById("ques2").selectedIndex].text ,
                ANSWER : self.ans2
            };
        var category1 = document.getElementById("category1").options[document.getElementById("category1").selectedIndex].text;
        var category2 = document.getElementById("category2").options[document.getElementById("category2").selectedIndex].text;
        var userToPass =
            {   USER_NAME: self.USER_NAME ,
                FirstName: self.FirstName,
                LastName: self.LastName,
                City: self.City,
                Country: self.Country,
                Email:self.Email,
                PASSWORD: self.PASSWORD,
                QuestionsAnswers: [quesAns1,quesAns2],
                favoriteCategories: [category1,category2]
            };



        console.log(userToPass.toString());
        // TODO: change the alerts to informative message on the html page
        registerServices.Register(userToPass).then(function (response){
            if(response.data == "Please Choose Another User Name") {
                //$scope.massage=response.data;
                alert(response.data);
            } else{
                alert("success");
            }
        }, function (response) {

            alert("Login failed");

        });
    };

   
})

.filter('excludeUsed', function() {
    var filter = function(items, excludeVal1, excludeVal2) {
        var checkItem = function(item) {
            return (item != excludeVal1) && (item != excludeVal2);
        };

        return items.filter(checkItem);
    };

    return filter;
});
