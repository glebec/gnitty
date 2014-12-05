'use strict';

angular.module('gnittyApp')
.controller('MainCtrl', function ($scope, $http, $location, $log, gAPI, emails, postAlchemy, stats) {

    // initialize google api in case already signed in, etc. TODO: fix this
    // gAPI.handleClientLoad();

    $scope.fetchBtnText = 'Gnitify!';

    // fetch emails from Gmail API and store them in the email service
    $scope.fetch = function () {

      $scope.clicked = true;
      $scope.fetchBtnText = 'Authorizing…';

      gAPI.start().then(
        function fetchEmails () {
          $scope.fetchBtnText = 'Fetching…';
          return gAPI.collectEmails();
        }
      ).then(
        function fetchSuccess (emailData) {
          $scope.fetchBtnText = 'Fetched!';
          emails.setData( emailData );
        },
        null,
        function fetchUpdate (update) {
          $scope.fetchBtnText = 'Fetching: ' + Math.round(update * 100) + '%';
        }
      ).then(
        function analyze () {
          $scope.fetchBtnText = 'Analyzing…';
          return postAlchemy.sendToAlchemy( emails.textArr.join('') );
        }
      ).then(
        function absorbAlchemy (analysis) {
          $scope.fetchBtnText = 'Analyzed!';
          stats.parseAlchemyData( analysis );
          $location.path('/dashboard');
        }
      ).catch(
        function gnittyErr (err) {
          $log.error( 'Fetch or alchemy call failed: ', err );
          $scope.fetchBtnText = 'OOPS… Try again?';
          $scope.clicked = false;
        }
      );

    };

    // localStorage access for production
    $scope.setLocal = function () {
      emails.setLocal();
      stats.setLocal();
    };
    $scope.getLocal = function () {
      emails.getLocal();
      stats.getLocal();
    };

    $scope.showEmails = function () {
      $log.info('data stored in email service: ', emails.data);
      $log.info('dates length: ', emails.dateLengthSentBoolArr.length);
      $log.info('text length: ', emails.textArr.length);
    };

  });
