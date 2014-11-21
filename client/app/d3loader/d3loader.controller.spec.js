'use strict';

describe('Controller: D3loaderCtrl', function () {

  // load the controller's module
  beforeEach(module('gnittyApp'));

  var D3loaderCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    D3loaderCtrl = $controller('D3loaderCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
