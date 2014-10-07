'use strict';

describe('Controller: D3chartsCtrl', function () {

  // load the controller's module
  beforeEach(module('gnittyApp'));

  var D3chartsCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    D3chartsCtrl = $controller('D3chartsCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
