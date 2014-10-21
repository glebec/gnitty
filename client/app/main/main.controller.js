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
      // $scope.bars = emails.splitDates($scope.dateLengthArray);
      $scope.postIt();
    };

    $scope.getText = function () {
      $scope.joinText = emails.textArr.join('');
      console.log('characters in text: ', $scope.joinText.length);
      return $scope.joinText;
    };

    $scope.postIt = function () {
      postAlchemy.sendToAlchemy($scope.getText(), function(analysis) {
        for (var i=0; i<analysis.keywords.length; i++) {
          if (analysis.keywords.length>50) {
            analysis.keywords.pop();
          }
          if (analysis.keywords[i].text.length>15) {
            analysis.keywords[i].text = analysis.keywords[i].text.slice(0, 15)+"…";
          }
        }
          var statObj = {
            concepts: analysis.concepts,
            keywords: analysis.keywords,
            sentiment: analysis.sentiment,
            dateLengthArray: emails.dateLengthArr
            // wordCount: emails.wordCount,
            // bars: $scope.bars
          };
          stats.data = statObj;
          console.log('saved object: ', stats.data);
      });
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
