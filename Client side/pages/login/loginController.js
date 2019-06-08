
angular.module("myApp")
.service('LoginServices',[ '$http', function ($http) {

    this.Login = function (userToPass) {

        return  $http.post("http://localhost:3000/USERS/Login", userToPass);
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
        let userToPass = {USER_NAME: self.USER_NAME , PASSWORD:self.PASSWORD};
   LoginServices.Login(userToPass)
   .then(function (response) {
                 if(response.data.success){
                 }
              else{
                  $scope.massage = "pass or user name incorrect , maybe to print the message from the response"
              }
        }, function (response) {

            self.Login.content = "Login failed";
        });
 };
});
