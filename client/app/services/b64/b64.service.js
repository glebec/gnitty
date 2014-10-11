// Base 64 decoder (e.g. for email message bodies).
// Takes a b64 string and returns plaintext.
// Method to call is b64.decode()

'use strict';

angular.module('gnittyApp')
  .service('b64', function() {

    // string replacement for url-safe decoding as per gmail API docs
    // decodeURI + deprecated escape is a hacky way to do UTF-8 conversion
    this.decode = function (str) {
      str = str.replace(/_/g, '/').replace(/-/g, '+');
      return decodeURIComponent(escape(whichMethod(str)));
    };

    // native is only supported in newer browsers, otherwise use script below
    function whichMethod (str) {
      return ( typeof window && window.atob ) ?
        window.atob(str) :
        base64decode(str);
    }

    // client-side script from http://phpjs.org/functions/base64_decode/
    // original by: Tyler Akins (http://rumkin.com)
    // used if no nativa atob() function
    function base64decode(data) {
      var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
      var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        dec = '',
        tmpArr = [];
      if (!data) {
        return data;
      }
      data += '';
      do {
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));
        bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
        o1 = bits >> 16 & 0xff;
        o2 = bits >> 8 & 0xff;
        o3 = bits & 0xff;
        if (h3 == 64) {
          tmpArr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
          tmpArr[ac++] = String.fromCharCode(o1, o2);
        } else {
          tmpArr[ac++] = String.fromCharCode(o1, o2, o3);
        }
      } while (i < data.length);
      dec = tmpArr.join('');
      return dec.replace(/\0+$/, '');
    }

  });
