'use strict';

angular.module('gnittyApp')
  .controller('GmailapiCtrl', function ($scope, Auth) {
    $scope.message = 'Hello';

//gb 10/1 need to test this, pull userId from it
    $http.get('/me', function(data) {
      $scope.user = data;
      console.log($scope.user);
    });

//get a user's messages
    $http.get('https://www.googleapis.com/gmail/v1/users/' + $scope.userId + '/messages')

  });
