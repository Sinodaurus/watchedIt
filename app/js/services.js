angular.module('watcher.services', ['ngResource']).
factory('personById', function($resource) {
  return $resource('http://localhost:8080/persons/person/:id');
}).
factory('personByUserName', function($resource) {
  return $resource('http://localhost:8080/persons/user/:userName');
}).
factory('deleteMovieForUser', function($resource) {
  return $resource('http://localhost:8080/persons/person/:personId/deleteMovie/:movieId');
}).
factory('addMovieSeenForUser', function($resource) {
  return $resource('http://localhost:8080/persons/person/:personId/watchedMovie/:movieId');
})
.factory('authenticateUser', function($resource) {
  return $resource('http://localhost:8080/auth/:username');
});
