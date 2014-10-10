'use strict';

angular.module('gnittyApp')
  .controller('D3chartsCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth, User){
    console.log("D3chartsCtrl working");

    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);

    $http.get('/api/stats/foruser/'+ $scope.currentUser._id).
      success(function(data) {
        $scope.statistics = data;
        console.log($scope.statistics);
        }).success(function(){
      console.log($scope.statistics[4].keywords.length)
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
            }

            $scope.data = generateData(1, $scope.statistics[4].keywords.length);

            /* Random Data Generator (took from nvd3.org) */
            function generateData (groups, points) {
                var data = [],
                    shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                    random = d3.random.normal();

                for (var i = 0; i < points; i++) {
                    data.push({
                        key: $scope.statistics[4].keywords[i].text,
                        label: 'keyword',
                        values: []
                    });
                        data[i].values.push({
                            x: random(),
                            y: random(),
                            size: $scope.statistics[4].keywords[i].relevance,
                            shape: shapes[i % 6]
                        });
                }
                return data;
            };
          });
  }]);

