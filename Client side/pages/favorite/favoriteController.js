
angular.module("myApp").service('favoriteServices', ['$http','$rootScope' ,function ($http,$rootScope) {

            this.getTwoLastSavedPoints = function () {
            var req = {
                method: 'GET',
                url: 'http://localhost:3000/POI/getTwoLastSavedPoints',
                headers: {
                    'Access-Control-Allow-Origin' : '*',
                    'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                    'Access-Control-Allow-Headers' : '*',
                    'Access-Control-Max-Age' : '*',
                    'Content-Type': 'application/json'
                },
                params: {token:$rootScope.currentToken}
            };
            return $http(req);
        }

        this.getTwoMostPopularPoints = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getTwoLastSavedPoints',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {token:$rootScope.currentToken}
        };
        return $http(req);
            }


    this.getAllSavedPoints = function () {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getAllSavedPoints',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {token:$rootScope.currentToken}
        };
        return $http(req);
    }

    this.saveFavoritePointsToServer1 = function (existingFavoriteList) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/POI/saveFavoritePointsToServer',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            data: {POIS_Array:existingFavoriteList},
            params: {token:$rootScope.currentToken}
        };
        return $http(req);
    }


}])


    .controller("favoriteController", function($rootScope, $scope, $http, favoriteServices) {
        var self=this;
        $scope.existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
        if($scope.existingFavList == null) $scope.existingFavList = [];

        favoriteServices.getTwoLastSavedPoints().then(function (response) {
            if(response.data=="no saved points for this user")
                alert(response.data);
            else {
                $scope.twoLastSavedPoints = response.data;
            }
        }, function (response) {
            //TODO: change the alert to informative message
            alert( "Get Two Last Saved Points Failed");
        });


        favoriteServices.getTwoMostPopularPoints().then(function (response) {
            if(response.data=="no Point of Interest from the given category")
                alert(response.data);
            else {
                $scope.twoMostPopularPoints = response.data;
            }
        }, function (response) {
            //TODO: change the alert to informative message
            alert( "Get Two Most Popular Point Points Failed");
        });

        favoriteServices.getAllSavedPoints().then(function (response) {

                $scope.allSavedPoints = response.data;

        }, function (response) {
            //TODO: change the alert to informative message
            alert( "Get All Saved Points Failed");
        });

        self.saveFavoritePointsToServer = function () {

            favoriteServices.saveFavoritePointsToServer1($scope.existingFavList).then(function (response){
                localStorage.clear();
                $rootScope.favCounter=0;

                favoriteServices.getAllSavedPoints().then(function (response) {

                    $scope.allSavedPoints = response.data;

                }, function (response) {
                    //TODO: change the alert to informative message
                    alert( "Get All Saved Points Failed");
                });

                console.log(response);
            }, function (response) {
                console.log(response);
                //TODO : change the alert
                alert("Save Favorite Points To Server Failed");
            });
        };



    });
