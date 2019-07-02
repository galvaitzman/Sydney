angular
  .module("myApp")
  .service("LoginServices", [
    "$http",
    function($http) {
      this.Login = function(userToPass) {
        var req = {
          method: "POST",
          url: "http://localhost:3000/USERS/Login",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Max-Age": "*",
            "Content-Type": "application/json"
          },
          data: userToPass
        };
        return $http(req);
        // return  $http.post("http://localhost:3000/USERS/Login", userToPass);
      };

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

  .controller("loginController", function(
    $scope,
    $http,
    LoginServices,
    $rootScope,
    $window

  ) {
    var self = this;
    var current_user = "Guest";
    var current_token = "";
    $scope.alert_login="";
    $scope.HelloUser = "Hello" + current_user; //DONE by inbar
    $rootScope.currentUser = current_user; //DONE by inbar
    $rootScope.currentToken = current_token;
    $rootScope.favCounter=0;
    $rootScope.isGuest=true;

    

     /* localStorage.clear();
      console.log(localStorage);*/

      var existingFavList = JSON.parse(localStorage.getItem("favoriteList"));
      if(existingFavList != null)
          $rootScope.favCounter=existingFavList.length;


    LoginServices.random3POI().then(
      function(response) {
        $scope.random3POIlist = response.data;
      },
      function(response) {
        self.Login.content = "Get 3 random POI failed";
      }
    );

    self.Login = function() {
        $scope.alert_login="";
      var userToPass = { USER_NAME: self.USER_NAME, PASSWORD: self.PASSWORD };
      LoginServices.Login(userToPass).then(
        function(response) {
          if (
            response.data == "Wrong Username" ||
            response.data == "Wrong Password"
          ) {
              $scope.alert_login=response.data;
          } else {
            //TODO:REMOVE after moving to the new page
            //alert("success");
            current_user = userToPass.USER_NAME;
            current_token = response.data;
            $rootScope.currentUser = current_user; //DONE by inbar
            $rootScope.currentToken = current_token;// DONE by inbar
            $rootScope.isGuest=false;
            alert("Hello " + $rootScope.currentUser); //DONE by inbar
            $window.location.href = "#!/login";
          }
        },
        function(response) {
          self.Login.content = "Login failed";
        }
      );
    };
  });
