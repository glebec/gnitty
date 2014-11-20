'use strict';

angular.module('gnittyApp')
  .controller('mainCarouselCtrl', function ($scope) {
    $scope.myInterval = 15000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      //revisit newWidth
      var newWidth = 600 + slides.length;
      slides.push({
        image: 'assets/images/sentiment_screenshot_cropped.jpg',
        text: 'How do I come across in email?'
      },
      {
        image: 'assets/images/stacked_screenshot_cropped.jpg',
        text: 'How much email do I generate?'
      },
      {
        image: 'assets/images/scatter_screenshot_cropped.jpg',
        text: 'What time of day am I mmost productive?'
      });
    };
    $scope.addSlide();
  });
