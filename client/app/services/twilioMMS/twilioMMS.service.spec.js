'use strict';

describe('Service: twilioMMS', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var twilioMMS;
  beforeEach(inject(function (_twilioMMS_) {
    twilioMMS = _twilioMMS_;
  }));

  it('should do something', function () {
    expect(!!twilioMMS).toBe(true);
  });

});
