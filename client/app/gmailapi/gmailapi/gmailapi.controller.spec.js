'use strict';

describe('Controller: GmailapiCtrl', function () {

  // load the controller's module
  beforeEach(module('gnittyApp'));

  var GmailapiCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    GmailapiCtrl = $controller('GmailapiCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
