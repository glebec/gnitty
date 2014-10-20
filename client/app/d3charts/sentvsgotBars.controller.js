'use strict';

angular.module('gnittyApp')
  .controller('SentVsGotCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

  // // console.log(emails.splitDates());
  // $scope.options = {
  //           chart: {
  //               type: 'multiBarChart',
  //               height: 450,
  //               margin : {
  //                   top: 20,
  //                   right: 20,
  //                   bottom: 60,
  //                   left: 45
  //               },
  //               clipEdge: true,
  //               staggerLabels: true,
  //               transitionDuration: 500,
  //               stacked: true,
  //               xAxis: {
  //                   axisLabel: 'Time',
  //                   showMaxMin: false,
  //                   tickFormat: function(d){
  //                       return d3.format(',f')(d);
  //                   }
  //               },
  //               yAxis: {
  //                   axisLabel: 'Y Axis',
  //                   axisLabelDistance: 40,
  //                   tickFormat: function(d){
  //                       return d3.format(',f')(d);
  //                   }
  //               }
  //           }
  //       };

  //       $scope.data = generateData();

  //       function generateData() {
  //        var our_layers = [{
  //             key: 'emails',
  //             values: [{
  //               x: 0,
  //               y:8.5
  //             }]
  //           },
  //           {
  //             key: 'sent',
  //             values: [{
  //               x:0,
  //               y:15
  //             }
  //             ]
  //           }];
  //           return our_layers;
  //       };
  }]);