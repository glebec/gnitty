'use strict';

angular.module('gnittyApp')
  .controller('SentVsGotCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

    $scope.emailNumber = emails.dateLengthSentBoolArr.length;
    $scope.bars = emails.bars.bars;
    $scope.emails = {};
    $scope.emails.bars = [];
    $scope.earliest = new Date(emails.bars.earliest).toLocaleDateString();
    $scope.latest = new Date(emails.bars.latest).toLocaleDateString();
    $scope.barCapacity = emails.bars.barCapacity;

  // convert the capacity of each bar into days/hours/minutes
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;

    $scope.days = Math.floor($scope.barCapacity/days);
    $scope.hours = Math.floor(($scope.barCapacity/days - $scope.days)*24);
    $scope.minutes = Math.floor((($scope.barCapacity/days - $scope.days)*24 - $scope.hours)*60);
    $scope.barCapacityTime = function () {
      if ($scope.days < 1) {
        return $scope.hours + ' hours, ' + $scope.minutes + ' minutes';
      }
      if ($scope.days > 1) {
        return $scope.days + ' days, ' + $scope.hours + ' hours ' + $scope.minutes + ' minutes';
      }
      if ($scope.days === 1) {
        return $scope.days + ' day, ' + $scope.hours + ' hours ' + $scope.minutes + ' minutes';
      }
    };

    $scope.options = {
      chart: {
        type: 'multiBarChart',
        height: 600,
        clipEdge: true,
        staggerLabels: true,
        transitionDuration: 1000,
        tooltips: true,
        tooltipContent: function (key, x, y, e, graph) {
          return '<h3>' + y + ' ' + key + '</h3>' + '<p>' +  'spanning ' + e.series.values[e.pointIndex].barStartDate + ' to ' + e.series.values[e.pointIndex].barEndDate + '</p>';
        },
        stacked: true,
        showControls: false,
        xAxis: {
          axisLabel: 'Each bar represents ' + $scope.barCapacityTime(),
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

      //put sent emails into 'a' array and received emails into 'b' array
        $scope.splitSent = function() {
          $scope.a = [];
          $scope.b = [];
          for (var i=0; i<$scope.bars.length; i++) {
              $scope.a[i] = [];
              $scope.b[i] = [];
            for (var j=0; j<$scope.bars[i].length; j++) {
              if($scope.bars[i][j].sentBool === true) {
                $scope.a[i].push($scope.bars[i][j]);
                // console.log('a= ', a);
              }
              if ($scope.bars[i][j].sentBool === false) {
                $scope.b[i].push($scope.bars[i][j]);
                // console.log('b= ', b);
              }
            }
          }
        };

        $scope.data = generateData();

        //push 'a' (received data) into values, push 'b' (sent data) into values0
        function generateData() {
          $scope.splitSent();
          var values = [];
          var values0 =[];
          var dict = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          for (var h=0; h<$scope.bars.length; h++) {
            var barStartDate = dict[new Date(Number(emails.bars.earliest + $scope.barCapacity*h)).getDay()] + ", " + new Date(Number(emails.bars.earliest + $scope.barCapacity*h)).toLocaleDateString();
            var barEndDate = dict[new Date(Number(emails.bars.earliest + $scope.barCapacity*(h+1))).getDay()] + ", " + new Date(Number(emails.bars.earliest + $scope.barCapacity*(h+1))).toLocaleDateString();
            values.push({x: h, y: $scope.a[h].length, barStartDate: barStartDate, barEndDate: barEndDate});
            values0.push({x: h, y: $scope.b[h].length, barStartDate: barStartDate, barEndDate: barEndDate});
          };

        return [{
          key: 'sent',
          values: values
          },
          {
            key: 'received',
            values: values0
          }
        ];}
  }]);