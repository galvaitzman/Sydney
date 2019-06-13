
angular.module("myApp").service('forgotPasswordServices',[ '$http', function ($http) {

    this.getRandomQuestion = function (userToPass) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/USERS/getRandomQuestion/'+userToPass.USER_NAME,
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
        };
        return $http(req);
    }
}])

    .controller('forgotPasswordController', function ($scope,forgotPasswordServices){
        var self = this;
        var userToPass = {USER_NAME:self.USER_NAME}
        self.getRandomQuestion = function () {
            forgotPasswordServices.getRandomQuestion(userToPass).then(function (response){
                $scope.ques = response.data;
            }, function (response) {
                //TODO : change the alert
               alert("Get ques failed");
            });
        };
    });
