;'use strict';

angular.module('gnittyApp')
  .controller('wordVolBarCtrl', ['$scope', 'stats', 'emails', function($scope, stats, emails){

    //TODO: Put data in stats

    // avg person typed = 41,638
    // 41,638/250 words per page = 166 pages
    //  Which makes the average Cue user's email output slightly greater than The Old Man and the Sea (127 pages long), slightly less than The Great Gatsby (182 pages), and just about equal to The Turn of the Screw (165 pages) -- from The Atlantic http://www.theatlantic.com/technology/archive/2013/01/you-probably-write-a-novels-worth-of-email-every-year/266942/

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
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            // showValues: true,
            valueFormat: function(d){
                return d3.format(',.f')(d);
            },
            transitionDuration: 2000,
            tooltips: true,
            tooltipContent: function(key, x, y, e, graph) {
              return '<p>' + y + ' words' + '</p>';
            }
        }
    };

        $scope.data = [
            {
                values: [
                    {
                        "label" : "You",
                        "value" : emails.sentWordVol(emails.dateLengthSentBoolArr)
                    } ,
                    // {
                    //     "label" : "Average American",
                    //     "value" : 41638
                    // } ,
                    {
                        "label" : "The Old Man and the Sea",
                        "value" : 31750
                    } ,
                    {
                        "label" : "The Great Gatsby",
                        "value" : 45500
                    },
                    {
                        "label" : "To Kill a Mockingbird",
                        "value" : 100388
                    },

                    {
                      "label" : "Jane Eyre",
                      "value" : 183858
                    },
                    {
                        "label" : "Harry Potter and the Order of the Phoenix",
                        "value" : 257154
                    },
                    {
                        "label" : "Les Miserables",
                        "value" : 530982
                    }
                ]
            }
        ];
    if (isNaN($scope.data[0].values[0].value)) {
      alert("Your data has timed out. Please go back and click 'GNITIFY' again.");
    }
    }]);