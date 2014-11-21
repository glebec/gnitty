'use strict';

angular.module('gnittyApp')
  .controller('D3loaderCtrl', function ($scope, gAPI, emails, postAlchemy, stats, $location) {

    // Fetch button status
    // fetch emails from Gmail API and store them in the email service
    $scope.fetch = function () {
      $scope.clicked=true;
      $scope.fetchBtnText = 'Authorizing…';
      gAPI.start().then( runFetchers );

      function runFetchers () {
        $scope.fetchBtnText = 'Fetching…';

        gAPI.collectEmails().then(
          function fetchSuccess ( emailData ) {
            $scope.fetchBtnText = 'Fetched!';
            emails.setData( emailData );
          },
          null,
          function fetchUpdate ( update ) {
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
          },
          function gnittyErr (err) {
            console.log ( 'Fetch or alchemy call failed: ', err );
          }
        );

      }

    };

      $scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: true,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                showLegend: false,
                pie: {
                    startAngle: function(d) { return d.startAngle/2 - Math.PI/2},
                    endAngle: function(d) { return d.endAngle/2 - Math.PI/2}
                },
                tooltips: false,
                transitionDuration: 5000,
                legend: {
                    margin: {
                        top: 5,
                        right: 70,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };

        $scope.data = [
            {
                key: "Authenticating",
                y: 5
            },
            {
                key: "Fetching",
                y: 2
            },
            {
                key: "Analyzing",
                y: 9
            }
        ];
  });
