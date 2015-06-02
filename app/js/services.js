angular.module('watcher.services', ['ngResource']).
factory('watchRestService', function($resource) {
  return $resource('http://localhost:8080/person/:id');
}).
    factory('getUserByUserName', function($resource) {
      return $resource('http://localhost:8080/get/:userName');
    }).
factory('deleteMovieForUserService', function($resource) {
  return $resource('http://localhost:8080/person/:personId/deleteMovie/:movieId');
}).
factory('addMovieSeenForUserService', function($resource) {
  return $resource('http://localhost:8080/person/:personId/watchedMovie/:movieId');
}).factory('authenticateUser', function($resource) {
  return $resource('http://localhost:8080/auth/:username');
});
