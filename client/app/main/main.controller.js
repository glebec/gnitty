'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, gAPI, emails, postAlchemy, stats, $location, $interval) {

    // initialize google api in case already signed in, etc.
    // gAPI.handleClientLoad();
    $scope.indicator = 0;

    $interval(function() {
      $scope.indicator++;
      if ($scope.indicator > 3) {
        $scope.indicator = 1;
      }
    }, 6000);

    $scope.link = 'http://www.ginnabaker.com';
    $scope.clientObj = {};
    $scope.clientObj.phoneNum;
    $scope.mediaUrl = 'http://i495.photobucket.com/albums/rr313/trtla/ist2_1050220-red-crayon-heart.jpg';

    $scope.sendMMS = function() {
      $http.post('/api/twilio', {
        body: 'From Ginna -- Just found out I wrote more words than Hemingway this year.  Want to try?: '+$scope.link,
        to: '+1'+$scope.clientObj.phoneNum, //9179524491
        mediaUrl: $scope.mediaUrl
      });
    };

  });
