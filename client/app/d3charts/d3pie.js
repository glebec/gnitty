'use strict';

// angular.module('gnittyApp.directives')
//   .directive('d3Pie', ['d3', 'angularCharts', function(d3) {

angular.module('gnittyApp.charts', ['d3', 'angularCharts']);

    function d3piectrl($scope) {
      $scope.config = {
        title: 'Products',
        tooltips: true,
        labels: false,
        mouseover: function() {},
        mouseout: function() {},
        click: function() {},
        legend: {
          display: true,
          //could be 'left, right'
          position: 'right'
        }
      };

      $scope.data = {
        series: ['Sales', 'Income', 'Expense', 'Laptops', 'Keyboards'],
        data: [{
          x: "Laptops",
          y: [100, 500, 0],
          tooltip: "this is a tooltip"
        }, {
          x: "Desktops",
          y: [300, 100, 100]
        }, {
          x: "Mobiles",
          y: [351]
        }, {
          x: "Tablets",
          y: [54, 0, 879]
        }]
      };
    }