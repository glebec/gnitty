'use strict';

describe('Controller: MaincarouselCtrl', function () {

  // load the controller's module
  beforeEach(module('gnittyApp'));

  var MaincarouselCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MaincarouselCtrl = $controller('MaincarouselCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
