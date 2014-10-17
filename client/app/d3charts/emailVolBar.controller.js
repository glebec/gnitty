'use strict';

angular.module('gnittyApp')
  .controller('emailVolBarCtrl', ['$scope', 'stats', function($scope, stats){

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
            x: function(d){return d.label;},
            y: function(d){return d.value;},
            showValues: true,
            valueFormat: function(d){
                return d3.format(',f')(d);
            },
            transitionDuration: 1000
            // xAxis: {
            //     axisLabel: ''
            // },
            // yAxis: {
            //     axisLabel: '',
            //     axisLabelDistance: 30
            // }
        }
    };

        $scope.data = [
            {
                key: "Cumulative Return",
                values: [
                    {
                        "label" : "You",
                        "value" : 3000
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