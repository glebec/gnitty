'use strict';

describe('Service: d3', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var d3;
  beforeEach(inject(function (_d3_) {
    d3 = _d3_;
  }));

  it('should do something', function () {
    expect(!!d3).toBe(true);
  });

});
