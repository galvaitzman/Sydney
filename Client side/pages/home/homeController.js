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
    }
    
  ])

  .controller("HomeController", function(
    $scope,
    $http,
    HomeServices,
    $rootScope
  ) {
    $scope.current_user = "Guest";
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
