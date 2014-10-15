'use strict';

angular.module('gnittyApp')
  .service('gAPI', ['$http', '$rootScope', '$q', 'b64', 'emails', function ($http, $rootScope, $q, b64, emails) {

    // TODO: reference CLIENT_ID key from local.env
    // gapi object is loaded in index.html script header from external resource
    // 'me' is a special user string indicating the authenticated user

    var _gAPI     = this,
        CLIENT_ID = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES    = ['https://www.googleapis.com/auth/gmail.readonly'],
        USER      = 'me',
        deferred  = $q.defer();


    /*-------------------------------------------------
    Authorization, initiation, and user-centric methods
    -------------------------------------------------*/

    // Prevents popup blockers, etc. TODO: make this work in Safari etc.
    this.handleClientLoad = function() {
      gapi.auth.init(function() {});
      // window.setTimeout(checkAuth, 1);
    };

    // Attempts authorization.
    // gapi.auth takes parameters and a callback.
    // Returns a deferred promise to handle async loading.
    this.login = function () {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
        }, this.handleAuthResult);
      return deferred.promise;
    };

    // After login triggers, auth attempt result passes to this callback.
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

    // Main trigger for collecting emails.
    // If immediate mode worked, this would skip the login window flash.
    // TODO: make this deferred; enable immediate mode without breaking.
    this.checkAuthThenFetch = function () {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
      }, this.collectEmails);
    };


    /*----------------------------------------------------------------
    Gmail-specific actions (convenience methods definded further down)
    ----------------------------------------------------------------*/

    // TODO: refactor heavily to separate into logical modules.
    // Currently fetches message IDs, then batch requests actual messages,
    // then parses them and sends them to the inject 'emails' service.
    this.collectEmails = function (authResult) {
      if (authResult && !authResult.error) {
        // Access token has been successfully retrieved,
        // requests can be sent to the API.
        gapi.client.load('gmail', 'v1', function () {
          _gAPI.onMessages( function (resp) {
            var messages = resp.messages;
            // batching requests to send as a single http request
            var batch = gapi.client.newBatch();
            // add message requests to batch using msg id as batch req id
            for (var i = 0; i < messages.length; i++) {
              var id = messages[i].id;
              var request = _gAPI.buildMessageReqFor( id );
              batch.add( request, {id: id} );
            }
            // execute the batch request as a promise and handle the result
            batch.then(
              function (resp) {
                var responses = resp.result;
                // get gmails, parse and store in 'emails' AJS service
                for (var id in responses) {
                  var gmailObj = responses[id].result;
                  emails.data[id] = _gAPI.parseMessage(gmailObj);
                }
                console.log('emails fetched and stored');
              },
              function (err) { console.log('batch error: ', err); }
            );
          });
        });
      } else {
        // If no authorization token is found (e.g. third-party cookie blocker)
        console.log('no token retrieved', authResult);
      }
    };

    // Convert a gapi-delivered email object to a more consistent form.
    this.parseMessage = function parseMessage (gmailObj) {
      var parsed = {};
      // Header-based values require conversion for easy access.
      function getHeaders (gmailObj) {
        // Headers delivered as unsorted array of objs w 'name' and 'val' keys;
        // converting to a single hash with name:val properties.
        // Collision doesn't matter as we only need unique from/to/etc.
        function convert (output, header) {
          output[ header.name ] = header.value;
          return output;
        }
        return gmailObj.payload.headers.reduce( convert, {} );
      }
      var headers    = getHeaders( gmailObj );
      parsed.from    = headers.From;
      parsed.subject = headers.Subject;
      parsed.date    = new Date( headers.Date );
      // Directly-accessible values:
      parsed.id      = gmailObj.id;
      parsed.labels  = gmailObj.labelIds;
      parsed.size    = gmailObj.sizeEstimate;
      // Find the actual message body in base-64 plaintext, depending on MIME:
      function b64text () {
        var raw = gmailObj.payload;
        switch ( raw.mimeType ) {
          case 'text/plain':
            return raw.body.data;
          case 'multipart/alternative':
            return raw.parts[0].body.data;
          case 'multipart/mixed':
            return raw.parts[0].parts ? raw.parts[0].parts[0].body.data : '';
          case 'multipart/related':
            return raw.parts[0].parts ? raw.parts[0].parts[0].body.data : '';
          default: {
            console.log('unhandled MIME type: ' + raw.mimeType, gmailObj);
            return '';
          }
        }
      }
      // Convert to UTF-8 using injected b64 front-end service:
      parsed.plain = b64.decode( b64text() );
      // Email parsing complete.
      return parsed;
    };


    /*----------------------------------------------------------
    Convenience methods for building requests or logging objects
    ----------------------------------------------------------*/

    // Build a GAPI single-message request (by ID) to be executed later.
    // Response's .result property is a JSON tree (which I call 'gmailObj').
    // gapi requests can be run via .execute(callback) or .then(handler).
    this.buildMessageReqFor = function (id) {
      var request = gapi.client.gmail.users.messages.get({
        'userId' : USER,
        'id' : id
      });
      return request;
    };

    // Execute a callback on a messages list request. Response has .messages.
    this.onMessages = function (callback) {
      var request = gapi.client.gmail.users.messages.list({
        'userId': USER,
        'maxResults': 50
      });
      request.execute( callback );
    };

    // Message info logger for dev checking.
    this.logMessage = function (gmailObj) {
      var parsed = _gAPI.parseMessage(gmailObj);
      console.log( gmailObj, parsed );
    };

  }]);
