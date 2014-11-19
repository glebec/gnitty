'use strict';

angular.module('gnittyApp')
  .controller('mainCarouselCtrl', function ($scope) {
    $scope.myInterval = 15000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      //revisit newWidth
      var newWidth = 600 + slides.length;
      slides.push({
        image: 'assets/images/sentiment_screenshot.jpg',
        text: 'How do I come across in email?'
      },
      {
        image: 'assets/images/stacked_bar_screenshot.jpg',
        text: 'How much email do I generate?'
      },
      {
        image: 'assets/images/scatter_screenshot.jpg',
        text: 'What time of day am I mmost productive?'
      });
    };
    $scope.addSlide();
  });
