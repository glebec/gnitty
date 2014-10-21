'use strict';

angular.module('gnittyApp')
  .service('postAlchemy', function ($http, $q) {

    var sentiment,
      keywords,
      concepts;

    var _thisService = this;

    this.sendToAlchemy = function (emails) {

      // Master promise for grouping the three API calls, and object to send.
      var alchemyDefer = $q.defer();
      var resultsObj = {};

      // Keep track and resolve promise when all calls done:
      var done = {};
      function checkOffList (which) {
        done[which] = true;
        if ( done.sentiment && done.keywords && done.concepts ) {
          alchemyDefer.resolve( resultsObj );
        }
      }

      // Fire off the asynchronous API calls simultaneously
      // TODO: make this more DRY
      $http.post('/api/alchemy', {
        text: emails,
        outputMode: 'json'
      }).success( function (sent) {
        resultsObj.sentiment = sent;
        checkOffList('sentiment');
      }).error( function (err) {
        alchemyDefer.reject(err);
      });

      $http.post('/api/alchemy/keywords', {
        text: emails,
        outputMode: 'json'
      }).success( function (keyw) {
        resultsObj.keywords = keyw.k;
        checkOffList('keywords');
      }).error( function (err) {
        alchemyDefer.reject(err);
      });

      $http.post('/api/alchemy/concepts', {
        text: emails,
        outputMode: 'json'
      }).success( function (conc) {
        resultsObj.concepts = conc.c;
        checkOffList('concepts');
      }).error( function (err) {
        alchemyDefer.reject(err);
      });

      // Return the promise for consumption in controller.
      return alchemyDefer.promise;
    };

  });
