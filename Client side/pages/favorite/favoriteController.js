angular
  .module("myApp")
  .service("favoriteServices", [
    "$http",
    "$rootScope",
    function($http, $rootScope) {
      this.getAllSavedPoints = function() {
        var req = {
          method: "GET",
          url: "http://localhost:3000/POI/getAllSavedPoints",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          params: { token: $rootScope.currentToken }
        };
        return $http(req);
      };

      this.saveFavoritePointsToServer1 = function(existingFavoriteList) {
        var req = {
          method: "POST",
          url: "http://localhost:3000/POI/saveFavoritePointsToServer",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          data: { POIS_Array: existingFavoriteList },
          params: { token: $rootScope.currentToken }
        };
        return $http(req);
      };

      this.getTwoLastReviewsOnPoint = function(poi_id) {
        var req = {
          method: "GET",
          url: "http://localhost:3000/POI/getTwoLastReviewsOnPoint",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          params: { POI_ID: poi_id }
        };
        return $http(req);
      };

      this.reviewPoint = function(review) {
        var req = {
          method: "POST",
          url: "http://localhost:3000/POI/reviewPoint",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          data: review
        };
        return $http(req);
      };

      this.setNewOrderForSavedPoints = function(newOrderArray) {
        var req = {
          method: "POST",
          url: "http://localhost:3000/POI/setNewOrderForSavedPoints",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          data: { POI_Array: newOrderArray },
          params: { token: $rootScope.currentToken }
        };
        return $http(req);
      };
    }
  ])

  .controller("favoriteController", function(
    $rootScope,
    $scope,
    $http,
    favoriteServices
  ) {
    var self = this;
    $scope.allSavedPoints = [];
    $scope.rankList = [];
    $scope.lengthOfAllSavePoints = 0;

    $scope.existingFavList = [];
    var tempFavorites = JSON.parse(localStorage.getItem("favoriteList"));
    if (tempFavorites != null) {
      for (var i = 0; i < tempFavorites.length; i = i + 1) {
        if (tempFavorites[i].currentUser == $rootScope.currentUser)
          $scope.existingFavList.push(tempFavorites[i]);
      }
    }

    self.getAllSavedPoints = function() {
      favoriteServices.getAllSavedPoints().then(
        function(response) {
          $scope.allSavedPoints = response.data;
          $scope.lengthOfAllSavePoints = $scope.allSavedPoints.length;
          for (var i = 1; i <= $scope.lengthOfAllSavePoints; i = i + 1) {
            $scope.rankList.push({ id: i, isDisabled: false, poi_id: -1 });
          }
          $scope.item = $scope.rankList[0];
        },
        function(response) {
          //TODO: change the alert to informative message
          alert("Get All Saved Points Failed");
        }
      );
    };

    self.getAllSavedPoints();

    self.initialOrderList = function() {
      //$scope.rankList = [];
    };

    self.updateOrder = function(id) {
      $scope.rankList[id - 1] = null;
    };
    self.initialOrderList();

    self.saveFavoritePointsToServer = function() {
      favoriteServices.saveFavoritePointsToServer1($scope.existingFavList).then(
        function(response) {
          deleteFromLocalStorage();
          $rootScope.favCounter = 0;
          $scope.existingFavList = [];
          $scope.rankList = [];

          self.getAllSavedPoints();

          console.log(response);
        },
        function(response) {
          console.log(response);
          //TODO : change the alert
          alert("Save Favorite Points To Server Failed");
        }
      );
    };

    function deleteFromLocalStorage() {
      var existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
      if (existingFavList == null) existingFavList = [];
      var j = 0;
      var tmpArray = [];
      for (j = 0; j < existingFavList.length; j = j + 1) {
        if ($rootScope.currentUser != existingFavList[j].currentUser) {
          tmpArray.push(existingFavList[j]);
        }
      }
      $rootScope.favCounter = $rootScope.favCounter - 1;
      localStorage.setItem("favoriteList", JSON.stringify(tmpArray));
      console.log(localStorage.getItem("favoriteList"));
    }

    self.AddReview = function() {
      $scope.alert_addReview = "";

      if (self.review_input == "" || self.rank_input == "") {
        $scope.alert_addReview = "Please fill both fields";
      } else if (
        self.rank_input != "1" &&
        self.rank_input != "2" &&
        self.rank_input != "3" &&
        self.rank_input != "4" &&
        self.rank_input != "5"
      ) {
        $scope.alert_addReview = "Rank need to be between 1-5";
      } else {
        var review = {
          POI_ID: $scope.alert_poiID,
          REVIEW: self.review_input,
          rank: self.rank_input
        };
        favoriteServices.reviewPoint(review).then(
          function(response) {
            if (
              response.data == "one of the requierd attribute was not provided"
            ) {
              alert(response.data);
            } else {
              alert("Review saved successfully");
            }
          },
          function(response) {
            self.Login.content = "Add review failed";
          }
        );
      }
    };

    self.showAllInformation = function(poi) {
      $scope.alert_poiID = poi.POI_ID;
      $scope.alert_name = poi.NAME;
      $scope.alert_category = poi.CATEGORY;
      $scope.alert_RANK = poi.RANK;
      $scope.alert_NOV = poi.NOV;
      $scope.alert_desc = poi.DESCREPTION;
      $scope.alert_NOR = poi.NOR;
      $scope.alert_image = poi.IMAGE;
      $scope.alert_reviews = "";
      $scope.alert_addReview = "";
      $scope.twoLastReview = [];

      self.review_input = "";
      self.rank_input = "";

      favoriteServices.getTwoLastReviewsOnPoint(poi.POI_ID).then(
        function(response) {
          if (response.data == "no such attribute POI_ID in the given query") {
            //TODO: add message filed with binding
            //$scope.massage=response.data;
            alert("Get two last review failed");
          }
          if (response.data == "no reviews for this POI")
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
    $scope.update = function(currentitem, poi_id) {
      if (currentitem) {
        var x = currentitem.id;
        var i = findWithAttr($scope.rankList, "poi_id", poi_id);
        if (i !== -1) {
          $scope.rankList[i].poi_id = -1;
          $scope.rankList[i].isDisabled = false;
        }
        $scope.rankList[x - 1].isDisabled = true;
        $scope.rankList[x - 1].poi_id = poi_id;
        for (var j = 0; j < $scope.rankList.length; j += 1) {
          if ($scope.rankList[j]["poi_id"] === -1) {
            $scope.item = $scope.rankList[j];
            break;
          }
        }
      }
    };

    self.changePoisOrder = function() {
      var counter = 0;
      var lostPoiID = -1;
      for (var i = 0; i < $scope.rankList.length; i = i + 1) {
        if ($scope.rankList[i].poi_id == -1) {
          counter = counter + 1;
        }
        if (
          findWithAttr(
            $scope.rankList,
            "poi_id",
            $scope.allSavedPoints[i].POI_ID
          ) == -1
        ) {
          lostPoiID = $scope.allSavedPoints[i].POI_ID;
        }
      }

      if (counter > 1 || $scope.rankList.length <= 1) return false;
      var newOrderArray = [];
      for (var j = 0; j < $scope.rankList.length; j = j + 1) {
        if ($scope.rankList[j].poi_id == -1) {
          newOrderArray.push({ POI_ID: lostPoiID, POSITION: j });
        } else {
          newOrderArray.push({
            POI_ID: $scope.rankList[j].poi_id,
            POSITION: j
          });
        }
      }
      favoriteServices.setNewOrderForSavedPoints(newOrderArray).then(
        function(response) {
          $scope.rankList = [];
          self.getAllSavedPoints();
        },
        function(response) {
          //self.Login.content = "Add review failed";
        }
      );
    };

    function findWithAttr(array, attr, value) {
      for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
          return i;
        }
      }
      return -1;
    }
  })

  .filter("filterChosenPOIS", function() {
    return function(items, name) {
      var arrayToReturn = [];
      for (var i = 0; i < items.length; i++) {
        if (items[i].isDisabled == false || items[i].poi_id == name) {
          arrayToReturn.push(items[i]);
        }
      }

      return arrayToReturn;
    };
  });
