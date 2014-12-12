'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, gAPI, emails, postAlchemy, stats, $location, $timeout) {

    // initialize google api in case already signed in, etc.
    // gAPI.handleClientLoad();
    $scope.indicator = 1;

    $timeout(function() {
      $scope.indicator++;
    }, 6000);

    // DEV TESTING ONLY, REMOVE BEFORE DEPLOYMENT
    $scope.setLocal = function () {
      emails.setLocal();
      stats.setLocal();
    };
    $scope.getLocal = function () {
      emails.getLocal();
      stats.getLocal();
    };

    // show stored data
    $scope.showEmails = function () {
      console.log('data stored in email service: ', emails.data);
      console.log('dates length: ', emails.dateLengthSentBoolSubjArr.length);
      console.log('text length: ', emails.textArr.length);
    };

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
