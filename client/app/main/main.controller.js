'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, gAPI, emails, postAlchemy, stats, $location) {

    // initialize google api in case already signed in, etc. TODO: fix this
    // gAPI.handleClientLoad();

    // DEV TESTING ONLY, REMOVE BEFORE DEPLOYMENT
    $scope.setLocal = function () { emails.setLocal(); };
    $scope.getLocal = function () { emails.getLocal(); };

    // Fetch button status
    $scope.fetchBtnText = 'Gnitify!';
    // fetch emails from Gmail API and store them in the email service
    $scope.fetch = function () {
      $scope.fetchBtnText = 'Fetching…';
      gAPI.fetch().then(
        function fetchSuccess ( emailData ) {
          emails.setData( emailData );
          $scope.fetchBtnText = 'Fetched!';
        },
        null,
        function fetchUpdate ( update ) {
          $scope.fetchBtnText = 'Fetching: ' + update;
        }
      ).then(
        function postIt () {
          $scope.fetchBtnText = 'Analyzing…';
          return postAlchemy.sendToAlchemy( emails.textArr.join('') );
        }
      ).then(
        function (analysis) {
          stats.parseAlchemyData( analysis );
          $scope.fetchBtnText = 'Analyzed!';
          // route to D3 charts page
        },
        function err (err) {
          console.log ( 'Fetch or alchemy call failed: ', err );
          $scope.fetchBtnText = 'OOPS…';
        }
      );
    };

    // show stored data
    $scope.showEmails = function () {
      console.log('data stored in email service: ', emails.data);
      console.log('dates length: ', emails.dateLengthArr.length);
      console.log('text length: ', emails.textArr.length);
      $scope.bars = emails.splitDates($scope.dateLengthArray);
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
