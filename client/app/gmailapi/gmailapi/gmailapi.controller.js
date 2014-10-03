'use strict';

angular.module('gnittyApp')
  .controller('GmailapiCtrl', function ($scope, Auth, $http) {

//gb 10/1 need to test this, pull userId from it
    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log($scope.getCurrentUser());

//get a user's messages
    $http.get('https://www.googleapis.com/gmail/v1/users/' + $scope.getCurrentUser().google.id + '/messages').success(
      function (msgs){
        $scope.msgs = msgs;
        console.log($scope.msgs);
     });

  });
