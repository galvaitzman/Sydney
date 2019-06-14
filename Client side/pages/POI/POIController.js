
angular.module("myApp").service('POIServices',[ '$http', function ($http) {

    this.getAllPoints
        = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getAllPoints',
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

}])

    .controller('POIController', function ($scope,$http,POIServices){
        var self = this;

        POIServices.getAllPoints().then(function (response) {
            $scope.allPois = response.data;
            $scope.poisToShow=$scope.allPois;
        }, function (response) {
            self.Login.content = "Get 3 random POI failed";
        });


    });
