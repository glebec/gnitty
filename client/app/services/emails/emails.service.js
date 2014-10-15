'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.data = {};
    this.getDates = function() {
      var dateArr = [];
      for (var id in this.data) {
        dateArr.push(this.data[id].date);
        // console.log(dateArr);
      }
      return dateArr;
    };
    this.getBody = function() {
      var textArr = [];
      for (var id in this.data) {
        textArr.push(this.data[id].plain);
      }
    return textArr;
    }
  });
