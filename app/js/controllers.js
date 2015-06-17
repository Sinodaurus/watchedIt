angular.module('watcher.controllers', []).
controller('personsController', function($scope, $http, personService, personByUserName, authenticateUser, $sce) {
    $scope.nameFilter = null;
        $scope.authenticated = false;
        $scope.hasError = false;
    var $jq = jQuery.noConflict();

    // personService.query(function(data) {
    //   $scope.persons = data;
    // });

    $scope.deleteMovieForUser = function(person, movie) {
      personService.delete({personId: person.personId, movieId: movie.movieId}, function(data) {
          return data;
      });
      var index = person.seenMovies.indexOf(movie);
      if (index != -1) {
        return person.seenMovies.splice(index, 1);
      }
    }

    $scope.getImdbMovie = function(movieTitle) {
        return $http({
          method: 'GET',
          url: 'http://www.omdbapi.com/?t='+movieTitle
      });
    }

    $scope.searchImdbMovie = function(movieTitle) {
        return $http({
          method: 'GET',
          url: 'http://www.omdbapi.com/?s='+movieTitle
      });
    }

    $scope.searchMovie = function(movieTitle) {
        $scope.searchImdbMovie(movieTitle).success(function(response){
          $scope.searchMovies = response["Search"];
        });
    }

    $scope.addMovieForUser = function(person, movieTitle) {
      $scope.personSeenMovie = person;
      $scope.getImdbMovie(movieTitle).success(function(response) {
        $scope.saveMovieToDB(response).success(function(response) {
          $scope.movieSeenByPerson = response;
          $scope.addMovieToPerson();
          $scope.personSeenMovie.seenMovies.push($scope.movieSeenByPerson);
        });
      });
    }

    $scope.addMovieToPerson = function() {
      var id = $scope.personSeenMovie.personId;
      var movie = $scope.movieSeenByPerson.movieId;
      personService.update({id: id}, {movie});
    }

    $scope.saveMovieToDB = function(movie) {
      return $http({
        method: 'POST',
        url: 'http://localhost:8080/saveMovie',
        headers: {'Content-Type':'application/json'},
        data: movie
      })
    }

    $scope.findImdbMovie = function() {
      $scope.getImdbMovie($scope.input).success(function(response) {
        $scope.imdbMovie = response;
        $scope.seenMovie(response);
      });
    }

    $scope.clickPerson = function(name, $event) {
      $event.stopPropagation();
      var variable = name.firstName + name.personId;
      if ($scope[variable] === undefined) {
        $scope[variable] = true;
      } else {
        $scope[variable] = !$scope[variable];
      }
    }

    $scope.trustSrc = function(src) {
      return $sce.trustAsResourceUrl(src);
    }

    // $scope.getCreds = function(userName, password){
    //     return $http({
    //         method: 'GET',
    //         url:'http://localhost:8080/persons/auth/' + userName,
    //         headers: {'Authorization':'Basic '+ btoa(userName + ":" + password)}
    //     });
    // }
    //
    // $scope.logIn = function(userName, password) {
    //     $scope.getCreds(userName, password).success(function(response) {
    //         if(response["status"] === "authentified") {
    //             $scope.authenticated = true;
    //             $scope.person = personByUserName.get({userName: userName}, function(data) {
    //                 return data;
    //             });
    //         } else {
    //             $scope.authenticated = false;
    //         }
    //     });
    //     $scope.hasError = true;
    // }

    $scope.logout = function() {
        $jq("#login")[0].reset();
        $scope.hasError = false;
        $scope.authenticated = false;
    }
});
