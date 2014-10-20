'use strict';

angular.module('gnittyApp')
  .controller('KeywordChartCtrl', ['$scope', 'stats', function($scope, stats){
      console.log('stats.data :', stats.data);
      console.log('number of keywords: ', stats.data.keywords.length);
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
                    forceSize: 0
                    // xAxis: {
                    //     axisLabel: '',
                    //     tickFormat: ""
                    // },
                    // yAxis: {
                    //     axisLabel: '',
                    //     tickFormat: "",
                    //     axisLabelDistance: 30
                    // }
                }
            };

            $scope.data = generateData(1, stats.data.keywords.length);

            /* Random Data Generator (took from nvd3.org) */
            function generateData (groups, points) {
                var data = [],
                    shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                    random = d3.random.normal();

                for (var i = 0; i < points; i++) {
                    data.push({
                        key: stats.data.keywords[i].text,
                        label: stats.data.keywords[i].text,
                        values: []
                    });
                        data[i].values.push({
                            x: i+.2,
                            y: random(),
                            size: stats.data.keywords[i].relevance*5,
                            shape: shapes[i % 6]
                        });
                // console.log(stats.data.keywords[i].relevance);
                }
                return data;
            };

  }]);