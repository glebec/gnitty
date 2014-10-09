'use strict';

describe('Service: b64', function () {

  // load the service's module
  beforeEach(module('gnittyApp'));

  // instantiate service
  var b64;
  beforeEach(inject(function (_b64_) {
    b64 = _b64_;
  }));

  it('should decode a b64 email body', function () {
    var encoded = 'VGhpcyBpcyBhIHN0cmluZyB3aXRoIHB1bmN0dWF0aW9uICIgISAtIF8gLyAnIGNoYXJzLg==';
    var plaintext = 'This is a string with punctuation " ! - _ / \' chars.';
    expect(b64.decode(encoded)).toEqual(plaintext);
  });

});
