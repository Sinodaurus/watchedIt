var watchService = {};

// watchService.getPersons = function() {
//   return $http({
//     method: 'GET',
//     url: 'http://watchservice.jelastic.luxembourgwebservices.com/watchlist/allPersons'
//   });
// }



// watchService.getPersons = function() {
//   return $resource.get('http://watchservice.jelastic.luxembourgwebservices.com/watchlist/allPersons');
// }

// watchService.getImdbMovie = function(movie) {
//   return $http({
//     method: 'GET',
//     url: 'http://www.omdbapi.com/?t='+movie
//   });
// }

// watchService.seenMovie = function(movie) {
//   return $http({
//     method: 'POST',
//     url: 'http://watchservice.jelastic.luxembourgwebservices.com/watchlist/watchedMovie',
//     headers: {'Content-Type':'application/json'},
//     data: {"movie":movie,
//            "person":{"firstName":"Alix",
//       "lastName":"Goossens"}}
//   })
// }

// watchService.seenMovie = function(user, movie) {
//   return $http.post('http://watchservice.jelastic.luxembourgwebservices.com/watchlist/watchedMovie', movie + user);
// }

// return watchService;
