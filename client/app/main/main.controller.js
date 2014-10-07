'use strict';

angular.module('gnittyApp')
  .controller('MainCtrl', function ($scope, $http, Auth) {
    $scope.getCurrentUser = Auth.getCurrentUser;
    console.log($scope.getCurrentUser());

// Alchemy Notes:

// Calls to TextGetTextSentiment should be made using HTTP POST.
// HTTP POST calls should include the Content-Type header: application/x-www-form-urlencoded //?
// Posted text documents can be a maximum of 50 kilobytes. Larger documents will result in a "content-exceeds-size-limit" error response.

//Note - since our data is not from a public webpage, we have to actually upload it.

    $scope.postIt = function () {
      console.log('posting...');
      $http.post('/api/alchemy', {
        // 'http://access.alchemyapi.com/calls/text/TextGetTextSentiment', {
        // apikey: alchemy.apiKey,
        text: 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D',
        // text: 'msgText', //this comes from all gmail messages
        outputMode: 'json'
        }).success(function(returnedJSON) {
          $scope.results = returnedJSON;
          console.log($scope.results);
          // $scope.results.docSemtiment.type gives positive, neg, neutral
          // $scope.results.docSentiment.score gives strength of sentiment (0.0 is neutral)
        });
      $http.post('/api/alchemy/keywords', {
        text: 'AGREEEDD! DAMN YOU CELEBRANTS OF COLUMBUS DAY!!!!!!!!!!! DAMN YOU TO HELL!!!!!! :-D',
        outputMode: 'json'
      }).success(function(returnedJSON) {
          $scope.results = returnedJSON;
          console.log($scope.results);
        });
    };

    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };
  });