'use strict';

// Declare app level module which depends on views, and components
angular.module('watcher', [
  'watcher.controllers',
  'watcher.services'
]).config(['$compileProvider', function($compileProvider) {
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(http|https?|ftp|file|blob|content):|data:image\//);
}]);
