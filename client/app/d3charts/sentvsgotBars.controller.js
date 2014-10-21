'use strict';

angular.module('gnittyApp')
  .controller('SentVsGotCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

      $scope.xAxisTickFormatFunction = function(){
          return function(d){
            return d3.time.format('%x')(new Date(d));
          }
      }

  $scope.options = {
            chart: {
                type: 'multiBarChart',
                height: 450,
                margin : {
                    top: 20,
                    right: 20,
                    bottom: 60,
                    left: 45
                },
                clipEdge: true,
                staggerLabels: true,
                transitionDuration: 500,
                stacked: true,
                xAxis: {
                    axisLabel: 'Time',
                    showMaxMin: false,
                    tickFormat: $scope.xAxisTickFormatFunction()
                },
                yAxis: {
                    axisLabel: 'Emails from',
                    axisLabelDistance: 40,
                    tickFormat: function(d){
                        return d3.format(',f')(d);
                    }
                }
            }
        };

        $scope.data = generateData();

        function generateData() {
          var values = [];
         for (var i=0; i<stats.data.bars.length; i++) {
          values.push({x: i, y: stats.data.bars[i]});
         // var our_layers = [{
         //      key: 'emails',
         //      values: [{
         //        x: i,
         //        y: stats.data.bars[i]
         //      },
         //      ]
         //    }];
          }
            return [{
              key: 'emails',
              values: values
            }];
        };
  }]);