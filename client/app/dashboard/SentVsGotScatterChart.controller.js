'use strict';

angular.module('gnittyApp')
  .controller('emailScatterChartCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

      $scope.emailNumber = emails.dateLengthSentBoolArr.length;
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
                tooltipContent: function(key, x, y, e, graph) {
                  return '<h3>' + e.series.values[e.pointIndex].subject + '</h3>';
                },
                interactive: true,
                showLegend: true,
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
          for (var i=0; i<80; i++) {
            for (var j=0; j<emails.bars.bars[i].length; j++) {
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
              key: 'received emails',
              values: []
          });
          data.push({
              key: 'sent emails',
              values: []
            });

          for (var r = 0; r < $scope.received.length; r++) {
              // $scope.received[r].date = new Date($scope.received[r].date);
              data[0].values.push({
                x: $scope.received[r].date,
                y: $scope.received[r].date.getHours()+((10/6)*$scope.received[r].date.getMinutes()*Math.pow(10,-2)),
                size: $scope.received[r].emailLength,
                subject: $scope.received[r].subject,
                shape: shapes[r % 6]
              });
            }
          for (var j = 0; j < $scope.sent.length; j++) {
              // $scope.sent[j].date = new Date($scope.sent[j].date);

              data[1].values.push({
                  x: $scope.sent[j].date,//email date here
                  y: $scope.sent[j].date.getHours()+((10/6)*$scope.sent[j].date.getMinutes()*Math.pow(10,-2)),
                  size: $scope.sent[j].emailLength,
                  subject: $scope.sent[j].subject,
                  shape: shapes[j % 6]
              });
            }
          return data;
        }
  }]);
