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
                tooltips: true,
                interactive: true,
                showLegend: true,
                // tooltipContent: function(key) {
                //     return '<h3>' + key + '</h3>';
                // },
                transitionDuration: 1000,
                x: function(d, i) {
                  return new Date(d.x);
                },
                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: $scope.xAxisTickFormatFunction(),
                },
                yAxis: {
                    axisLabel: 'Hours (24-hour time)',
                    tickFormat: function (d){
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 30
                }
            }
          };

        $scope.splitSent = function() {
          var a = [];
          var b = [];
          var words = 0;
          for (var i=0; i<80; i++) {
            for (var j=0; j<emails.bars.bars[i].length; j++) {
              // console.log(emails.bars.bars[i][j]);
              if(emails.bars.bars[i][j].sentBool === true) {
                a.push(emails.bars.bars[i][j]);
              }
              else {
                b.push(emails.bars.bars[i][j]);
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
          $scope.received = sentMail.b;
          var data = [],
              shapes = ['circle', 'cross', 'triangle-up', 'triangle-down', 'diamond', 'square'],
              random = d3.random.normal();

          data.push({
              key: 'Received',
              values: []
          });
          data.push({
              key: 'Sent',
              values: []
            });

          for (var r = 0; r < $scope.received.length; r++) {
              $scope.received[r].date = new Date($scope.received[r].date);
              data[0].values.push({
                x: $scope.received[r].date,
                y: $scope.received[r].date.getHours()+((10/6)*$scope.received[r].date.getMinutes()*Math.pow(10,-2)),
                size: $scope.received[r].emailLength,
                shape: shapes[r % 6]
              });
            }
          for (var j = 0; j < $scope.sent.length; j++) {
              $scope.sent[j].date = new Date($scope.sent[j].date);

              data[1].values.push({
                  x: $scope.sent[j].date,//email date here
                  y: $scope.sent[j].date.getHours()+((10/6)*$scope.sent[j].date.getMinutes()*Math.pow(10,-2)),
                  size: $scope.sent[j].emailLength,
                  shape: shapes[j % 6]
              });
            }
          return data;
        }
  }]);

// data[{key: 'Email from _date_'; values: [{x:_date, y:_time, size:0.1, shape:whatever}]}]
