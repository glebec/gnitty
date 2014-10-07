'use strict';

angular.module('gnittyApp')
  .service('twilioMMS', function ($scope, $http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    $http.post('/', {
      body: "Did you know that you sent 47 emails on June 6, 1999? View more info here.",
      to: $scope.num,
      from: "+15402557850",
      mediaUrl: "http://www.example.com/hearts.png"
    });

  });
