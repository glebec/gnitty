'use strict';

angular.module('gnittyApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/d3charts', {
        templateUrl: 'app/d3charts/d3charts.html',
        controller: 'KeywordChartCtrl'
      });
  });
