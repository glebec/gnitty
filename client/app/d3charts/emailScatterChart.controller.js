'use strict';

angular.module('gnittyApp')
  .controller('emailScatterChartCtrl', ['$scope', 'stats', function($scope, stats){

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
                showDistY: true,
                tooltip: true,
                showLegend: false,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                transitionDuration: 1000,
                x: function(d, i) {
                  return new Date(d.x)},
                // fisheye: 1,
                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: $scope.xAxisTickFormatFunction(),

                },
                yAxis: {
                    axisLabel: 'Times',
                    tickFormat: function (d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                },
                forceSize: 0
            }
          };


//replace 10,000 with totalEmails
        $scope.data = generateData(1, stats.data.dateLengthArray.length);

//needs 2 inputs here
// $scope.totalEmails = $scope.statistics[0].dateArray.length;
// $scope.emailDate = $scope.statistics[0].dateArray;

        /* Random Data Generator (took from nvd3.org) */
        function generateData(groups, points) {
            var data = [],
                shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
                random = d3.random.normal();

            for (var i = 0; i < points; i++) {
                data.push({
                    //insert date here
                    key: 'Email from ' + stats.data.dateLengthArray[i].date,
                    values: []
                });
            }
            for (var j = 0; j < points; j++) {
              stats.data.dateLengthArray[j].date = new Date(stats.data.dateLengthArray[j].date);
              // console.log('date = ', Number(stats.data.dateLengthArray[j].date));
              // console.log('hour = ', Number(stats.data.dateLengthArray[j].date)%(24*60*60)/(60*60));
              //   // %(24*60*60*1000));
              // console.log('minute = '+String(stats.data.dateLengthArray[j].date).slice(20, 22));
                data[j].values.push({
                    x: stats.data.dateLengthArray[j].date//email date here
                    , y: Number(String(stats.data.dateLengthArray[j].date).slice(16, 18)+"."+String(stats.data.dateLengthArray[j].date).slice(19, 21))
                    , size: stats.data.dateLengthArray[j].tlength
                    , shape: shapes[j % 6]
                });
            };
            return data;
        }
}]);

// data[{key: 'Email from _date_'; values: [{x:_date, y:_time, size:0.1, shape:whatever}]}]
