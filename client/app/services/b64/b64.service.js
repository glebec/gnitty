// Base 64 decoder (e.g. for email message bodies).
// Takes a b64 string and returns plaintext.

'use strict';

angular.module('gnittyApp')
  .service('b64', function () {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.decode = function (str, urlsafe) {
      urlsafe = urlsafe || true;
      if (urlsafe) str = str.replace(/_/g, '/').replace(/-/g, '+');
      if (typeof window) return decodeURIComponent(escape(window.atob(str)));
      else return new Buffer('SGVsbG8gV29ybGQ=', 'base64').toString('utf8');
    };
  });
