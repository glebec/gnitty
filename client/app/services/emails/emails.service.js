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
      _emails.senderCount = _emails.sortSenders();
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
        // dates and lengths and sentBoolean for scatterplot
        // DEV: remove try-catch when the parse bug is found
        this.sentBool = true;
        for ( var i=0; i < this.data[id].labels.length; i++ ) {
          var sentBoolInt = 0;
          if ( this.data[id].labels[i] === 'SENT' ) {
            sentBoolInt++;
          }
        }
        if (sentBoolInt === 0) {
          this.sentBool = false;
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
      //in milliseconds

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

    this.sortSenders = function () {
      var allSenders = [];
      var allSendersSliced = [];
      var sendersArr = [];

      //get only received email, so that you don't show up on your own chart
      for ( var id in this.data ) {
        var sentBoolVar = 0;
        for ( var i=0; i < this.data[id].labels.length; i++ ) {
          if ( this.data[id].labels[i] !== 'SENT' ) {
            sentBoolVar++;
          }
          if (sentBoolVar === this.data[id].labels.length) {
            allSenders.push(this.data[id].from);
          }
        }
      }

      //get raw email address so that duplicates can be removed
      for ( var j=0; j < allSenders.length; j++ ) {
        allSendersSliced[j] = allSenders[j].slice(allSenders[j].indexOf('<') + 1, allSenders[j].indexOf('>'));
      }

      //use duplicates to get number of emails from each sender
      for ( var k=0; k < allSendersSliced.length; k++ ) {
        var tempVal = 0;
        for ( var l=0; l < allSendersSliced.length; l++ ) {
          if (allSendersSliced[k] === allSendersSliced[l]) {
            tempVal++;
          }
        }
        sendersArr[k] = {email: allSendersSliced[k], val: tempVal};
      }

      //sort senders' array smallest to largest. Mine was ~700 email address objects
      sendersArr.sort(function(a,b) {
        return b.val - a.val;
      });

      //remove duplicates.  Mine was about 160 length after this
      Array.prototype.removeDuplicates = function() {
        var input = this;
        var hashObject = new Object();

        for (var i = input.length - 1; i >= 0; i--) {
            var currentItem = input[i].email;

            if (hashObject[currentItem] == true) {
                input.splice(i, 1);
            }

            hashObject[currentItem] = true;
        }
        return input;
      }

      sendersArr.removeDuplicates();
      console.log('sendersArr spliced dupes:', sendersArr);
      return sendersArr;
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