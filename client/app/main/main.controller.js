'use strict';

angular.module('gnittyApp')
  .controller('MainCtrl', function ($scope, $http, Auth, gAPI) {
    // We are not currently using in-app sign-in, so this is not needed.
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

    // checkAuth
    $scope.checkAuth = function() {
      gAPI.checkAuth();
    };

    // Alchemy Notes:

    // Calls to TextGetTextSentiment should be made using HTTP POST.
    // HTTP POST calls should include the Content-Type header: application/x-www-form-urlencoded //?
    // Posted text documents can be a maximum of 50 kilobytes. Larger documents will result in a "content-exceeds-size-limit" error response.

    // Note - since our data is not from a public webpage, we have to actually upload it.

    $scope.allEmailBodies = 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D';

    $scope.sendToAlchemy = function (emails) {
      $http.post('/api/alchemy', {
        text: $scope.allEmailBodies,
        outputMode: 'json'
      }).success(function(returnedJSON) {
        $scope.sentiment = returnedJSON;
        console.log($scope.sentiment);
      });
      $http.post('/api/alchemy/keywords', {
        text: $scope.allEmailBodies,
        outputMode: 'json'
      }).success(function(returnedJSON) {
        $scope.keywords = returnedJSON;
        console.log($scope.keywords.k);
      });
      $http.post('/api/alchemy/concepts', {
        text: $scope.allEmailBodies,
        outputMode: 'json'
      }).success(function(returnedJSON) {
        $scope.concepts = returnedJSON;
        console.log($scope.concepts.c);
      });
    };

    $scope.postIt = function () {
      console.log('posting...');
      $scope.sendToAlchemy($scope.allEmailBodies)
      .success(function() {
        $http.post('/api/stats', {
          user: {
            _id: $scope.getCurrentUser()._id
          },
          concepts: $scope.concepts.c,
          keywords: $scope.keywords.k,
          sentiment: $scope.sentiment
        });
        console.log('saved');
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
