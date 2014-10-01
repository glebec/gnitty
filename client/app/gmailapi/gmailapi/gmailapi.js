'use strict';

angular.module('gnittyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/gmailapi', {
        templateUrl: 'app/gmailapi/gmailapi/gmailapi.html',
        controller: 'GmailapiCtrl'
      });
  });
