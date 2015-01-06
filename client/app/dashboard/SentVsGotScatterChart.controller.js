'use strict';

angular.module('gnittyApp')
  .controller('emailScatterChartCtrl', ['$scope', 'emails', function($scope, emails){
    //get data from 'emails' service
    $scope.dataArr = emails.dateLengthSentBoolArr;
    $scope.emailNumber = $scope.dataArr.length;

    //set x axis tick format to dates
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
          console.log(e.series.values[e.pointIndex].subject);
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

    //create separate sent and received arrays
    $scope.splitSent = function() {
      var a = [];
      var b = [];
      $scope.dataArr.forEach(function(item) {
        if (item.sent == true) {
          a.push(item);
        } else {
          b.push(item);
        }
      });
      return {a: a, b: b};
    };

    var generateData = function () {
      var sentMail = $scope.splitSent();
      $scope.sent = sentMail.a;
      $scope.received = sentMail.b;
      var data = [];

      data.push({
        key: 'received emails',
        values: []
      });
      data.push({
        key: 'sent emails',
        values: []
      });

      $scope.received.forEach(function(msg) {
        data[0].values.push({
          x: msg.date,
          y: msg.date.getHours()+((10/6)*msg.date.getMinutes()*Math.pow(10,-2)),
          size: msg.tlength,
          subject: msg.subject
        });
      });

      $scope.sent.forEach(function(msg) {
        data[1].values.push({
          x: msg.date,
          y: msg.date.getHours()+((10/6)*msg.date.getMinutes()*Math.pow(10,-2)),
          size: msg.tlength,
          subject: msg.subject
        });
      });

      return data;
    };

    $scope.data = generateData();

  }]);
