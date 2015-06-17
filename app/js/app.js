'use strict';

angular.module('watcherApp', ['ngRoute'])

.config(function ($routeProvider) {
  $routeProvider

    .when('/', {
        templateUrl : 'pages/home.html',
        controller : 'homeController'
    })
    .when('/movieList', {
        templateUrl : 'pages/movieList.html',
        controller : 'movieListController'
    })

    .when('/login', {
        templateUrl : 'pages/login.html',
        controller : 'loginController'
    })
    .otherwise('/');
})

.controller('homeController', function($scope) {
  $scope.person = {};
  $scope.person.firstName = "test";
  $scope.person.lastName = "bla";
})

.controller('loginController', function($rootScope, $scope, $http, $location) {

  $scope.credentials = {};

  var authenticate = function(callback) {
    $http({
        method: 'GET',
        url:'http://localhost:8080/persons/auth/' + $scope.credentials.userName,
        headers: {'Authorization':'Basic '+ btoa($scope.credentials.userName + ":" + $scope.credentials.password)}
      }).success(function(data) {
        if(!data) {
          $rootScope.authenticated = false;
          callback && callback();
        } else if(data["status"] === "authentified") {
            $rootScope.authenticated = true;
        } else {
          rootScope.authenticated = false;
        }
        callback && callback();
      });
  }

  $scope.logIn = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:8080/persons/getUser/' + $scope.credentials.userName
    }).success(function(data) {
      authenticate(function() {
        if($rootScope.authenticated) {
          $location.path("/movieList");
          $scope.hasError = false;
        } else {
          $location.path("/login");
          $scope.hasError = true;
        }
      });
    })
  }
})

.controller('movieListController', function() {

});
