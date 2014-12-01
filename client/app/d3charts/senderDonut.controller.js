'use strict';

angular.module('gnittyApp')
  .controller('SenderDonutCtrl', function ($scope) {
    $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 600,
                    donut: true,
                    x: function(d){return d.key;},
                    y: function(d){return d.y;},
                    showLabels: false,
                    pie: {
                        startAngle: function(d) { return d.startAngle -Math.PI/2 },
                        endAngle: function(d) { return d.endAngle -Math.PI/2 }
                    },
                    transitionDuration: 500,
                    legend: {
                        margin: {
                            top: 5,
                            right: 70,
                            bottom: 5,
                            left: 0
                        }
                    }
                }
            };

            $scope.data = [
                {
                    key: "One",
                    y: 5
                },
                {
                    key: "Two",
                    y: 2
                },
                {
                    key: "Three",
                    y: 9
                },
                {
                    key: "Four",
                    y: 7
                },
                {
                    key: "Five",
                    y: 4
                },
                {
                    key: "Six",
                    y: 3
                },
                {
                    key: "Seven",
                    y: .5
                }
            ];
  });
