'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    var _emails = this;

    this.data = {};
    this.dateLengthArr = [];

    // Setter also takes care of updating derived values
    this.setData = function (data) {
      _emails.data = data;
      _emails.dateLengthArr = _emails.getDatesAndLengths();
    };

    // TODO: reduce for-in looping for performance (next two functions).

    this.getDatesAndLengths = function() {
      var dateLengthArr = [];
      for ( var id in this.data ) {
        dateLengthArr.push({
          date: this.data[id].date,
          tlength: this.data[id].plain.length
        });
      }
      return dateLengthArr;
    };

    this.getBody = function() {
      var textArr = [];
      for ( var id in this.data ) {
        textArr.push( this.data[id].plain );
      }
      // for (var o=0; 0<textArr.length; o++) {
      //   this.wordCount += textArr[0].length;
      // }
      textArr = textArr.slice( 0, 20);
      return textArr;
    };

    this.splitDates = function (dateLengthArr) {
      for (var j=0; j<dateLengthArr.length; j++) {
        //convert dates from strings to date objects
        dateLengthArr[j].date = new Date(dateLengthArr[j].date);
      }
        //sort array of objects from smallest date to largest-most-recent date
        dateLengthArr.sort(function(a, b){return a.date-b.date});
        var latest = Number(dateLengthArr[dateLengthArr.length-1].date);
        // console.log('earliest = '+ earliest);
        var earliest = Number(dateLengthArr[0].date);
        // console.log('latest = '+ latest);
        var timeSpan = latest - earliest;
        // console.log('timeSpan = '+ timeSpan);
        //Listed as number of milliseconds since midnight January 1, 1970 UTC

        //divide the timeSpan of user's ~1000 emails into 80 pieces (to become 80 bars)
        var barNum = 80;
        var barCapacity = timeSpan/barNum;
        var bar = [];
        for (var l=1; l<80; l++) {
          bar[0]=1;
          bar[l] = 0;
        }
      var delimiter = earliest+barCapacity;
      for (var h=0; h<barNum; h++) {
        for(var i=0; i<dateLengthArr.length; i++) {
          // console.log('h='+h+', bar'+h+' = '+bar[h]);
          // console.log(earliest);
          // console.log(delimiter);
          // console.log(Number(dateLengthArr[i].date));
          if (delimiter >= Number(dateLengthArr[i].date) &&
            Number(dateLengthArr[i].date) > earliest) {
            bar[h]++;
          }
        }
        dateLengthArr = dateLengthArr.slice(bar[h], dateLengthArr.length);
        // console.log(delimiter+'='+latest+'?');
        earliest+=barCapacity;
        // console.log('earliest'+earliest+'='+latest+'?');
        delimiter+=barCapacity;
      }

      var datesInArray = 0;
      for(var k=0; k<80; k++) {
        datesInArray+=bar[k];
      }
      console.log('datesInArray = '+datesInArray);
      console.log('bars in 80 pieces = '+bar);
      this.bar = bar;
      return bar;
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

        // var dateData = [];
        // var dateFixed = [];
        // dateFixed[j] = new Date(dateLengthArr[j].date);
        // console.log(dateFixed);
        // dateData.push(dateFixed);
        // console.log(dateData);
        // console.log(dateData[0]);

        // console.log(dateData[dateData[0].length-1]);
