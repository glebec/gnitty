'use strict';

angular.module('gnittyApp')
  .controller('SentVsGotCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){
  $scope.emails = {};
  $scope.emails.bars = [];
  $scope.emails.bars.earliest = new Date(emails.bars.earliest);
  console.log($scope.emails.bars.earliest);
  $scope.emails.bars.latest = new Date(emails.bars.latest);
  console.log($scope.emails.bars.latest);

  $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 600,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 45
                },
                clipEdge: true,
                staggerLabels: true,
                transitionDuration: 1000,
                tooltips: false,
                stacked: true,
                xAxis: {
                    axisLabel: 'Time',
                    // showMaxMin: true,
                    // tickFormat: function(d){
                    //     return d3.format(',f')(d);
                    // }
                },
                yAxis: {
                    axisLabel: 'Number of emails',
                    axisLabelDistance: 40,
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                }
            }
        };



        $scope.splitSent = function() {
          var a = [];
          var b = [];
          $scope.aLength = [];
          $scope.bLength = [];
          for (var d=0; d<emails.bars.bars.length; d++) {
              a[d]=[];
              b[d]=[];
          }
          debugger;
          for (var i=0; i<emails.bars.bars.length; i++) {
            for (var j=0; j<emails.bars.bars[i].length; j++) {
              // console.log(emails.bars.bars[i][j]);
              if(emails.bars.bars[i][j].sentBool === true) {
                a[i].push(emails.bars.bars[i][j]);
                // console.log('a= ', a);
              }
              if (emails.bars.bars[i][j].sentBool === false) {
                b[i].push(emails.bars.bars[i][j]);
                // console.log('b= ', b);
              }
            }
          }

          for (var k=0; k<emails.bars.bars.length; k++) {
            $scope.aLength.push(a[k].length);
            $scope.bLength.push(b[k].length);
          }
        };

        $scope.data = generateData();

        function generateData() {
          $scope.splitSent();
          var values = [];
          var values0 =[];
          for (var h=0; h<emails.bars.bars.length; h++) {
            // debugger;
            var aLength = $scope.aLength[h];
            var bLength = $scope.bLength[h];
            values.push({x: h, y: aLength});
            values0.push({x: h, y: bLength});
          };

        // console.log("values: ", values);
        // console.log("values[0]: ", values0)

        return [{
          key: 'sent emails',
          values: values
          },
          {
            key: 'received emails',
            values: values0
          }
        ];
        };
  }]);