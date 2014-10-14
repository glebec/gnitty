'use strict';

describe('Service: fetchRecord', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var fetchRecord;
  beforeEach(inject(function (_fetchRecord_) {
    fetchRecord = _fetchRecord_;
  }));

  it('should do something', function () {
    expect(!!fetchRecord).toBe(true);
  });

});
