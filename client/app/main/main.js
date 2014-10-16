'use strict';

angular.module('gnittyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/loading', {
        templateUrl: 'app/main/loading.html',
        controller: 'MainCtrl'
      })
      .when('/dashboard', {
        templateUrl: 'app/main/dashboard.html',
        controller: 'MainCtrl'
      })
      .otherwise({ redirectTo: '/' });
  });
