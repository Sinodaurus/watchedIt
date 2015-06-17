angular.module('watcher.services', ['ngResource']).
factory('personService', function($resource) {
  var data = $resource('http://localhost:8080/persons/person/:id',{id: '@id'}, {
    update:{
      method:'PUT'
    }
  });
  return data;
})
.factory('personByUserName', function($resource) {
  return $resource('http://localhost:8080/persons/getUser/:userName');
})
.factory('authenticateUser', function($resource) {
  return $resource('http://localhost:8080/persons/auth/:username');
});




// factory('deleteMovieForUser', function($resource) {
//   return $resource('http://localhost:8080/persons/person/:personId/deleteMovie/:movieId');
// }).
// factory('addMovieSeenForUser', function($resource) {
//   return $resource('http://localhost:8080/persons/person/:personId/watchedMovie/:movieId');
// })
