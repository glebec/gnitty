'use strict';

angular.module('gnittyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/dashboard', {
        templateUrl: 'app/dashboard/dashboard.html',
        controller: 'KeywordChartCtrl'
      });
  });
