
angular.module("myApp").service('forgotPasswordServices',[ '$http', function ($http) {

    this.RetrievePassword = function (dataToPass) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/USERS/RetrievePassword',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            data:dataToPass
        };
        return $http(req);
    }

    this.getRandomQuestion = function (userName) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/USERS/getRandomQuestion/',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {USER_NAME:userName},
        };
        return $http(req);
    }


}])

    .controller('forgotPasswordController', function ($scope,forgotPasswordServices){
        var self = this;
        self.getRandomQuestion = function () {
            forgotPasswordServices.getRandomQuestion(self.USER_NAME).then(function (response){
                $scope.ques = response.data;
            }, function (response) {
                //TODO : change the alert
                alert("Get ques failed");
            });
        };


        self.RetrievePassword = function () {
            var dataToPass = {
                USER_NAME: self.USER_NAME,
                ANSWER: self.answer,
                QUESTION: $scope.ques.QUESTION_ID
            }
            forgotPasswordServices.RetrievePassword(dataToPass).then(function (response){
                if(response.data=="wrong answer. please try again" || response.data =="error" ||response.data =="the given user did not answer the given question when registerd")
                    //TODO : change alert
                    alert(response.data);
                else $scope.password = response.data;
            }, function (response) {
                //TODO : change the alert
                alert("Get ques failed");
            });
        };
    });
