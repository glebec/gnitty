'use strict';

angular.module('gnittyApp')
  .controller('emailVolBarCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

    // avg American received = 147 emails/day *365 (Fortune Magazine: http://fortune.com/2012/10/08/stop-checking-your-email-now/)
    // avg person received = 266 emails / day based on projections from Radicati Group Report http://www.radicati.com/?p=3237
    // Pres Obama gets 20,000 pieces of mail / day
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 600,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            tooltips: false,
            transitionDuration: 2000,
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',f')(d);
            }
        }
    };

    $scope.emailsPerYear = emails.inboxVolume(emails.dateLengthSentBoolArr);

        $scope.data = [
            {
                key: "Email per Annum",
                values: [
                    {
                        "label" : "You",
                        "value" : $scope.emailsPerYear
                    } ,
                    {
                        "label" : "Average Email User (personal)",
                        "value" : 43742
                    } ,
                    {
                        "label" : "Average Email User (business)",
                        "value" : 53655
                    } ,
                    {
                        "label" : "Average Email User (personal + business)",
                        "value" : 97397
                    }
                    // {
                    //     "label" : "President Obama",
                    //     "value" : 7300000
                    // }
                ]
            }
        ];

  }]);
