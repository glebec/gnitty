'use strict';

describe('Service: postAlchemy', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var postAlchemy;
  beforeEach(inject(function (_postAlchemy_) {
    postAlchemy = _postAlchemy_;
  }));

  it('should do something', function () {
    expect(!!postAlchemy).toBe(true);
  });

});
