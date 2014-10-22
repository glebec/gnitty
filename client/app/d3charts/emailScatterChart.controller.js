'use strict';

angular.module('gnittyApp')
  .controller('emailScatterChartCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

      $scope.xAxisTickFormatFunction = function(){
          return function(d){
            return d3.time.format('%x')(new Date(d));
          };
       };

      $scope.options = {
            chart: {
                type: 'scatterChart',
                height: 600,
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
                  return new Date(d.x);},
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

        $scope.splitSent = function() {
          var a = [];
          var b = [];
          for (var i=0; i<80; i++) {
            for (var j=0; j<emails.bars.bars[i].length; j++) {
              // console.log(emails.bars.bars[i][j]);
              if(emails.bars.bars[i][j].sentBool === true) {
                a.push(emails.bars.bars[i][j].date);
                // console.log('a= ', a);
              }
              if (emails.bars.bars[i][j].sentBool === false) {
                b.push(emails.bars.bars[i][j].date);
                // console.log('b= ', b);
              }
            }
          }
          return {a: a, b: b};
        };
//replace 10,000 with totalEmails
        $scope.data = generateData(2, stats.data.dateLengthSentBoolArray.length);

        function generateData(groups, points) {
          $scope.splitSent();
          var sentMail = $scope.splitSent();
          $scope.sent = sentMail.a;
          // console.log('$scope.sent array: ', $scope.sent);
          $scope.received = sentMail.b;
          var data = [],
              shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
              random = d3.random.normal();
          data[0]=[];
          data[1]=[];
          data[0].push({
              key: 'Sent',
              values: []
          });
          data[1].push({
              key: 'Received',
              values: []
            });

            for (var j = 0; j < points; j++) {
              $scope.sent[j] = new Date($scope.sent[j]);
              $scope.received[j] = new Date($scope.received[j]);
              data[0].values.push({
                  x: $scope.sent[j],//email date here
                  y: Number(String($scope.sent[j]).slice(16, 18)+"."+String($scope.sent[j]).slice(19, 21)),
                  size: stats.data.dateLengthSentBoolArray[j].tlength,
                  shape: shapes[j % 6]
              });

              data[1].values.push({
                x: $scope.received[j],
                y: Number(String($scope.received[j]).slice(16, 18)+"."+String($scope.received[j]).slice(19, 21)),
                size: stats.data.dateLengthSentBoolArray[r].tlength,
                shape: shapes[r % 6]
              });
            };
          console.log('dataLater:', data);
          return data;
        }
}]);

// data[{key: 'Email from _date_'; values: [{x:_date, y:_time, size:0.1, shape:whatever}]}]
