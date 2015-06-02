angular.module('watcher.controllers', []).
controller('personsController', function($scope, $http, watchRestService, deleteMovieForUserService, addMovieSeenForUserService, $sce) {
    $scope.nameFilter = null;
    var $jq = jQuery.noConflict();

    watchRestService.query(function(data) {
      $scope.persons = data;
    });

    $scope.deleteMovieForUser = function(person, movie) {
      deleteMovieForUserService.delete({personId: person.personId, movieId: movie.movieId}, function(data) {
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
      addMovieSeenForUserService.get({personId: $scope.personSeenMovie.personId, movieId: $scope.movieSeenByPerson.movieId}, function(data) {
        return data;
      });
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
});
