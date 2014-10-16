'use strict';

describe('Service: emails', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var emails;
  beforeEach(inject(function (_emails_) {
    emails = _emails_;
  }));

  it('should do something', function () {
    expect(!!emails).toBe(true);
  });

});
