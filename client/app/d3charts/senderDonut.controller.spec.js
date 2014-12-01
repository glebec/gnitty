'use strict';

describe('Controller: SenderdonutCtrl', function () {

  // load the controller's module
  beforeEach(module('gnittyApp'));

  var SenderdonutCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SenderdonutCtrl = $controller('SenderdonutCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
