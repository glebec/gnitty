'use strict';

angular.module('gnittyApp')
  .controller('KeywordChartCtrl', function($scope, $log, stats) {
    console.log('stats data in keyword ctrl:', stats.data)
    $scope.options = {
      chart: {
        type: 'scatterChart',
        height: 600,
        color: d3.scale.category10().range(),
        scatter: {
            onlyCircles: true
        },
        showDistX: false,
        showDistY: false,
        interactive: true,
        tooltips: true,
        tooltipContent: function(key) {
          return '<h3>' + key + '</h3>';
        },
        transitionDuration: 1000,
        forceSize: 0,
        xAxis: {
          axisLabel: 'Keywords by First Letter (A to Z)',
          tickFormat: function (d){
            return d3.format('f')(d);
          },
          axisLabelDistance: 30
        },
        forceX: [0, 26],
        // xDomain: ["A", "B", "C"],
        // xRange: [0, 1, 2],
        yAxis: {
          axisLabel: 'Keyword Relevance (max 100%)',
          tickFormat: function (d){
            return d3.format('%')(d);
          },
          axisLabelDistance: 30
        },
        forceY: [0, 1]
      }
    };

  $scope.data = generateData(1, 40);

      /* Random Data Generator (took from nvd3.org) */
    function generateData (groups, points) {
        var data = [],
            shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
            random = d3.random.normal();

        for (var i = 0; i < stats.data.keywords.length; i++) {
          if (stats.data.keywords[i].length !== 0) {
            for (var j = 0; j < stats.data.keywords[i].length; j++) {
              var alphaStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
              var firstLetter = stats.data.keywords[i][j].text[0].toUpperCase();
              var xNum = alphaStr.indexOf(firstLetter);
              data.push({
                key: stats.data.keywords[i][j].text,
                values: [
                  {
                  x: 1 + xNum,
                  y: stats.data.keywords[i][j].relevance,
                  size: .05,
                  shape: shapes[i % 6]
                  }
                ]
              });
            }
          }
        }
        return data;
    }

  });
