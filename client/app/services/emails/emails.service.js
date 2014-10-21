'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    var _emails = this;

    // Primary data stores
    this.data = {};
    this.dateLengthArr = [];
    this.textArr = [];

    // Main setter function
    this.setData = function setData (data) {
      _emails.data = data;
      // derive values based on data and cache for easy access:
      var retrieved = _emails.separateDatasets();
      _emails.dateLengthArr = retrieved.dateLengthArr;
      _emails.textArr = retrieved.textArr;
      console.log(_emails.textArr, _emails.dateLengthArr);
    };

    // Combined two for-in loops into one
    this.separateDatasets = function separateDatasets () {
      var datasets = {};
      var dateLengthArr = [];
      var textArr = [];
      var charCount = 0;
      var textLimit = 50000; // test with Alchemy
      for ( var id in this.data ) {
        // dates and lengths for scatterplot
        dateLengthArr.push({
          date: this.data[id].date,
          tlength: this.data[id].plain.length
        });
        // text for Alchemy analysis
        charCount += this.data[id].plain.length;
        if ( charCount < textLimit ) textArr.push( this.data[id].plain );
      }
      return { dateLengthArr: dateLengthArr, textArr: textArr };
    };

    this.splitDates = function (dateLengthArr) {
      //sort array of objects from smallest date to largest-most-recent date
      dateLengthArr.sort( function (a, b) {return a.date-b.date;} );
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
      console.log ('Saving to local storage: ', this.data, this.dateLengthArr, this.textArr );
      localStorage.setItem( 'emails', JSON.stringify(this.data) );
      localStorage.setItem( 'dateLengths', JSON.stringify(this.dateLengthArr) );
      localStorage.setItem( 'texts', JSON.stringify(this.textArr) );
    };
    this.getLocal = function () {
      var emails = JSON.parse( localStorage.getItem('emails') );
      var dateLengths = JSON.parse( localStorage.getItem('dateLengths') );
      var texts = JSON.parse( localStorage.getItem('texts') );
      if ( !emails || !dateLengths || !texts ) {
        console.log('No / incomplete local storage found. Please fetch.');
      } else {
        this.data = emails;
        this.dateLengthArr = dateLengths;
        this.textArr = texts;
        console.log( 'Retrieved local storage and set data: ', this.data, this.dateLengthArr, this.textArr );
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
