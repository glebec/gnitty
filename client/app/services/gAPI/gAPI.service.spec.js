'use strict';

describe('Service: gAPI', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var gAPI;
  beforeEach(inject(function (_gAPI_) {
    gAPI = _gAPI_;
  }));

  it('should do something', function () {
    expect(!!gAPI).toBe(true);
  });

});
