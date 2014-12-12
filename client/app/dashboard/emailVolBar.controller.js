'use strict';

angular.module('gnittyApp')
  .controller('emailVolBarCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

    // avg American received = 147 emails/day *365 (Fortune Magazine: http://fortune.com/2012/10/08/stop-checking-your-email-now/) = 53655
    // avg person received = 266 emails / day based on projections from Radicati Group Report http://www.radicati.com/?p=3237
    // Pres Obama gets 20,000 pieces of mail / day
    $scope.options = {
      chart: {
        type: 'multiBarChart',
        height: 600,
        stacked: true,
        transitionDuration: 1000,
        x: function(d){return d.label;},
        y: function(d){return d.value;},
        yAxis: {
          tickFormat: function (d){
            return d3.format(',f')(d);
          }
        },
        tooltips: true,
        tooltipContent: function(key, x, y, e, graph) {
          return '<h3>' + y + ' ' + key + '</h3>';
        }
      }
    };

    $scope.emailsPerYear = emails.inboxVolume(emails.dateLengthSentBoolArr);

        $scope.data = [
            {
                key: "Non-Spam",
                values: [
                    {
                        "label" : "You",
                        "value" : $scope.emailsPerYear
                    } ,
                    {
                        "label" : "Average Email User (personal)",
                        "value" : (43742*.3)
                    } ,
                    {
                        "label" : "Average Email User (business)",
                        "value" : (53655*.3)
                    } ,
                    {
                        "label" : "Average Email User (personal + business)",
                        "value" : (97397*.3)
                    }
                    // {
                    //     "label" : "President Obama",
                    //     "value" : 7300000
                    // }
                ]
            },
            {
                key: "Spam",
                values: [
                 {
                      "label" : "You",
                      "value" : ($scope.emailsPerYear*.7)
                  } ,
                  {
                      "label" : "Average Email User (personal)",
                      "value" : (43742*.7)
                  } ,
                  {
                      "label" : "Average Email User (business)",
                      "value" : (53655*.7)
                  } ,
                  {
                      "label" : "Average Email User (personal + business)",
                      "value" : (97397*.7)
                  }
              ]
            }
        ];

  }]);
