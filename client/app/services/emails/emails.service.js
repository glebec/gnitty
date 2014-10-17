'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.data = {};
    this.getDates = function() {
      var dateArr = [];
      for (var id in this.data) {
        dateArr.push(this.data[id].date);
      }
      return dateArr;
    };
    this.getBody = function() {
      var textArr = [];
      for (var id in this.data) {
        textArr.push(this.data[id].plain);
      }
      textArr = textArr.slice(0,10);
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
