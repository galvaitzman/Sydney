let app = angular.module('myApp', ["ngRoute"]);

// config routes
app.config(function($routeProvider)  {
    $routeProvider
        // homepage
        .when('/', {
            // this is a template
            template: '<h1>This is the default route</h1>'
        })
        // about
        .when('/about', {
            // this is a template url
            templateUrl: 'pages/about/about.html',
            controller : 'aboutController as abtCtrl'
        })
        .when('/login', {
            templateUrl: 'pages/login/login.html',
            controller : 'loginController as loginCtrl'
        })
        .when('/register', {
            templateUrl: 'pages/register/register.html',
            controller : 'registerController as registerCtrl',
        })
        .when('/forgotPassword', {
            // this is a template url
            templateUrl: 'pages/forgotPassword/forgotPassword.html',
            controller : 'forgotPasswordController as forgotPassCtrl'
        })
        // other
        .otherwise({ redirectTo: '/' });
});
