angular.module('watcher.services', ['ngResource']).
factory('watchRestService', function($resource) {
  return $resource('http://localhost:8080/person/:id');
}).
factory('deleteMovieForUserService', function($resource) {
  return $resource('http://localhost:8080/person/:personId/deleteMovie/:movieId');
}).
factory('addMovieSeenForUserService', function($resource) {
  return $resource('http://localhost:8080/person/:personId/watchedMovie/:movieId');
});
