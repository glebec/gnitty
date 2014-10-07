'use strict';

angular.module('gnittyApp.controllers')
  .controller('D3chartsCtrl', ['$scope', function($scope){
    console.log("D3chartsCtrl working")
    $scope.d3Data = [
      {name: "Greg", score:98},
      {name: "Ari", score:96},
      {name: "Loser", score: 48}
    ];
    $scope.d3Label = "name";
  }]);
