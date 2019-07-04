
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
        $scope.alert_user="";
        $scope.alert_answer="";
       
        var second = document.getElementById("seconddiv");
     
        second.style.display = (
            second.style.display == "none" ? "block" : "none"); 



        self.getRandomQuestion = function () {
            $scope.alert_user="";
            forgotPasswordServices.getRandomQuestion(self.USER_NAME).then(function (response){
                if(response.data=="no USER_NAME attribute")
                    $scope.alert_user="Wrong user name";
                else
                {
                    $scope.ques = response.data;
                    var first = document.getElementById("firstdiv"); 
                    var second = document.getElementById("seconddiv");
                 
                    first.style.display = (
                        first.style.display == "none" ? "block" : "none"); 
                    second.style.display = (
                        second.style.display == "none" ? "block" : "block"); 
                }

            }, function (response) {
                alert("Get ques failed");
            });
        
        };


        self.RetrievePassword = function () {
            $scope.alert_answer="";
            var dataToPass = {
                USER_NAME: self.USER_NAME,
                ANSWER: self.answer,
                QUESTION: $scope.ques.QUESTION_ID
            }
            forgotPasswordServices.RetrievePassword(dataToPass).then(function (response){
                if(response.data=="wrong answer. please try again" || response.data =="error" ||response.data =="the given user did not answer the given question when registerd")
                    $scope.alert_answer=response.data;
                else alert(response.data);
            }, function (response) {
                alert("Get ques failed");
            });
        };
    });
