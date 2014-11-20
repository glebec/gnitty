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
                scatter: {
                    onlyCircles: true
                },
                showDistX: true,
                showDistY: true,
                tooltips: true,
                interactive: true,
                showLegend: true,
                tooltipContent: function(key) {
                    return '<h3>' + key + '</h3>';
                },
                transitionDuration: 1000,
                // x: function(d, i) {
                //   return new Date(d.x);
                // },
                xAxis: {
                    axisLabel: 'Dates',
                    tickFormat: $scope.xAxisTickFormatFunction()
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
          var data = [];

          data.push({
              key: 'Sent',
              values: [],
              color: '#bcbd22'
            });
          data.push({
              key: 'Received',
              values: [],
              color: '#1f77b4'
          });

          for (var j = 0; j < $scope.sent.length; j++) {
              // console.log($scope.sent[j].date);
              // console.log(typeof $scope.sent[j].date);
              // $scope.sent[j].date = new Date($scope.sent[j].date);
              // console.log($scope.sent[j].date.toString());
              // console.log("date prototype=", $scope.sent[j].date.prototype.toString());
              data[0].values.push({
                  x: Number($scope.sent[j].date),
                  // .getMonth()+1)+($scope.sent[j].date.getDate()*Math.pow(10,-2)),//email date here
                  y: $scope.sent[j].date.getHours()+((10/6)*$scope.sent[j].date.getMinutes()*Math.pow(10,-2)),
                  size: $scope.sent[j].emailLength
              });
            }
          for (var r = 0; r < $scope.received.length; r++) {
              // $scope.received[r].date = new Date($scope.received[r].date);
              data[1].values.push({
                x: Number($scope.received[r].date),
                  // .getMonth()+1)+($scope.received[r].date.getDate()*Math.pow(10,-2)),
                y: $scope.received[r].date.getHours()+((10/6)*$scope.received[r].date.getMinutes()*Math.pow(10,-2)),
                size: $scope.received[r].emailLength
              });
            }
          console.log(data);
          return data;
        }
  }]);

// data[{key: 'Email from _date_'; values: [{x:_date, y:_time, size:0.1, shape:whatever}]}]
