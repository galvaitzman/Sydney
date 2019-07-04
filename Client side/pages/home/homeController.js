angular
  .module("myApp")
  .service("HomeServices", [
    "$http","$rootScope",
    function($http,$rootScope) {
      this.random3POI = function() {
        var req = {
          method: "GET",
          url: "http://localhost:3000/POI/getThreePopularRandomPoints",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          }
        };
        return $http(req);
      };


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
      };

      this.getTwoMostPopularPoints = function () {
        var req = {
          method: 'GET',
          url: 'http://localhost:3000/POI/getTwoMostPopularPoints',
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
      };
    }
    
  ])

  .controller("HomeController", function(
    $scope,
    $http,
    HomeServices,
    $rootScope
  ) {
    $scope.current_user = "Guest";

    var self = this;
    $scope.$watch('isGuest',function(newValue,oldValue){
      if (newValue == false){
        getTwoLastSavedPoints();
        getTwoMostPopularPoints();
      }
    })
    if ($rootScope.currentUser != null && $rootScope.currentUser != "") {
      $scope.current_user = $rootScope.currentUser;
    } //DONE by inbar
    HomeServices.random3POI().then(
      function(response) {
        $scope.random3POIlist = response.data;
      },
      function(response) {
        self.Login.content = "Get 3 random POI failed";
      }
    );

    

    function getTwoLastSavedPoints() {
      HomeServices.getTwoLastSavedPoints().then(function (response) {
          if (response.data == "no saved points for this user")
              alert(response.data);
          else {
              $scope.twoLastSavedPoints = response.data;
          }
      }, function (response) {
          //TODO: change the alert to informative message
          alert("Get Two Last Saved Points Failed");
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
              HomeServices.reviewPoint(review).then(
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

          HomeServices.getTwoLastReviewsOnPoint(poi.POI_ID).then(
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


  function getTwoMostPopularPoints() {
      HomeServices.getTwoMostPopularPoints().then(function (response) {
          if (response.data == "no Point of Interest from the given category")
              alert(response.data);
          else {
              $scope.twoMostPopularPoints = response.data;
          }
      }, function (response) {
          //TODO: change the alert to informative message
          alert("Get Two Most Popular Point Points Failed");
      });
  }

 
   
  

  

  });
