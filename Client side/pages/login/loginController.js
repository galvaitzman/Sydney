
angular.module("myApp").service('LoginServices',[ '$http', function ($http) {

    this.Login = function (userToPass) {
        debugger;
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
/*
        $http(req)
            .then(
                function(response){
                    debugger;
                    // success callback
                }, function(response){
                    debugger;
                    // failure callback
                }
            );
*/
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
    self.Login = function () {
        var userToPass = {USER_NAME: self.USER_NAME , PASSWORD:self.PASSWORD};
        LoginServices.Login(userToPass).then(function (response){
            if(response.data.success){
                alert("sucess");
            } else{
                alert("pass or user name incorrect , maybe to print the message from the response");
                $scope.massage = "pass or user name incorrect , maybe to print the message from the response"
            }
        }, function (response) {
            self.Login.content = "Login failed";
        });
    };
});
