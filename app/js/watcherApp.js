'use strict';

var checkIfAuthenticated = function($rootScope, $http, $location, personService) {
  var req = {
    method: 'GET',
    url: 'http://localhost:8080/auth/getToken'
  }
  $http(req).success(function(data) {
    $rootScope.person = personService.get({id: data.personInfoDTO.personId});
  }).error(function() {
    $location.path("/login");
  });
}

angular.module('watcherApp', ['watcher.services', 'ngRoute'])

.config(function ($routeProvider) {
  $routeProvider

    .when('/', {
        templateUrl : 'pages/home.html',
        controller : 'homeController'
    })
    .when('/userScreen', {
        templateUrl : 'pages/userScreen.html',
        controller : 'userScreenController'
    })
    .when('/userScreen/movieList', {
        templateUrl : 'pages/movieList.html',
        controller : 'movieListController'
    })
    .when('/userScreen/searchMovies', {
        templateUrl : 'pages/searchMovies.html',
        controller : 'searchMoviesController'
    })
    .when('/login', {
        templateUrl : 'pages/login.html',
        controller : 'loginController'
    })
    .otherwise('/');
})

.controller('homeController', function($scope, $location) {
  $scope.login = function() {
    $location.path("/login");
  }

  $scope.logout = function() {
    $rootScope.person = {};
    $location.path("/");
  }
})

.controller('loginController', function($rootScope, $scope, $http, $location) {

  var $jq = jQuery.noConflict();
  $jq("#login")[0][0].focus();
  $scope.credentials = {};

  var authenticate = function(callback) {
    var req = {
      method: 'GET',
      url:'http://localhost:8080/auth/' + $scope.credentials.userName,
      headers: {'Authorization':'Basic '+ btoa($scope.credentials.userName + ":" + $scope.credentials.password)}
    }
    $http(req).success(function(data) {
      $rootScope.authenticated = true;
      callback && callback();
    }).error(function() {
      $rootScope.authenticated = false;
      callback && callback();
    });
  }

  $scope.logIn = function() {
    $http({
      method: 'GET',
      url: 'http://localhost:8080/auth/getUser/' + $scope.credentials.userName
    }).success(function(data) {
      authenticate(function() {
        if($rootScope.authenticated) {
          $rootScope.personId = data.personId;
          $location.path("/userScreen");
          $scope.hasError = false;
        } else {
            $location.path("/login");
            $scope.hasError = true;
            $jq("#login")[0].reset();
            $jq("#login")[0][0].focus();
        }
      });
    })
  }
})

.controller('userScreenController', function($rootScope, $scope, $http, $location, personService) {
  // checkIfAuthenticated($rootScope, $http, $location, personService);

  var req = {
    method: 'GET',
    url: 'http://localhost:8080/auth/getToken'
  }
  $http(req).success(function(data) {
    var person = personService.get({id: data.personInfoDTO.personId});
    person.$promise.then(function(promised) {
      $scope.person = promised;
      $scope.seenMovies = [];

      var imdbMoviesIds = person.seenMovies;

      imdbMoviesIds.forEach(function(entry) {
          $http({
            method: 'GET',
            url: 'http://www.omdbapi.com/?i='+entry.imdbMovieId
          }).success(function(data) {
            $scope.seenMovies.push(data);
          });
        });
      });
    }).error(function() {
      $location.path("/login");
    });
})

.controller('movieListController', function($http, $scope, $rootScope, $location, personService) {
  checkIfAuthenticated($rootScope, $http, $location, personService);
})

.controller('searchMoviesController', function() {

});
