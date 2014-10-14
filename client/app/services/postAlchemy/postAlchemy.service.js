'use strict';

angular.module('gnittyApp')
  .service('postAlchemy', function ($http) {
    var sentiment,
      keywords,
      concepts;
    var _thisService = this;
    this.sendToAlchemy = function(emails,cb) {
      $http.post('/api/alchemy', {
          text: emails,
          outputMode: 'json'
          }).success(function(sent) {
            sentiment = sent;
            console.log(sentiment);
            APIcall2(emails);
            });
        var APIcall2 = function(emails) {
          $http.post('/api/alchemy/keywords', {
            text: emails,
            outputMode: 'json'
          }).success(function(keyw) {
              keywords = keyw;
              console.log(keywords.k);
              APIcall3(emails);
            });
        };
        var APIcall3 = function(emails) {
        $http.post('/api/alchemy/concepts', {
          text: emails,
          outputMode: 'json'
        }).success(function(conc) {
            concepts = conc;
            console.log(concepts.c);
            cb({
              'sentiment': sentiment,
              'keywords': keywords.k,
              'concepts': concepts.c
            })
        });

        };

      };
  });