'use strict';

angular.module('gnittyApp')
  .service('stats', function ($log, emails) {
    var _stats = this;
    this.data = {};

    this.parseAlchemyData = function (analysis) {
      if ( analysis.keywords.length > 40 ) {
        analysis.keywords = analysis.keywords.slice( 0, 40 );
      }
      for (var i = 0; i < analysis.keywords.length; i++) {
        if ( analysis.keywords[i].text.length > 15 ) {
          analysis.keywords[i].text = analysis.keywords[i].text.slice(0, 15) + '…';
        }
      }
      //separate keywords into 26 alphabetical arrays
      var splitKeywords = function(keywords) {
        var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var keywordArr = [];
        for (var h=0; h<26; h++) {
          keywordArr[h] = [];
        }
        for (var i=0; i<keywords.length; i++) {
          for (var j=0; j<26; j++) {

            if (keywords[i].text[0].toUpperCase() === alphabet[j]) {
              keywordArr[j].push(keywords[i]);
            }
          }
        }
        return keywordArr;
      };
      _stats.keywords = splitKeywords(analysis.keywords);

      var statObj = {
        concepts: analysis.concepts,
        keywords: _stats.keywords,
        sentiment: analysis.sentiment,
        dateLengthSentBoolArray: emails.dateLengthSentBoolArr
      };
      _stats.data = statObj;
      $log.debug( 'Saved to stats: ', _stats.data );
    };



    // STRICTLY FOR DEV TESTING — REMOVE BEFORE DEPLOYMENT
    this.setLocal = function () {
      $log.info ( 'Saving to local storage: ', this.data );
      localStorage.setItem( 'stats', JSON.stringify( this.data ) );
    };
    this.getLocal = function () {
      var storage = JSON.parse( localStorage.getItem( 'stats' ) );
      if ( !storage ) {
        $log.warn('No / incomplete local storage found. Please fetch.');
      } else {
        this.data = storage;
        $log.info( 'Retrieved local storage and set data: ', this.data );
      }
    };

  });
