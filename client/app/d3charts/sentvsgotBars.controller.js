'use strict';

angular.module('gnittyApp')
  .controller('SentVsGotCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

  $scope.emails = {};
  $scope.emails.bars = [];
  $scope.emails.bars.earliest = new Date(emails.bars.earliest).toLocaleDateString();
  $scope.emails.bars.latest = new Date(emails.bars.latest).toLocaleDateString();
  $scope.barCapacity = emails.bars.barCapacity;

// determine the capacity of each bar for x-axis label
  var minutes = 1000 * 60;
  var hours = minutes * 60;
  var days = hours * 24;
  $scope.days = Math.floor($scope.barCapacity/days);
  $scope.hours = Math.floor(($scope.barCapacity/days - $scope.days)*24);
  $scope.barCapacityTime = function () {
    if ($scope.days < 1) {
      return $scope.hours + ' hours';
    }
    if ($scope.days > 1) {
      return $scope.days + ' days and ' + $scope.hours + ' hours';
    }
    if ($scope.days === 1) {
      return $scope.days + ' day and ' + $scope.hours + ' hours';
    }
  };

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
                tooltips: true,
                tooltipContent: function (key, x, y, e, graph) {
                                    console.log('e series values:', e.series.values);
                  return '<h3>' + y + ' ' + key + '</h3>' + '<p>' +  'from ' + e.series.values[e.pointIndex].barStartDate + ' to ' + e.series.values[e.pointIndex].barEndDate + '</p>';

                },
                stacked: true,
                showControls: false,
                xAxis: {
                    axisLabel: 'Time from ' + $scope.emails.bars.earliest + ' to ' + $scope.emails.bars.latest + '. ' + '\n' + 'Each bar represents ' + $scope.barCapacityTime(),
                    showMaxMin: false,
                    tickFormat: function() {return "";}
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
          $scope.a = [];
          $scope.b = [];
          for (var i=0; i<emails.bars.bars.length; i++) {
              $scope.a[i] = [];
              $scope.b[i] = [];
            for (var j=0; j<emails.bars.bars[i].length; j++) {
              if(emails.bars.bars[i][j].sentBool === true) {
                $scope.a[i].push(emails.bars.bars[i][j]);
                // console.log('a= ', a);
              }
              if (emails.bars.bars[i][j].sentBool === false) {
                $scope.b[i].push(emails.bars.bars[i][j]);
                // console.log('b= ', b);
              }
            }
          }

        };

        $scope.data = generateData();

        function generateData() {
          $scope.splitSent();
          var values = [];
          var values0 =[];
          for (var h=0; h<emails.bars.bars.length; h++) {
            var barStartDate = new Date(Number(emails.bars.earliest + $scope.barCapacity*h)).toLocaleDateString() +' at ' + new Date(Number(emails.bars.earliest + $scope.barCapacity*h)).toLocaleTimeString();
            var barEndDate = new Date(Number(emails.bars.earliest + $scope.barCapacity*(h+1))).toLocaleDateString() + ' at ' + new Date(Number(emails.bars.earliest + $scope.barCapacity*(h+1))).toLocaleTimeString();
            values.push({x: h, y: $scope.a[h].length, barStartDate: barStartDate, barEndDate: barEndDate});
            values0.push({x: h, y: $scope.b[h].length, barStartDate: barStartDate, barEndDate: barEndDate});
          };

        // console.log("values: ", values);
        // console.log("values[0]: ", values0);

        return [{
          key: 'emails sent',
          values: values
          },
          {
            key: 'emails received',
            values: values0
          }
        ];
        };
  }]);