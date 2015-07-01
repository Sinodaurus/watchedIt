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
          $rootScope.personId = data.personId;
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

angular.module('watcherApp', ['ngMaterial', 'watcher.services', 'ngRoute', 'ngMessages', 'dcbClearInput'])

.config(function ($routeProvider, $mdIconProvider, $mdThemingProvider) {
  // $routeProvider
  //
  //   .when('/', {
  //       templateUrl : 'pages/home.html',
  //       controller : 'homeController'
  //   })
  //   .when('/userScreen', {
  //       templateUrl : 'pages/userScreen.html',
  //       controller : 'userScreenController'
  //   })
  //   .when('/userScreen/movieList', {
  //       templateUrl : 'pages/movieList.html',
  //       controller : 'movieListController'
  //   })
  //   .when('/userScreen/searchMovies', {
  //       templateUrl : 'pages/searchMovies.html',
  //       controller : 'searchMoviesController'
  //   })
  //   .when('/login', {
  //       templateUrl : 'pages/login.html',
  //       controller : 'loginController'
  //   })
  //   .otherwise('/');

  $mdIconProvider
      .defaultIconSet("./assets/svg/avatars.svg", 128)
      .icon("menu"       , "./assets/svg/menu.svg"        , 24)
      .icon("share"      , "./assets/svg/share.svg"       , 24)
      .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
      .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
      .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
      .icon("phone"      , "./assets/svg/phone.svg"       , 512);

  $mdThemingProvider.theme('default')
      .primaryPalette('light-green')
      .accentPalette('lime')
      .dark();
})

.controller('homeController', function($rootScope, $scope, $http, $location) {
  $scope.login = function() {
    $location.path("/login");
  }

  $scope.logout = function() {
    $rootScope.person = {};
    $rootScope.seenMovies = [];
    $http.get('http://localhost:8080/auth/logout');
    $location.path("/");
  }
})

.controller('loginController', function($rootScope, $scope, $http, $location) {

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
    {name:"Movies",location:"/userScreen"},
    {name:"Graphs",location:"#"}];

  $scope.toggleList = function () {
    $mdSidenav('left').toggle();
  }

  $scope.clickOption = function(option) {
    self.selected = angular.isNumber(option) ? $scope.pageOptions[option] : option;
    $location.path(option.location);
    $mdSidenav('left').toggle();
  }

  $scope.logout = function() {
    $rootScope.person = {};
    $location.path("/");
  }
})

