'use strict';

angular.module('gnittyApp')
  .controller('emailVolBarCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

    // avg person received = 5,579 emails
    // add data on line 45
    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin : {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            title: {
                enable: true,
                text: 'Emails Received'
            },
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
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "You",
                        "value" : $scope.emailsPerYear
                    } ,
                    {
                        "label" : "Average American",
                        "value" : 5579
                    } ,
                    {
                        "label" : "John Oliver",
                        "value" : 13724
                    } ,
                    {
                        "label" : "Oprah",
                        "value" : 23000
                    }
                ]
            }
        ];

  }]);
