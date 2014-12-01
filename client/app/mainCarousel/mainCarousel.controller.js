'use strict';

angular.module('gnittyApp')
  .controller('mainCarouselCtrl', function ($scope) {
    $scope.myInterval = 15000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
      //revisit newWidth
      var newWidth = 600 + slides.length;
      slides.push({
        header: 'How do I come across in email?',
        text: ''
      },
      {
        header: 'What time of day am I most productive?',
        text: ''
      },
      {
        header: 'Do I get more email than the average person?',
        text: ''
      },
      {
        header: 'Pick out patterns, understand your inbox. Gnitty gets down to the nitty-gritty of your last 1,000 Gmail messages.',
        text: ''
      },
      {
        header: 'How does it work?',
        text: 'Gnitty analyzes your mail securely in the browser, saving nothing. We partner with Alchemy to glean your keywords. Authenticated through Google, meaning you remain in control. '
      },
      {
        header: 'How do I get started?',
        text: 'Click the GNITIFY button and see results in 10 seconds or less.'
      });
    };
    $scope.addSlide();
  });
