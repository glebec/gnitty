'use strict';

angular.module('gnittyApp')
  .service('emails', function () {
    var _emails = this;

    // Primary data stores
    this.data = {};
    this.dateLengthSentBoolSubjArr = [];
    this.textArr = [];
    this.bars = {};
    this.subject = [];

    // Main setter function
    this.setData = function setData (data) {
      _emails.data = data;
      console.log(_emails.data);
      // derive values based on data and cache for easy access:
      var retrieved = _emails.separateDatasets();
      _emails.dateLengthSentBoolSubjArr = retrieved.dateLengthSentBoolSubjArr;
      _emails.textArr = retrieved.textArr;
      _emails.bars = _emails.splitDates(this.dateLengthSentBoolSubjArr);
      console.log('Also derived ' + _emails.textArr.length + ' bodies and '+
        _emails.dateLengthSentBoolSubjArr.length + ' dates.');
    };

    // Combined two for-in loops into one
    this.separateDatasets = function separateDatasets () {
      var datasets = {};
      var dateLengthSentBoolSubjArr = [];
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
        dateLengthSentBoolSubjArr.push({
          date: this.data[id].date,
          tlength: this.data[id].plain.length,
          sent: this.sentBool,
          subject: this.data[id].subject
        });
        // text for Alchemy analysis
        charCount += this.data[id].plain.length;
        if ( charCount < textLimit ) {
          textArr.push( this.data[id].plain );
        }
      }
      return { dateLengthSentBoolSubjArr: dateLengthSentBoolSubjArr, textArr: textArr};
    };

    this.splitDates = function (dateLengthSentBoolSubjArr) {
      // Safety typecasting, e.g. in case of stringified data from local store
      for ( var j = 0; j < dateLengthSentBoolSubjArr.length; j++ ) {
        if ( typeof dateLengthSentBoolSubjArr[j].date !== 'object' ) {
          dateLengthSentBoolSubjArr[j].date = new Date( dateLengthSentBoolSubjArr[j].date );
        }
      }
      //sort array of objects from smallest date to largest-most-recent date
      dateLengthSentBoolSubjArr.sort( function (a, b) {return a.date-b.date;} );
      this.latest = Number(dateLengthSentBoolSubjArr[dateLengthSentBoolSubjArr.length-1].date);
      this.earliest = Number(dateLengthSentBoolSubjArr[0].date);
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
        for(var i=0; i<dateLengthSentBoolSubjArr.length; i++) {
          if (delimiter >= Number(dateLengthSentBoolSubjArr[i].date) &&
            Number(dateLengthSentBoolSubjArr[i].date) > this.earliest) {
            bar[h].push({date: dateLengthSentBoolSubjArr[i].date, sentBool: dateLengthSentBoolSubjArr[i].sent, emailLength: dateLengthSentBoolSubjArr[i].tlength});
            }
          }
        dateLengthSentBoolSubjArr = dateLengthSentBoolSubjArr.slice(bar[h], dateLengthSentBoolSubjArr.length);
        this.earliest+=barCapacity;
        delimiter+=barCapacity;
      }

      return {bars: bar, earliest: temporary, latest: this.latest, barCapacity: barCapacity};
    };

    this.inboxVolume = function(dateLengthSentBoolSubjArr) {
      var indicator = 0;
      //calculate number of received emails in partial inbox
      for (var w=0; w<dateLengthSentBoolSubjArr.length; w++) {
        if (dateLengthSentBoolSubjArr[w].sent === false) {
          indicator ++;
        }
      }
      // 31536000000 = number of milliseconds in 1 year
      var partOfYear = _emails.timeSpan/31536000000;
      var emailsPerYear = indicator * (1/partOfYear);
      return emailsPerYear;
    };

    this.sentWordVol = function(dateLengthSentBoolSubjArr) {
      var wordsInTimeInt = 0;
      for (var v=0; v<dateLengthSentBoolSubjArr.length; v++) {
        if (dateLengthSentBoolSubjArr[v].sent === true) {
          wordsInTimeInt += dateLengthSentBoolSubjArr[v].tlength;
        }
      }

      var partOfYear = _emails.timeSpan/31536000000;
      var wordsSentPerYear = wordsInTimeInt * (1/partOfYear);
      return wordsSentPerYear;
    };

    // STRICTLY FOR DEV TESTING — REMOVE BEFORE DEPLOYMENT
    this.setLocal = function () {
      console.log ('Saving to local storage: ', this.data, this.dateLengthSentBoolSubjArr, this.textArr, this.bars );
      localStorage.setItem( 'emails', JSON.stringify(this.data) );
      localStorage.setItem( 'dateLengths', JSON.stringify(this.dateLengthSentBoolSubjArr) );
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
        this.dateLengthSentBoolSubjArr = dateLengths;
        this.textArr = texts;
        this.bars = bars;
        console.log( 'Retrieved local storage and set data: ', this.data, this.dateLengthSentBoolSubjArr, this.textArr, this.bars );
      }
    };
  });
