'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    var _emails = this;

    // Primary data stores
    this.data = {};
    this.dateLengthSentBoolArr = [];
    this.textArr = [];
    this.bars = {};

    // Main setter function
    this.setData = function setData (data) {
      _emails.data = data;
      console.log(_emails.data);
      // derive values based on data and cache for easy access:
      var retrieved = _emails.separateDatasets();
      _emails.dateLengthSentBoolArr = retrieved.dateLengthSentBoolArr;
      _emails.textArr = retrieved.textArr;
      _emails.bars = _emails.splitDates(this.dateLengthSentBoolArr);
      console.log('Also derived ' + _emails.textArr.length + ' bodies and '+
        _emails.dateLengthSentBoolArr.length + ' dates.');
    };

    // Combined two for-in loops into one
    this.separateDatasets = function separateDatasets () {
      var datasets = {};
      var dateLengthSentBoolArr = [];
      var textArr = [];
      var charCount = 0;
      var textLimit = 50000; // test with Alchemy

      for ( var id in this.data ) {
        // dates and lengths for scatterplot
        // DEV: remove try-catch when the parse bug is found
        for ( var i=0; i < this.data[id].labels.length; i++ ) {
          this.sentBool = true;
          if ( this.data[id].labels[i] !== 'SENT' ) {
            this.sentBool = false;
          }
        }
        dateLengthSentBoolArr.push({
          date: this.data[id].date,
          tlength: this.data[id].plain.length,
          sent: this.sentBool
        });
        // text for Alchemy analysis
        charCount += this.data[id].plain.length;
        if ( charCount < textLimit ) textArr.push( this.data[id].plain );
      }
      return { dateLengthSentBoolArr: dateLengthSentBoolArr, textArr: textArr };
    };

    this.splitDates = function (dateLengthSentBoolArr) {
      // Safety typecasting, e.g. in case of stringified data from local store
      for ( var j = 0; j < dateLengthSentBoolArr.length; j++ ) {
        if ( typeof dateLengthSentBoolArr[j].date !== 'object' ) {
          dateLengthSentBoolArr[j].date = new Date( dateLengthSentBoolArr[j].date );
        }
      }
      //sort array of objects from smallest date to largest-most-recent date
      dateLengthSentBoolArr.sort( function (a, b) {return a.date-b.date;} );
      this.latest = Number(dateLengthSentBoolArr[dateLengthSentBoolArr.length-1].date);
      this.earliest = Number(dateLengthSentBoolArr[0].date);
      var temporary = this.earliest;
      var timeSpan = this.latest - this.earliest;
      //Listed as number of milliseconds since midnight January 1, 1970 UTC

      //divide the timeSpan of user's ~1000 emails into 80 pieces (to become 80 bars)
      var barNum = 80;
      var barCapacity = timeSpan/barNum;
      var bar = [];
      var delimiter = this.earliest+barCapacity;
      for (var h=0; h<barNum; h++) {
        bar[h] = [];
        for(var i=0; i<dateLengthSentBoolArr.length; i++) {
          if (delimiter >= Number(dateLengthSentBoolArr[i].date) &&
            Number(dateLengthSentBoolArr[i].date) > this.earliest) {
            bar[h].push({date: dateLengthSentBoolArr[i].date, sentBool: dateLengthSentBoolArr[i].sent});
          }
        }
        dateLengthSentBoolArr = dateLengthSentBoolArr.slice(bar[h], dateLengthSentBoolArr.length);
        // console.log(delimiter+'='+latest+'?');
        this.earliest+=barCapacity;
        // console.log('earliest'+earliest+'='+latest+'?');
        delimiter+=barCapacity;
      }

      var datesInArray = 0;
      for(var k=0; k<80; k++) {
        datesInArray=bar.length;
      }
      // console.log('datesInArray = ', datesInArray);
      // console.log('bars in 80 pieces = ', bar);
      return {bars: bar, earliest: temporary, latest: this.latest};
    };

    // STRICTLY FOR DEV TESTING — REMOVE BEFORE DEPLOYMENT
    this.setLocal = function () {
      console.log ('Saving to local storage: ', this.data, this.dateLengthSentBoolArr, this.textArr, this.bars );
      localStorage.setItem( 'emails', JSON.stringify(this.data) );
      localStorage.setItem( 'dateLengths', JSON.stringify(this.dateLengthSentBoolArr) );
      localStorage.setItem( 'bars', JSON.stringify(this.bars));
      localStorage.setItem( 'texts', JSON.stringify(this.textArr) );
    };
    this.getLocal = function () {
      var emails = JSON.parse( localStorage.getItem('emails') );
      var dateLengths = JSON.parse( localStorage.getItem('dateLengths') );
      var texts = JSON.parse( localStorage.getItem('texts') );
      var bars = JSON.parse(localStorage.getItem('bars'));
      if ( !emails || !dateLengths || !texts ||!bars) {
        console.log('No / incomplete local storage found. Please fetch.');
      } else {
        this.data = emails;
        this.dateLengthSentBoolArr = dateLengths;
        this.textArr = texts;
        this.bars = bars;
        console.log( 'Retrieved local storage and set data: ', this.data, this.dateLengthSentBoolArr, this.textArr, this.bars );
      }
    };
  });

        // var dateData = [];
        // var dateFixed = [];
        // dateFixed[j] = new Date(dateLengthSentBoolArr[j].date);
        // console.log(dateFixed);
        // dateData.push(dateFixed);
        // console.log(dateData);
        // console.log(dateData[0]);

        // console.log(dateData[dateData[0].length-1]);
