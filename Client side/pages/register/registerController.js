
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



        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
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


    //TODO : multiple selection categories

    // TODO: register function
    self.Register = function () {

        var quesAns1 =
            {

                QUESTION_ID: self.ques1 ,
                ANSWER : self.ans1
            };

        var quesAns2 =
            {

                QUESTION_ID: self.ques2 ,
                ANSWER : self.ans2
            };


        var userToPass =
            {   USER_NAME: self.USER_NAME ,
                FirstName: self.FirstName,
                LastName: self.LastName,
                City: self.City,
                Country: self.Country,
                Email:self.Email,
                PASSWORD: self.PASSWORD,
                QuestionsAnswers: [quesAns1,quesAns2],
                //TODO: change favoriteCategories to value from multiple selections
                favoriteCategories: ["Beaches","Food & Drinks"]
            };



        console.log(userToPass.toString());

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
});



//var myApp = angular.module("myApp", ['ngAnimate', 'md.chips.select' /*, "material.components.icon", "ngMaterial",'material.core', 'material.components.autocomplete'*/ ])
/*
myApp.controller('mainCtrl', ["$scope", function($scope) {
    console.log("Controller initializing...");
}]);

myApp.controller('chipsCtrl', ["$scope", function($scope) {
    $scope.fruitNames = ["Apple"];
}]);
myApp.controller('chipsSelectCtrl', ["$scope", function($scope) {

    $scope.sItems = [{
        name: "Mini Cooper",
        id: 0
    }, {
        name: "Lexus IS250",
        id: 1
    }, {
        name: "Ford F150",
        id: 2
    }, {
        name: "Toyota Prius",
        id: 3
    }, {
        name: "Porsche 911",
        id: 4
    }, {
        name: "Ferreri 488",
        id: 5
    }];

    $scope.myItems = [$scope.sItems[4], $scope.sItems[5]];
}]);

myApp.controller('cChipsSelectCtrl', ["$scope", "$timeout", function($scope, $timeout) {

    $scope.selectedCoutries = [];
    $scope.countiesList = [{
        country: "Taiwan",
        id: 0
    }, {
        country: "United States",
        id: 1
    }, {
        country: "United Kingdom",
        id: 2
    }, {
        country: "Hong Kong",
        id: 3
    }];

    $timeout(function() {
        console.log("Set focus");
        angular.element(".chips-input")[0].focus();
    }, 500);
}]);
*/