'use strict';

angular.module('gnittyApp')
  .service('postAlchemy', function ($http, $q, $log) {

    this.sendToAlchemy = function (text) {
      var alchemyCalls = [
        '/api/alchemy',
        '/api/alchemy/keywords',
        '/api/alchemy/concepts'
      ];
      // map each API route to a promise for its response
      alchemyCalls = alchemyCalls.map( function makeCall (url) {
        return $http.post( url, {text: text, outputMode: 'json'} );
      });
      // return a promise for one object representing all the data
      return $q.all( alchemyCalls ).then( function received (results) {
        $log.debug('Alchemy results: ', results);
        return {
          sentiment : results[0].data,
          keywords : results[1].data,
          concepts : results[2].data
        };
      });
    };

  });
