'use strict';

/*-------------------------------------------------------------------
A service to handle Gmail API logic. A prebuilt method for controller
consumption is gAPI.fetch(), which will inject parsed emails into the
'emails' service (in an emails.data object). Todo: make more generic.
-------------------------------------------------------------------*/

angular.module('gnittyApp')
  .service('gAPI', ['$http', '$rootScope', '$q', 'b64', 'emails', function ($http, $rootScope, $q, b64, emails) {

    // TODO: reference CLIENT_ID key from local.env
    // gapi object is loaded in index.html script header.
    // 'me' is a special user string indicating the authenticated user.
    // BATCH_SIZE should be 100 or lower.
    var _gAPI      = this,
        CLIENT_ID  = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES     = ['https://www.googleapis.com/auth/gmail.readonly'],
        USER       = 'me',
        MSG_LIMIT  = 1000,
        BATCH_SIZE = 100,
        deferred   = $q.defer();

    // A simple controller-ready trigger for collecting emails.
    // If immediate mode worked, this would skip the login window flash.
    // TODO: make this deferred; enable immediate mode without breaking.
    // Result: loads parsed emails into the emails.data service object.
    this.fetch = function () {
      _gAPI.checkAuthAndExecute(_gAPI.collectEmails);
      return _gAPI;
    };


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

    // Generic authorization method grants Gmail API access to a callback.
    this.checkAuthAndExecute = function checkAuthAndExecute (callback) {
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
      }, function gmailClientLoader (authResult) {
        if (authResult && !authResult.error) {
          // Access token retrieved, can send API requests in callback.
          gapi.client.load( 'gmail', 'v1', callback );
        } else {
          console.log( 'No token retrieved: ', authResult );
        }
      });
    };

    /*----------------------------------------------------------------
    Gmail-specific actions (convenience methods definded further down)
    ----------------------------------------------------------------*/

    // To be called from the generic checkAuthAndExecute method above.
    // Fetches message IDs, then batch requests actual messages,
    // then parses them and sends them to the injected 'emails' service.
    this.collectEmails = function collectEmails () {
      // asynchronous counters for limiting and logging
      var getCount = 0;
      var doneCount = 0;

      // THE SPICE MUST FLOW
      startCollecting();

      // Get a list of message IDs, optionally starting from a given page
      function startCollecting ( fromPage ) {
        console.log( 'Getting list of emails from #' + getCount );
        _gAPI.requestMessageIds( fromPage )
          .then( listSuccess, listFail );
      }

      // handler for successful response to message ID list request
      function listSuccess (response) {
        // recursive call to fire off more message ID list requests if needed
        getCount += BATCH_SIZE;
        if ( getCount < MSG_LIMIT && response.result.nextPageToken ) {
          startCollecting( response.result.nextPageToken );
        }
        // in the meantime, begin fetching actual messages for this list
        console.log( '>>>>> Received new list of emails; fetching.');
        _gAPI.batchRequest( response.result.messages )
          .then( batchSuccess, batchFail );
      }

      // handler for successful response to batched messages request
      function batchSuccess (response) {
        console.log( '========\nFetched emails; now parsing.' );
        var responses = response.result;
        // get gmails, parse and store in 'emails' AJS service
        for ( var id in responses ) {
          var gmailObj = responses[id].result;
          var parsed = _gAPI.parseMessage( gmailObj );
          if ( parsed ) {
            doneCount++;
            emails.data[id] = parsed;
          }
        }
        console.log( doneCount + ' total parsed & stored.\n========' );
      }

      // error response handlers
      function listFail (reason) {
        console.log( 'Message IDs request failed: ', reason );
      }
      function batchFail (reason) {
        console.log( 'Batch error: ', reason );
      }
    };

    // Batch builder, specific to message requests based on IDs.
    // Not generic enough to qualify as a convenience method, abstracted
    // out for clarity's sake.
    this.batchRequest = function batchRequest (messages) {
      var batch = gapi.client.newBatch();
      for (var i = 0; i < messages.length; i++) {
        var id = messages[i].id;
        var request = _gAPI.requestMessageById( id );
        batch.add( request, {id: id} );
      }
      return batch;
    };

    // Convert a gapi-delivered email object to a simpler form.
    this.parseMessage = function parseMessage (gmailObj) {
      var parsed = {};
      if ( !gmailObj.payload ) return null;
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
            console.log( 'Gnitty ignores body of ' + raw.mimeType );
            return '';
          }
        }
      }
      // Convert to UTF-8 using injected b64 front-end service:
      parsed.plain = b64.decode( b64text() );
      // Email parsing complete.
      return parsed;
    };


    /*-------------------------------------------------------
    Generic methods for building requests or logging objects.
    Reqs can be run via .execute(callback) or .then(handler).
    -------------------------------------------------------*/

    // Build a GAPI single-message request (by ID) to be executed later.
    // Response's .result property is a JSON tree (which I call 'gmailObj').
    this.requestMessageById = function requestMessageById (id) {
      return gapi.client.gmail.users.messages.get({
        'userId' : USER,
        'id' : id
      });
    };

    // Build a partial GAPI request for message IDs. Thread ids &c. ignored.
    // Response has .result.messages, each message has .id.
    // Server seems to hard-code maxResults at 100, ignores higher.
    // 'q' query field works like gmail search box; filtering out chats
    this.requestMessageIds = function requestMessageIds (page) {
      var params = {
        'userId' : USER,
        'maxResults' : BATCH_SIZE,
        'fields' : 'nextPageToken,messages/id',
        'q' : '-is:chat'
      };
      if ( page ) params.pageToken = page;
      return gapi.client.gmail.users.messages.list( params );
    };

    // Array splitter for batching. Returns new arr of 'size'-long arrays.
    function splitArray (arr, size) {
      var newArr = [],
          end = size;
      for (var start = 0; start < arr.length; start += size) {
        newArr.push( arr.slice( start, end ) );
        end += size;
      }
      return newArr;
    }

    // Message info logger for dev checking.
    function logMessage (gmailObj) {
      var parsed = _gAPI.parseMessage(gmailObj);
      console.log( gmailObj, parsed );
    }

  }]);
