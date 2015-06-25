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

angular.module('watcherApp', ['ngMaterial', 'watcher.services', 'ngRoute'])

.config(function ($routeProvider, $mdIconProvider, $mdThemingProvider) {
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

  $mdIconProvider
      .defaultIconSet("./assets/svg/avatars.svg", 128)
      .icon("menu"       , "./assets/svg/menu.svg"        , 24)
      .icon("share"      , "./assets/svg/share.svg"       , 24)
      .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
      .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
      .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
      .icon("phone"      , "./assets/svg/phone.svg"       , 512);

  $mdThemingProvider.theme('default')
      .primaryPalette('indigo')
      .accentPalette('purple');
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

.controller('movieListController', function($http, $scope, $rootScope, $location, personService) {
  checkIfAuthenticated($rootScope, $http, $location, personService);
})

.controller('searchMoviesController', function() {

})

.controller('MainController', function($rootScope, $mdSidenav, $scope, $location) {
  $scope.pageOptions = [
    {name:"Movies",location:"/#/userScreen"},
    {name:"Graphs",location:"#"}];

  $scope.toggleList = function () {
    $mdSidenav('left').toggle();
  }

  $scope.logout = function() {
    $rootScope.person = {};
    $location.path("/");
  }
})

.controller('userScreenController', function($rootScope, $mdSidenav, $scope, $http, $location, personService) {
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

  // $rootScope.person = {"personId":20,"firstName":"Sven","lastName":"Schittecatte","seenMovies":[{"seenMovieId":17,"imdbMovieId":"tt0067809"},{"seenMovieId":13,"imdbMovieId":"tt0963178"},{"seenMovieId":7,"imdbMovieId":"tt2788710"},{"seenMovieId":6,"imdbMovieId":"tt0110148"},
  // {"seenMovieId":12,"imdbMovieId":"tt0373926"},{"seenMovieId":18,"imdbMovieId":"tt0995718"},{"seenMovieId":14,"imdbMovieId":"tt0165832"},{"seenMovieId":20,"imdbMovieId":"tt0107566"},{"seenMovieId":11,"imdbMovieId":"tt1839578"},{"seenMovieId":5,"imdbMovieId":"tt0816692"},
  // {"seenMovieId":8,"imdbMovieId":"tt0118655"},{"seenMovieId":23,"imdbMovieId":"tt0249853"},{"seenMovieId":15,"imdbMovieId":"tt0085859"},{"seenMovieId":10,"imdbMovieId":"tt0172493"},{"seenMovieId":19,"imdbMovieId":"tt0387357"},{"seenMovieId":9,"imdbMovieId":"tt2234155"},
  // {"seenMovieId":22,"imdbMovieId":"tt0097769"},{"seenMovieId":21,"imdbMovieId":"tt0472126"},{"seenMovieId":24,"imdbMovieId":"tt0293357"},{"seenMovieId":16,"imdbMovieId":"tt0065051"}]};
});
