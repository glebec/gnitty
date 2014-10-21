'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, gAPI, emails, postAlchemy, stats, $location) {

    // initialize google api in case already signed in, etc. TODO: fix this
    // gAPI.handleClientLoad();

    // DEV TESTING ONLY, REMOVE BEFORE DEPLOYMENT
    $scope.setLocal = function () { emails.setLocal() };
    $scope.getLocal = function () { emails.getLocal() };

    // Fetch button status
    $scope.fetchBtnText = 'Fetch Messages';
    // fetch emails from Gmail API and store them in the email service
    $scope.fetch = function () {
      $scope.fetchBtnText = 'Fetching…';
      gAPI.fetch().then(
        function ( emailData ) {
          emails.setData( emailData );
          $scope.fetchBtnText = 'Fetched!';
        },
        function ( err ) {
          console.log( err );
          $scope.fetchBtnText = 'OOPS…';
        },
        function ( update ) {
          $scope.fetchBtnText = 'Fetching: ' + update;
        }
      );
    };

    // show stored data
    $scope.showEmails = function () {
      console.log('data stored in email service: ', emails.data);
      console.log('dates length: ', emails.dateLengthArr.length);
      console.log('text length: ', emails.textArr.length);
      // $scope.bars = emails.splitDates($scope.dateLengthArray);
      $scope.postIt();
    };

    $scope.postIt = function () {
      postAlchemy.sendToAlchemy( emails.textArr.join('') ).then(
        function (analysis) {
          stats.parseAlchemyData( analysis );
        },
        function (err) {
          console.log ( 'Alchemy call failed: ', err );
        }
      );
    };

    $scope.link = 'http://www.ginnabaker.com';
    $scope.clientObj = {};
    $scope.clientObj.phoneNum = '+1' + '5402557850';
    $scope.mediaUrl = 'http://i495.photobucket.com/albums/rr313/trtla/ist2_1050220-red-crayon-heart.jpg';

    $scope.sendMMS = function() {
      $http.post('/api/twilio', {
        body: 'tap for your report: '+$scope.link,
        to: $scope.clientObj.phoneNum,
        mediaUrl: $scope.mediaUrl
      });
    };

  });
