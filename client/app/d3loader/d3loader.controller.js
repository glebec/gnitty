'use strict';

angular.module('gnittyApp')
  .controller('D3loaderCtrl', function ($scope, $interval, $location, gAPI, emails, postAlchemy, stats) {

    $scope.loadVal = $scope.loadVal || 0;
    $scope.smoothLoad = $scope.smoothLoad || 0;

    $interval(function() {
      if ($scope.loadVal > $scope.smoothLoad) {
        $scope.smoothLoad++;
        $scope.data = [
              {
                  key: "Fetching and Analyzing: " + $scope.smoothLoad + "%",
                  y: $scope.smoothLoad,
                  color: '#bcbd22'
              },
              {
                  key: "",
                  y: 100 - $scope.smoothLoad,
                  color: '#1f77b4'
              }
          ];
        $scope.api.refresh();
      }
    }, 10);

// making loading chart dynamic by watching the load val
    $scope.$watch('loadVal', function() {
      console.log('loadVal has changed', $scope.loadVal);
      $scope.data = [
            {
                key: "Fetching and Analyzing: " + $scope.smoothLoad + "%",
                y: $scope.smoothLoad,
                color: '#bcbd22'
            },
            {
                key: "",
                y: 100 - $scope.smoothLoad,
                color: '#1f77b4'
            }
        ];
      $scope.api.refresh();
    });

      $scope.options = {
            chart: {
                type: 'pieChart',
                height: 450,
                donut: false,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                pieLabelsOutside: true,
                showLegend: false,
                pie: {
                    startAngle: function(d) {return d.startAngle - Math.PI/2},
                    endAngle: function(d) {return d.endAngle - Math.PI/2}
                },
                tooltips: false,
                transitionDuration: 5000
            }
        };

    // Fetch button status
    // fetch emails from Gmail API and store them in the email service
        $scope.data = [
            {
                key: "Fetching and Analyzing",
                y: $scope.loadVal,
                color: '#bcbd22'
            },
            {
                key: "",
                y: 100 - $scope.loadVal,
                color: '#1f77b4'
            }
        ];

    $scope.fetch = function () {
      $scope.clicked=true;
      gAPI.start().then( runFetchers );
      function runFetchers () {
        gAPI.collectEmails().then(
          function fetchSuccess ( emailData ) {
            emails.setData( emailData );
          },
          null,
          function fetchUpdate ( update ) {
            $scope.loadVal = Math.round(update * 100);
          }
        ).then(
          function analyze () {
            return postAlchemy.sendToAlchemy( emails.textArr.join('') );
          }
        ).then(
          function absorbAlchemy (analysis) {
            stats.parseAlchemyData( analysis );
            $location.path('/dashboard');
          },
          function gnittyErr (err) {
            console.log ( 'Fetch or alchemy call failed: ', err );
          }
        );

      }

    };
  });


