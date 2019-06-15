let app = angular.module("myApp", ["ngRoute"]);

// config routes
app.config(function($routeProvider) {
  $routeProvider
    // homepage
    .when("/", {
      // this is a template
      templateUrl: "pages/home/home.html",
      controller: "HomeController as homeCtrl"
    })
    // about
    .when("/about", {
      // this is a template url
      templateUrl: "pages/about/about.html",
      controller: "aboutController as abtCtrl"
    })
    .when("/login", {
      templateUrl: "pages/login/login.html",
      controller: "loginController as loginCtrl"
    })
    .when("/register", {
      templateUrl: "pages/register/register.html",
      controller: "registerController as registerCtrl"
    })
    .when("/forgotPassword", {
      // this is a template url
      templateUrl: "pages/forgotPassword/forgotPassword.html",
      controller: "forgotPasswordController as forgotPassCtrl"
    })
    .when("/POI", {
      // this is a template url
      templateUrl: "pages/POI/POI.html",
      controller: "POIController as POICtrl"
    })

    .when("/favorite", {
      // this is a template url
      templateUrl: "pages/favorite/favorite.html",
      controller: "favoriteController as favoriteCtrl"
    })

    // other
    .otherwise({ redirectTo: "/" });

  // TODO: to fix in the html Hello User
});
