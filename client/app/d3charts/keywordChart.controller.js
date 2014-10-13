'use strict';

angular.module('gnittyApp')
  .controller('KeywordChartCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth, User){

    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);
//raw email scatter chart
    $http.get('/api/stats/foruser/'+ $scope.currentUser._id).
      success(function(data) {
        $scope.statistics = data;
        }).success(function(){
      console.log($scope.statistics[0].keywords.length)
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
                        axisLabel: '',
                        tickFormat: function(d){
                            return d3.format('.02f')(d);
                        }
                    },
                    yAxis: {
                        axisLabel: '',
                        tickFormat: function(d){
                            return d3.format('.02f')(d);
                        },
                        axisLabelDistance: 30
                    }
                }
            }

            $scope.data = generateData(1, $scope.statistics[0].keywords.length);

            /* Random Data Generator (took from nvd3.org) */
            function generateData (groups, points) {
                var data = [],
                    shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                    random = d3.random.normal();

                for (var i = 0; i < points; i++) {
                    data.push({
                        key: $scope.statistics[0].keywords[i].text,
                        label: 'keyword',
                        values: []
                    });
                        data[i].values.push({
                            x: i+.2,
                            y: i+.2,
                            size: $scope.statistics[0].keywords[i].relevance,
                            shape: shapes[i % 6]
                        });
                }
                return data;
            };
          });
  }]);