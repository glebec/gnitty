'use strict';

angular.module('gnittyApp')
  .service('gAPI', ['$http', '$rootScope', '$q', 'b64', function ($http, $rootScope, $q, b64) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // TODO: reference CLIENT_ID key from local.env
    // gapi object is loaded in index.html script header from external resource
    // 'me' is a special user string indicating the authenticated user
    var _thisService = this,
        CLIENT_ID = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES   = ['https://www.googleapis.com/auth/gmail.readonly'],
        USER     = 'me',
        deferred = $q.defer();

    // runs on main controller load to initialize, prevent popup blockers, etc.
    this.handleClientLoad = function() {
      gapi.auth.init(function() {});
      // window.setTimeout(checkAuth, 1);
    };

    // attempts authorization.
    // called by the controller; auth takes params and a callback.
    // returns a deferred promise to handle async loading.
    this.login = function () {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
        }, this.handleAuthResult);
      return deferred.promise;
    };

    // after login triggers, auth attempt result passes to this callback.
    this.handleAuthResult = function (authResult) {
      if (authResult && !authResult.error) {
        // access token retrieved; can send requests to API
        // demo: fetch user's email address
        var data = {};
        gapi.client.load('oauth2', 'v2', function() {
          var request = gapi.client.oauth2.userinfo.get();
          request.execute( function (resp) {
            console.log('authorized user info:', resp);
            data.email = resp.email;
            deferred.resolve(data);
          });
        });
      } else {
        deferred.reject('error');
      }
    };

    // TODO: make this deferred; enable immediate mode without breaking
    this.checkAuth = function () {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
      }, this.collectEmails);
    };

    // Initiate GMail client request for messages
    this.collectEmails = function (authResult) {
      if (authResult && !authResult.error) {
        // Access token has been successfully retrieved,
        // requests can be sent to the API.
        gapi.client.load('gmail', 'v1', function () {
          _thisService.onMessages( function (resp) {
            console.log('response object:', resp);
            var messages = resp.messages;
            console.log('showing ' + messages.length + ' message objects:');
            for (var i = 0; i < messages.length; i++) {
              var request = gapi.client.gmail.users.messages.get({
                'userId': USER,
                'id': messages[i].id
              });
              request.execute(_thisService.logMessage);
            }

          });
        });
      } else {
        // If no authorization token is found (e.g. third-party cookie blocker)
        console.log('no token retrieved', authResult);
      }
    };

    // execute a callback on the messages request. Response has .messages prop.
    this.onMessages = function (callback) {
      var request = gapi.client.gmail.users.messages.list({
        'userId': USER
      });
      request.execute(callback);
    };

    // logs message info out for dev checking
    this.logMessage = function (gmailObj) {
      var parsed = _thisService.parseMessage(gmailObj);
      // console.log( gmailObj );
      console.log( parsed );
      console.log(
        '=======\n'+
        'New message\n'+
        'ID: ' + parsed.id + '\n'+
        'Size: ' + parsed.size + '\n'+
        'Subject: ' + parsed.subject + '\n'+
        'From: ' + parsed.from + '\n'+
        'Date: ' + parsed.date + '\n'+
        '======='+
        '\n\n>>>>>' + parsed.plain + '<<<<<\n'
      );
    };

    // convert a gapi-delivered email object to a more js-convenient form
    this.parseMessage = function parseMessage (gmailObj) {
      // console.log( gmailObj );
      var parsed = {};
      // header-based values require conversion for easy access.
      function getHeaders (gmailObj) {
        // headers delivered as unsorted array of objs w 'name' and 'val' keys.
        // converting to a single hash with name:val properties.
        // collision doesn't matter as we only need unique from/to/etc.
        function convert (output, header) {
          output[ header.name ] = header.value;
          return output;
        }
        return gmailObj.payload.headers.reduce( convert, {} );
      }
      var headers    = getHeaders( gmailObj );
      parsed.from    = headers.From;
      parsed.date    = new Date( headers.Date );
      parsed.subject = headers.Subject;
      // directly-accessible values:
      parsed.id      = gmailObj.id;
      parsed.size    = gmailObj.sizeEstimate;
      parsed.labels  = gmailObj.labelIds;
      // Get the actual message body as base-64 plaintext:
      function b64text () {
        switch ( gmailObj.payload.mimeType ) {
          case 'text/plain':
            return gmailObj.payload.body.data;
          case 'multipart/alternative':
            return gmailObj.payload.parts[0].body.data;
          case 'multipart/mixed':
            return gmailObj.payload.parts[0].parts[0].body.data;
          default: return '';
        }
      }
      // convert b64text to UTF-8
      parsed.plain = b64.decode( b64text() );
      // email parsing complete
      return parsed;
    };

  }]);
