'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, Auth, gAPI, emails, postAlchemy, stats) {
    $scope.getCurrentUser = Auth.getCurrentUser;

    // initialize google api in case already signed in, etc. TODO: fix this
    // gAPI.handleClientLoad();

    // DEV TESTING ONLY, REMOVE BEFORE DEPLOYMENT
    $scope.setLocal = function () { emails.setLocal() };
    $scope.getLocal = function () { emails.getLocal() };

    // Scope wires together ng-click login call to google API service
    // gAPI.login() returns a promise which resolves with .then()
    // data returned currently contains an email property with user's address
    $scope.login = function() {
      gAPI.login().then(
        function (data) { console.log( 'your address is ' + data.email ); },
        function (err) { console.log( 'Failed: ' + err ); }
      );
    };

    // fetch emails and store in email service
    $scope.fetch = function() {
      gAPI.fetch();
    };

    // show stored data
    $scope.showEmails = function() {
      console.log('data stored in email service:', emails.data);
      $scope.dateArray = emails.getDates();
      console.log("dates length: ", $scope.dateArray.length);
    };

    $scope.getText = function() {
      $scope.joinText = emails.getBody().join('');
      console.log('characters in text: ', $scope.joinText.length);
      return $scope.joinText;
    };

    $scope.postIt = function () {
      postAlchemy.sendToAlchemy($scope.getText(), function(analysis) {
        for (var i=0; i<analysis.keywords.length; i++) {
          if (analysis.keywords.length>40) {
            analysis.keywords.pop();
          }
          if (analysis.keywords[i].text.length>15) {
            analysis.keywords[i].text = analysis.keywords[i].text.slice(0, 15);
          }
        }
          var statObj = {
            concepts: analysis.concepts,
            keywords: analysis.keywords,
            sentiment: analysis.sentiment,
            dateArray: $scope.dateArray
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
