'use strict';

angular.module('gnittyApp')
  .controller('sentPieChartCtrl', ['$scope', '$http', 'Auth', function($scope, $http, Auth, User){
//TODO: REPLACE Y VALUES WITH SENTIMENT VALUES
    $http.get('/api/stats/foruser/'+ $scope.currentUser._id).
      success(function(data) {
        $scope.statistics = data;
        }).success(function(){
          console.log($scope.statistics)
  $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                transitionDuration: 1000,
                labelThreshold: 0.01,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "Positive",
                y: 1 - $scope.statistics[0].sentiment.score
            },
            {
                key: "Negative",
                y: $scope.statistics[0].sentiment.score
            }
        ];
    });
}]);