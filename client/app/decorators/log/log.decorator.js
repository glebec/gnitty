'use strict';

angular.module('gnittyApp')
  .config(function ($provide) {
    $provide.decorator('$log', function ($delegate) {
      // enhance the $log function with $log.table().
      $delegate.table = function () {
        if ( console && console.table ) {
          console.table( arguments );
        } else if ( console && console.log) {
          console.log( 'no table function available.' );
          console.log( arguments );
        }
      };
      return $delegate;
    });
  });
