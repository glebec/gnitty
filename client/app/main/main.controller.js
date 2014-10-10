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

    $scope.postIt = function () {
      console.log('posting...');
      $http.post('/api/alchemy', {
        text: 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D',
        // text: 'msgText', //this comes from all gmail messages
        outputMode: 'json'
        }).success(function(returnedJSON) {
          $scope.sentiment = returnedJSON;
          console.log($scope.sentiment);
          // $scope.sentiment.docSemtiment.type gives positive, neg, neutral
          // $scope.sentiment.docSentiment.score gives strength of sentiment (0.0 is neutral)
        });
      $http.post('/api/alchemy/keywords', {
        text: 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D',
        outputMode: 'json'
      }).success(function(returnedJSON) {
          $scope.keywords = returnedJSON;
          console.log($scope.keywords.k);
        });
      $http.post('/api/alchemy/concepts', {
        text: 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D',
        outputMode: 'json'
      }).success(function(returnedJSON) {
          $scope.concepts = returnedJSON;
          $http.post('/api/stats', {
            user: {
              _id: $scope.getCurrentUser()._id
            },
            concepts: $scope.concepts.c,
            keywords: $scope.keywords.k,
            sentiment: $scope.sentiment
          });
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
