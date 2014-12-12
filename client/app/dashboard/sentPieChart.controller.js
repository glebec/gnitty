'use strict';

angular.module('gnittyApp')
  .controller('sentPieChartCtrl', ['$scope', 'stats', function($scope, stats){

  if (stats.data.sentiment.type === "neutral" && !stats.data.sentiment.score) {
    $scope.sentiment = 0;
  } else {
    $scope.sentiment = stats.data.sentiment.score;
  }

  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 600,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLegend: false,
                showLabels: true,
                transitionDuration: 1000,
                labelThreshold: 0.01,
                tooltips: true,
                tooltipContent: function(key, y) {
                  return '<h3>' + y*100 + '%' +'</h3>';
                },
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "Positive",
                y: (1 + Number($scope.sentiment))/2
            },
            {
                key: "Negative",
                y: (2 - (1 + Number($scope.sentiment)))/2
            }
        ];
}]);