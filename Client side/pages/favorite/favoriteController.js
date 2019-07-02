
angular.module("myApp").service('favoriteServices', ['$http','$rootScope' ,function ($http,$rootScope) {

           


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

    this.getTwoLastReviewsOnPoint = function (poi_id) {
        var req = {
            method: 'GET',
            url: 'http://localhost:3000/POI/getTwoLastReviewsOnPoint',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            params: {POI_ID : poi_id}
        };
        return $http(req);
    }


    this.reviewPoint = function (review) {
        var req = {
            method: 'POST',
            url: 'http://localhost:3000/POI/reviewPoint',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Methods' :"GET, POST, PUT, DELETE, OPTIONS",
                'Access-Control-Allow-Headers' : '*',
                'Access-Control-Max-Age' : '*',
                'Content-Type': 'application/json'
            },
            data: review
        };
        return $http(req);
    }



}])


    .controller("favoriteController", function($rootScope, $scope, $http, favoriteServices) {
        var self=this;
        $scope.allSavedPoints=[];
        $scope.existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
        if($scope.existingFavList == null) $scope.existingFavList = [];

        function getAllSavedPoints() {
            favoriteServices.getAllSavedPoints().then(function (response) {

                $scope.allSavedPoints = response.data;

            }, function (response) {
                //TODO: change the alert to informative message
                alert("Get All Saved Points Failed");
            });
        }

        function initialOrderList() {
            $scope.rankList = [];
            var lengthOfAllSavePoints = $scope.allSavedPoints.length;
            for (var i = 1; i <= lengthOfAllSavePoints; i = i + 1)
                $scope.rankList.push(i);
        }

        getAllSavedPoints();
        initialOrderList();


        self.saveFavoritePointsToServer = function () {

            favoriteServices.saveFavoritePointsToServer1($scope.existingFavList).then(function (response){
                localStorage.clear();
                $rootScope.favCounter=0;
                $scope.existingFavList=[];


                getAllSavedPoints();
                getTwoMostPopularPoints();
                getTwoLastSavedPoints();

                console.log(response);
            }, function (response) {
                console.log(response);
                //TODO : change the alert
                alert("Save Favorite Points To Server Failed");
            });
        };


        self.AddReview = function() {
            $scope.alert_addReview="";

            if(self.review_input == "" || self.rank_input == "")
            {
                $scope.alert_addReview="Please fill both fields";
            }
            else if (self.rank_input!= "1" && self.rank_input!= "2" && self.rank_input!= "3" && self.rank_input!= "4" && self.rank_input!= "5")
            {
                $scope.alert_addReview="Rank need to be between 1-5";
            }
            else {
                var review = {POI_ID: $scope.alert_poiID, REVIEW: self.review_input, rank: self.rank_input};
                favoriteServices.reviewPoint(review).then(
                    function (response) {
                        if (response.data == "one of the requierd attribute was not provided") {
                            alert(response.data);
                        } else {
                            alert("Review saved successfully");
                        }
                    },
                    function (response) {
                        self.Login.content = "Add review failed";
                    }
                );
            }


        }



        self.showAllInformation = function(poi) {

            $scope.alert_poiID = poi.POI_ID;
            $scope.alert_name= poi.NAME;
            $scope.alert_category = poi.CATEGORY;
            $scope.alert_RANK = poi.RANK;
            $scope.alert_NOV = poi.NOV;
            $scope.alert_desc = poi.DESCREPTION;
            $scope.alert_NOR = poi.NOR;
            $scope.alert_image = poi.IMAGE;
            $scope.alert_reviews="";
            $scope.alert_addReview="";
            $scope.twoLastReview=[];
            self.review_input="";
            self.rank_input="";

            favoriteServices.getTwoLastReviewsOnPoint(poi.POI_ID).then(
                function(response) {
                    if (response.data == "no such attribute POI_ID in the given query") {
                        //TODO: add message filed with binding
                        //$scope.massage=response.data;
                        alert("Get two last review failed");
                    }
                    if(response.data == "no reviews for this POI")
                        $scope.alert_reviews = "No reviews for this POI";
                    else {
                        $scope.twoLastReview = response.data;
                    }
                },
                function(response) {
                    alert("Get two last review failed");
                }
            );
        };
    });
