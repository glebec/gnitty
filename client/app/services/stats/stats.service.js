'use strict';

angular.module('gnittyApp')
  .service('stats', function (emails) {
    var _stats = this;
    this.data = {};

    this.parseAlchemyData = function (analysis) {
      if ( analysis.keywords.length > 50 ) {
        analysis.keywords = analysis.keywords.slice( 0, 50 );
      }
      for (var i = 0; i < analysis.keywords.length; i++) {
        if ( analysis.keywords[i].text.length > 15 ) {
          analysis.keywords[i].text = analysis.keywords[i].text.slice(0, 15) + '…';
        }
      }
      var statObj = {
        concepts: analysis.concepts,
        keywords: analysis.keywords,
        sentiment: analysis.sentiment,
        dateLengthArray: emails.dateLengthArr
        // wordCount: emails.wordCount,
        // bars: $scope.bars
      };
      _stats.data = statObj;
      console.log( 'saved object: ', _stats.data );
    };

  });
