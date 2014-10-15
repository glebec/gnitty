'use strict';

angular.module('gnittyApp')
  .controller('emailScatterChartCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth){

    $scope.currentUser = Auth.getCurrentUser();
    console.log($scope.currentUser);
    $http.get('/api/stats/foruser/'+ $scope.currentUser._id).
      success(function(data) {
        $scope.statistics = data;
        }).success(function(){

      $scope.xAxisTickFormatFunction = function(){
          return function(d){
            return d3.time.format('%x')(new Date(d));
          }
      }

      $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 450,
                color: d3.scale.category10().range(),
                scatter: {
                    onlyCircles: true
                },
                showDistX: true,
                showDistY: false,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                transitionDuration: 1000,
                x: function(d, i) {
                  return new Date(d.x)},
                xAxis: {
                    axisLabel: 'Time',
                    tickFormat: $scope.xAxisTickFormatFunction()
                },
                yAxis: {
                    axisLabel: '',
                    tickFormat: "",
                    axisLabelDistance: 30
                }
            }
          };


//replace 10,000 with $scope.totalEmails
        $scope.data = generateData(1,$scope.statistics[0].dateArray.length);

//needs 2 inputs here
// $scope.totalEmails = $scope.statistics[0].dateArray.length;
// $scope.emailDate = $scope.statistics[0].dateArray;

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < groups; i++) {
                data.push({
                    //insert date here
                    key: 'Email from ' + i,
                    values: []
                });

                for (var j = 0; j < points; j++) {
                    data[i].values.push({
                        x: $scope.statistics[0].dateArray[j]//email date here
                        , y: random() //can keep this as random
                        , size: 0.1
                        , shape: shapes[j % 6]
                    });
                }
            }
            return data;
        }
      });
}]);