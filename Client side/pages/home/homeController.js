angular
  .module("myApp")
  .service("HomeServices", [
    "$http",
    function($http) {
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
    }
  ])

  .controller("HomeController", function(
    $scope,
    $http,
    HomeServices,
    $rootScope
  ) {
    $scope.current_user = "Guest";
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
  });
