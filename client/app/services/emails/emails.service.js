'use strict';

angular.module('gnittyApp')
  .service('emails', function (gAPI) {
    var _emails = this;

    this.data = {};

    this.fetch = function () {
      gAPI.fetch().then(
        function ( emailData ) { _emails.data = emailData; },
        function ( err ) { console.log( err ); }
      );
    };

    this.getDatesAndLengths = function() {
      var dateLengthArr = [];
      for ( var id in this.data ) {
        dateLengthArr.push({
          date:this.data[id].date,
          tlength:this.data[id].plain.length
        });
      }
      return dateLengthArr;
    };

    this.getBody = function() {
      var textArr = [];
      for ( var id in this.data ) {
        textArr.push( this.data[id].plain );
      }
      textArr = textArr.slice( 0, 10 );
      return textArr;
    };

    // STRICTLY FOR DEV TESTING — REMOVE BEFORE DEPLOYMENT
    this.setLocal = function () {
      console.log ('Saving to local storage: ', this.data );
      localStorage.setItem( 'testData', JSON.stringify(this.data) );
    };
    this.getLocal = function () {
      var storage = JSON.parse( localStorage.getItem('testData') );
      if (!storage) {
        console.log('No local storage found. Please fetch.');
      } else {
        this.data = storage;
        console.log( 'Retrieved local storage and set data: ', this.data );
      }
    };

  });
