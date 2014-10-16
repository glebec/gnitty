'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, Auth, gAPI, emails, postAlchemy) {
    $scope.getCurrentUser = Auth.getCurrentUser;

    // initialize google api in case already signed in, etc. TODO: fix this
    // gAPI.handleClientLoad();

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
      // console.log($scope.dateArray);
      $scope.text = emails.getBody().join('');
    };

    // $scope.allEmailBodies = 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D';

    $scope.postIt = function () {
      postAlchemy.sendToAlchemy($scope.text, function(analysis) {
        console.log(analysis);
        var save = function(analysis) {
          $http.post('/api/stats', {
            user: {
              _id: $scope.getCurrentUser()._id
            },
            concepts: analysis.concepts,
            keywords: analysis.keywords,
            sentiment: analysis.sentiment,
            dateArray: $scope.dateArray
          });
        };
        save(analysis);
        console.log('saving...');
      });
    };

    $scope.link = 'http://www.ginnabaker.com';
    $scope.clientObj = {};
    $scope.clientObj.phoneNum = '+1' + '5402557850';
    $scope.mediaUrl = 'http://i495.photobucket.com/albums/rr313/trtla/ist2_1050220-red-crayon-heart.jpg';

    $scope.sendMMS = function() {
      $http.post('/api/twilio', {
        body: 'click for your report: '+$scope.link,
        to: $scope.clientObj.phoneNum,
        mediaUrl: $scope.mediaUrl
      });
    };

  });
