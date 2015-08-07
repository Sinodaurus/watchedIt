'use strict';

var checkIfAuthenticated = function($rootScope, $http, $location, personService) {
  var req = {
    method: 'GET',
    url: 'http://localhost:8080/auth/getToken/' + $rootScope.person.firstName
  }
  $http(req).success(function(data) {
    $rootScope.person = personService.get({id: data.personInfoDTO.personId});
  }).error(function() {
    $location.path("/login");
  });
}

function loginController($rootScope, $scope, $http, $location, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

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
          $rootScope.person = data;
          $scope.hide();
          $location.path("/");
          $scope.hasError = false;
        } else {
            $location.path("/");
            $scope.hasError = true;
        }
      });
    })
  }
};

angular.module('watcherApp', ['ngMaterial', 'watcher.services', 'ngRoute', 'ngMessages', 'dcbClearInput', 'ngMdIcons', 'ngAnimate'])

.config(function ($routeProvider, $mdIconProvider, $mdThemingProvider) {
  $routeProvider

    .when('/', {
        templateUrl : 'index.html',
        controller : 'homeController'
    })
    .otherwise('/');

  $mdThemingProvider.theme('default')
      .primaryPalette('light-green')
      .accentPalette('lime')
      .dark();
})

.controller('homeController', function($rootScope, $scope, $http, $location) {
  $scope.login = function() {
    $location.path("/login");
  }
})

.controller('MainController', function($rootScope, $scope, $http, $location) {
  $scope.logout = function() {
    $rootScope.person = {};
    $http.get('http://localhost:8080/auth/logout');
    $location.path("/");
  }
})

.controller('searchController', function($scope, $rootScope, $http) {
  $scope.search = function() {
    var req = {
      method: 'GET',
      url: 'http://www.omdbapi.com?s=*' + $scope.movie.search + '*'
    }
    $http(req).success(function(data) {
      $rootScope.results = data;
    });
  }

  $scope.info = function(movie, $index) {
    var req = {
      method: 'GET',
      url: 'http://www.omdbapi.com?i=' + movie.imdbID
    }
    $http(req).success(function(data) {
      if ($scope.info[$index] === undefined) {
        $scope.info[$index] = true;
      } else {
        $scope.info[$index] = !$scope.info[$index];
      }
      $scope.searchMovie = data;
    });
  }
})

.controller('userScreenController', function($rootScope, $mdDialog, $mdSidenav, $scope, $http, $location, personService) {
  $scope.showAdd = function() {
    $mdDialog.show({
      controller: loginController,
      template: '<md-dialog aria-label="Login" style="min-height:274px;"> <md-content class="md-padding"> <form name="loginForm"> <md-subheader class="md-primary md-no-sticky">Log in...</md-subheader> <md-input-container> <label>Username</label> <input required name="username" ng-model="credentials.userName"> <div ng-messages="loginForm.username.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <md-input-container> <label>Password</label> <input type="password" required name="password" ng-model="credentials.password"> <div ng-messages="loginForm.password.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container><md-toolbar ng-show="hasError" class="md-warn"> <span>Login incorrect...</span> </md-toolbar> <div layout="row"><md-button flex ng-click="logIn()" class="md-raised md-primary">Authenticate</md-button> </div> </form></md-content> </md-dialog>',
    }).then(function() {
      var req = {
        method: 'GET',
        url: 'http://localhost:8080/auth/getToken' + $rootScope.person.userName
      }
      $http(req).success(function(data) {
        var person = personService.get({id: data.personInfoDTO.personId});
        person.$promise.then(function(promised) {
          $rootScope.person = promised;
          for (var item in $rootScope.person.seenMovies) {
            if($rootScope.person.seenMovies[item].Poster === "N/A") {
              $rootScope.person.seenMovies[item].Poster = "assets/img/NA.png";
            }
          }
          });
        });
    });
    };

  var req = {
    method: 'GET',
    url: 'http://localhost:8080/auth/getToken' + $rootScope.person.userName
  }
  $http(req).success(function(data) {
    if($rootScope.person) {
    } else {
    var person = personService.get({id: data.personInfoDTO.personId});
    person.$promise.then(function(promised) {
      $rootScope.person = promised;
      for (var item in $rootScope.person.seenMovies) {
        if($rootScope.person.seenMovies[item].Poster === "N/A") {
          $rootScope.person.seenMovies[item].Poster = "assets/img/NA.png";
        }
      }
      });
    }
    }).error(function() {
      $scope.showAdd();
    });

    $scope.queryMovies = function(query) {
      return results = query ? $scope.seenMovies.filter( createFilterFor(query) ) : $scope.seenMovies;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);
      return function filterFn(movie) {
        return (movie.Title.indexOf(lowercaseQuery) === 0);
      };
    }

  $scope.addMovie = function() {
    $mdDialog.show({
      template: '<md-dialog aria-label="Login" style="min-height:274px;"> <md-content class="md-padding"> Add a movie!</md-content> </md-dialog>',
    })
  }
})

.controller('loginController2', function($rootScope, $scope, $http, $location, $mdDialog) {

  $scope.credentials = {};

  $scope.logIn = function() {
    $scope.hasError = true;
  }
  $scope.reset = function() {
    $scope.hasError = false;
  }
});
