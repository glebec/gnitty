'use strict';

angular.module('gnittyApp')
  .controller('D3chartsCtrl', ['$scope', function($scope){
    console.log("D3chartsCtrl working");
     $scope.options = {
                chart: {
                    type: 'scatterChart',
                    height: 450,
                    color: d3.scale.category10().range(),
                    scatter: {
                        onlyCircles: true
                    },
                    showDistX: false,
                    showDistY: false,
                    tooltipContent: function(key) {
                        return '<h3>' + key + '</h3>';
                    },
                    transitionDuration: 1000,
                    xAxis: {
                        axisLabel: 'X Axis',
                        tickFormat: function(d){
                            return d3.format('.02f')(d);
                        }
                    },
                    yAxis: {
                        axisLabel: 'Y Axis',
                        tickFormat: function(d){
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: 30
                    }
                }
            };

            $scope.data = generateData(4,40);

            /* Random Data Generator (took from nvd3.org) */
            function generateData(groups, points) {
                var data = [],
                    shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                    random = d3.random.normal();

                for (var i = 0; i < groups; i++) {
                    data.push({
                        key: shapes[i],
                        label: shapes[i],
                        values: []
                    });

                    for (var j = 0; j < points; j++) {
                        data[i].values.push({
                            x: random(),
                            y: random(),
                            size: Math.random(),
                            shape: shapes[j % 6]
                        });
                    }
                }
                return data;
            }

  }]);

