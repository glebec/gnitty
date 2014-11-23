'use strict';

angular.module('gnittyApp')
  .service('emails', function ($log) {
    var _emails = this;

    // Primary data stores
    this.data = {};
    this.dateLengthSentBoolArr = [];
    this.textArr = [];
    this.bars = {};

    // Main setter function
    this.setData = function setData (data) {
      _emails.data = data;
      $log.debug('Emails data: ', _emails.data);
      // derive values based on data and cache for easy access:
      var retrieved = _emails.separateDatasets();
      _emails.dateLengthSentBoolArr = retrieved.dateLengthSentBoolArr;
      _emails.textArr = retrieved.textArr;
      _emails.bars = _emails.splitDates(this.dateLengthSentBoolArr);
      $log.debug('Also derived ' + _emails.textArr.length + ' bodies and '+
        _emails.dateLengthSentBoolArr.length + ' dates.');
    };

    // Combined two for-in loops into one
    this.separateDatasets = function separateDatasets () {
      var datasets = {};
      var dateLengthSentBoolArr = [];
      var textArr = [];
      var charCount = 0;
      var textLimit = 50000; // with Alchemy

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
        if ( charCount < textLimit ) {
          textArr.push( this.data[id].plain );
        }
      }
      return { dateLengthSentBoolArr: dateLengthSentBoolArr, textArr: textArr};
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
      _emails.timeSpan = this.latest - this.earliest;
      //Listed as number of milliseconds since midnight January 1, 1970 UTC

      //divide the timeSpan of user's ~1000 emails into 80 pieces -- to become 80 bars
      var barNum = 80;
      var barCapacity = _emails.timeSpan/barNum;
      var bar = [];
      var delimiter = this.earliest+barCapacity;

      for (var h=0; h<barNum; h++) {
        bar[h] = [];
      //split emails into 80 buckets
        for(var i=0; i<dateLengthSentBoolArr.length; i++) {
          if (delimiter >= Number(dateLengthSentBoolArr[i].date) &&
            Number(dateLengthSentBoolArr[i].date) > this.earliest) {
            bar[h].push({date: dateLengthSentBoolArr[i].date, sentBool: dateLengthSentBoolArr[i].sent, emailLength: dateLengthSentBoolArr[i].tlength});
            }
          }
        dateLengthSentBoolArr = dateLengthSentBoolArr.slice(bar[h], dateLengthSentBoolArr.length);
        this.earliest+=barCapacity;
        delimiter+=barCapacity;
      }

      return {bars: bar, earliest: temporary, latest: this.latest, barCapacity: barCapacity};
    };

    this.inboxVolume = function(dateLengthSentBoolArr) {
      var indicator = 0;
      //calculate number of received emails in partial inbox
      for (var w=0; w<dateLengthSentBoolArr.length; w++) {
        if (dateLengthSentBoolArr[w].sent === false) {
          indicator ++;
        }
      }
      // 31536000000 = number of milliseconds in 1 year
      var partOfYear = _emails.timeSpan/31536000000;
      var emailsPerYear = indicator * (1/partOfYear);
      return emailsPerYear;
    };

    this.sentWordVol = function(dateLengthSentBoolArr) {
      var wordsInTimeInt = 0;
      for (var v=0; v<dateLengthSentBoolArr.length; v++) {
        if (dateLengthSentBoolArr[v].sent === true) {
          wordsInTimeInt += dateLengthSentBoolArr[v].tlength;
        }
      }

      var partOfYear = _emails.timeSpan/31536000000;
      var wordsSentPerYear = wordsInTimeInt * (1/partOfYear);
      return wordsSentPerYear;
    };

    // STRICTLY FOR DEV TESTING — REMOVE BEFORE DEPLOYMENT
    this.setLocal = function () {
      $log.info ('Saving to local storage: ', this.data, this.dateLengthSentBoolArr, this.textArr, this.bars );
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
        $log.warn('No / incomplete local storage found. Please fetch.');
      } else {
        this.data = emails;
        this.dateLengthSentBoolArr = dateLengths;
        this.textArr = texts;
        this.bars = bars;
        $log.info( 'Retrieved local storage and set data: ', this.data, this.dateLengthSentBoolArr, this.textArr, this.bars );
      }
    };
  });
