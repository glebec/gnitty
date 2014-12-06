'use strict';

angular.module('gnittyApp')
  .controller('RecipsDonutCtrl', function ($scope, emails) {

    $scope.options = {
      chart: {
        type: 'pieChart',
        height: 600,
        donut: true,
        donutRatio: 0.3,
        x: function(d){return d.key;},
        y: function(d){return d.y;},
        showLabels: false,
        showLegend: true,
        pie: {
            startAngle: function(d) { return d.startAngle -Math.PI/2 },
            endAngle: function(d) { return d.endAngle -Math.PI/2 }
        },
        transitionDuration: 1000
      }
    };

    $scope.data = [];
    for (var i=0; i<16; i++) {
      $scope.data.push({
        key: emails.senderCount.recips[i].email,
        y: emails.senderCount.recips[i].val
      });
    }

  });
