
angular.module("myApp").service('LoginServices',[ '$http', function ($http) {

    this.Login = function (userToPass) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/USERS/Login',
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
        // return  $http.post("http://localhost:3000/USERS/Login", userToPass);
    }

    this.random3POI = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getThreePopularRandomPoints',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            }
        };
        return $http(req);


        // return  $http.post("http://localhost:3000/USERS/Login", userToPass);
    }


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

.controller('loginController', function ($scope,$http,LoginServices){
    var self = this;
    var current_user="";
    var current_token="";

    LoginServices.random3POI().then(function (response) {
        $scope.random3POIlist = response.data;
    }, function (response) {
        self.Login.content = "Get 3 random POI failed";
    });

    self.Login = function () {
        var userToPass = {USER_NAME: self.USER_NAME , PASSWORD:self.PASSWORD};
        LoginServices.Login(userToPass).then(function (response){
            if(response.data == "Wrong Username" || response.data == "Wrong Password") {
                //TODO: add message filed with binding
                //$scope.massage=response.data;
                alert(response.data);
                // TODO after the authentication succeeded - move to the next page
                // TODO forgot my password
            } else{
                //TODO:REMOVE after moving to the new page
                alert("success");
                current_user=userToPass.USER_NAME;
                current_token=response.data;
            }
        }, function (response) {

            self.Login.content = "Login failed";

        });
    };
});