.controller('userScreenController', function($rootScope, $mdDialog, $mdSidenav, $scope, $http, $location, personService) {

  $scope.showAdd = function() {
    $mdDialog.show({
      controller: loginController,
      template: '<md-dialog aria-label="Login" style="min-height:274px;"> <md-content class="md-padding"> <form name="loginForm"> <md-subheader class="md-primary md-no-sticky">Log in...</md-subheader> <md-input-container> <label>Username</label> <input required name="username" ng-model="credentials.userName"> <div ng-messages="loginForm.username.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container> <md-input-container> <label>Password</label> <input type="password" required name="password" ng-model="credentials.password"> <div ng-messages="loginForm.password.$error"> <div ng-message="required">This is required.</div> </div> </md-input-container><h3 ng-show="hasError" class="md-warn">Login incorrect...</h3> <div layout="row"><md-button flex ng-click="logIn()" class="md-raised md-primary">Authenticate</md-button> </div> </form></md-content> </md-dialog>',
    }).then(function() {
      var req = {
        method: 'GET',
        url: 'http://localhost:8080/auth/getToken'
      }
      $http(req).success(function(data) {
        if($rootScope.seenMovies && $rootScope.seenMovies.length > 0) {

        } else {
          $rootScope.seenMovies = [];

        var person = personService.get({id: data.personInfoDTO.personId});
        person.$promise.then(function(promised) {
          $scope.person = promised;


          var imdbMoviesIds = person.seenMovies;

          imdbMoviesIds.forEach(function(entry) {
              $http({
                method: 'GET',
                url: 'http://www.omdbapi.com/?i='+entry.imdbMovieId
              }).success(function(data) {
                if(data.Poster === "N/A") {
                  data.Poster = "assets/img/NA.png";
                }
                $scope.seenMovies.push(data);
              });
            });
          });
        }
        });
    });
    };

  var req = {
    method: 'GET',
    url: 'http://localhost:8080/auth/getToken'
  }
  $http(req).success(function(data) {
    if($rootScope.seenMovies && $rootScope.seenMovies.length > 0) {

    } else {
      $rootScope.seenMovies = [];

    var person = personService.get({id: data.personInfoDTO.personId});
    person.$promise.then(function(promised) {
      $scope.person = promised;


      var imdbMoviesIds = person.seenMovies;

      imdbMoviesIds.forEach(function(entry) {
          $http({
            method: 'GET',
            url: 'http://www.omdbapi.com/?i='+entry.imdbMovieId
          }).success(function(data) {
            if(data.Poster === "N/A") {
              data.Poster = "assets/img/NA.png";
            }
            $scope.seenMovies.push(data);
          });
        });
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
  // $rootScope.person = {"personId":20,"firstName":"Sven","lastName":"Schittecatte","seenMovies":[{"seenMovieId":17,"imdbMovieId":"tt0067809"},{"seenMovieId":13,"imdbMovieId":"tt0963178"},{"seenMovieId":7,"imdbMovieId":"tt2788710"},{"seenMovieId":6,"imdbMovieId":"tt0110148"},
  // {"seenMovieId":12,"imdbMovieId":"tt0373926"},{"seenMovieId":18,"imdbMovieId":"tt0995718"},{"seenMovieId":14,"imdbMovieId":"tt0165832"},{"seenMovieId":20,"imdbMovieId":"tt0107566"},{"seenMovieId":11,"imdbMovieId":"tt1839578"},{"seenMovieId":5,"imdbMovieId":"tt0816692"},
  // {"seenMovieId":8,"imdbMovieId":"tt0118655"},{"seenMovieId":23,"imdbMovieId":"tt0249853"},{"seenMovieId":15,"imdbMovieId":"tt0085859"},{"seenMovieId":10,"imdbMovieId":"tt0172493"},{"seenMovieId":19,"imdbMovieId":"tt0387357"},{"seenMovieId":9,"imdbMovieId":"tt2234155"},
  // {"seenMovieId":22,"imdbMovieId":"tt0097769"},{"seenMovieId":21,"imdbMovieId":"tt0472126"},{"seenMovieId":24,"imdbMovieId":"tt0293357"},{"seenMovieId":16,"imdbMovieId":"tt0065051"}]};
// $scope.seenMovies = [];
//   $scope.seenMovies.push({"Title":"The Interpreter","Year":"2005","Rated":"PG-13","Released":"22 Apr 2005","Runtime":"128 min","Genre":"Mystery, Thriller","Director":"Sydney Pollack","Writer":"Martin Stellman (story), Brian Ward (story), Charles Randolph (screenplay), Scott Frank (screenplay), Steven Zaillian (screenplay)","Actors":"Nicole Kidman, Sean Penn, Catherine Keener, Jesper Christensen","Plot":"Political intrigue and deception unfold inside the United Nations, where a U.S. Secret Service agent is assigned to investigate an interpreter who overhears an assassination plot.","Language":"Aboriginal, English, French, Portuguese","Country":"UK, USA, France, Germany","Awards":"4 wins & 1 nomination.","Poster":"http://ia.media-imdb.com/images/M/MV5BMTg3MjMxNDUzNV5BMl5BanBnXkFtZTcwNTM2NzgyMQ@@._V1_SX300.jpg","Metascore":"62","imdbRating":"6.4","imdbVotes":"82279","imdbID":"tt0373926","Type":"movie","Response":"True"});
});
