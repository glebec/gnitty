'use strict';

/*--------------------------------------------------------------------
A service to handle Gmail API logic. A prebuilt method for external
consumption is gAPI.fetch(), which will return a promise for an
emaildata object (each key is a UID, each value a parsed email object).
That promise also sends notifications counting emails fetched so far.
----------------------------------------------------------------------*/

angular.module('gnittyApp')
  .service('gAPI', ['$http', '$rootScope', '$q', 'b64', function ($http, $rootScope, $q, b64) {

    // TODO: reference CLIENT_ID key from local.env
    // gapi object is loaded in index.html script header.
    // 'me' is a special user string indicating the authenticated user.
    // BATCH_SIZE should be 100 or lower; server limits to 100 anyway.
    var _gAPI      = this,
        CLIENT_ID  = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES     = ['profile','https://www.googleapis.com/auth/gmail.readonly'],
        USER       = 'me',
        MSG_LIMIT  = 1000,
        BATCH_SIZE = 100;

    // A controller-ready trigger for collecting emails.
    // If immediate mode worked, this would skip the login window flash.
    // TODO: enable immediate mode without breaking.
    // Result: returns promise for emaildata object, for external consumption.
    this.fetch = function () {
      function logErr (err) { console.log( err ); }
      return _gAPI.checkAuth()
        .then(_gAPI.loadGmail)
        .then(_gAPI.collectEmails, logErr);
    };


    /*-------------------------------------------------
    Authorization, initiation, and user-centric methods
    -------------------------------------------------*/

    // Prevents popup blockers, etc. TODO: make this work in Safari etc.
    this.handleClientLoad = function() {
      gapi.auth.init(function() {});
      // window.setTimeout(checkAuth, 1);
    };

    // Generic authorization method.
    // Returns a promise that resolves to the auth token on success.
    this.checkAuth = function checkAuth () {
      var authDeferral = $q.defer();
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': false,
      }, function handleAuth (authResult) {
        if ( authResult && !authResult.error ) {
          authDeferral.resolve( authResult );
        } else {
          authDeferral.reject( authResult );
        }
      });
      return authDeferral.promise;
    };


    /*----------------------------------------------------------------
    Gmail-specific actions (convenience methods definded further down)
    ----------------------------------------------------------------*/

    // Assumes authorized access via checkAuth above. Returns a promise.
    this.loadGmail = function loadGmail () {
      return gapi.client.load( 'gmail', 'v1' );
    };

    // Assumes Gmail API loaded via loadGmail above.
    // Fetches message IDs, then batch requests actual messages,
    // then parses them. Returns a promise that resolves to emaildata object.
    this.collectEmails = function collectEmails () {
      // Return values: a master promise, and data to resolve it with.
      var emailDeferral = $q.defer();
      var emailData = {};
      // asynchronous counters for limiting and notifying
      var getCount = 0;
      var doneCount = 0;

      // Here we go!
      startCollecting();
      return emailDeferral.promise;

      // Main collection trigger chains promises; will be called per-batch.
      function startCollecting ( fromPage ) {
        getNextList ( fromPage )
          .then( startBatch, listFail )
          .then( parseAndSave, batchFail );
      }

      // Get a list of message IDs, optionally starting from a given page.
      // Returns a promise.
      function getNextList ( fromPage ) {
        console.log( 'Requesting list of emails >>>>>>' );
        return _gAPI.requestMessageIds( fromPage );
      }

      // Handler for successful response to message ID list request.
      // Returns a promise.
      function startBatch (listResponse) {
        console.log( '>>>>>> Received new list of emails; fetching.');
        getCount += BATCH_SIZE;
        // Call to fire off more message ID list requests if needed.
        if ( getCount < MSG_LIMIT && listResponse.result.nextPageToken ) {
          startCollecting( listResponse.result.nextPageToken );
        }
        // …in the meantime, begin fetching actual messages for this list:
        return _gAPI.batchRequest( listResponse.result.messages );
      }

      // Handler for successful response to batched messages request.
      // Notifies and resolves the master promise.
      function parseAndSave (batchResponse) {
        console.log( '________\nFetched emails; now parsing.' );
        var responses = batchResponse.result;
        // get gmails, parse and store in 'emails' AJS service
        for ( var id in responses ) {
          var gmailObj = responses[id].result;
          var parsed = _gAPI.parseMessage( gmailObj );
          if ( parsed ) {
            doneCount++;
            emailData[id] = parsed;
          }
        }
        // Send progress updates to the master promise.
        emailDeferral.notify( doneCount );
        console.log( doneCount + ' total parsed & stored.\n^^^^^^^^' );
        // If this is the last batch, resolve the master promise.
        if ( getCount >= MSG_LIMIT ) emailDeferral.resolve( emailData );
      }

      // Error response handlers.
      function listFail (why) {
        console.log( 'Message IDs req. failed: ', why );
        emailDeferral.reject( why );
      }
      function batchFail (why) {
        console.log( 'Batch error: ', why );
        emailDeferral.reject( why );
      }
    };


    /*----------------------------------------------------------------
    Convenience methods for the main collection function above.
    ----------------------------------------------------------------*/

    // Batch builder, specific to message requests based on IDs.
    // Abstracted out for clarity's sake. Returns a promise.
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
            console.log( raw.mimeType + ' body currently ignored' );
            return '';
          }
        }
      }
      // Convert to UTF-8 using injected b64 front-end service:
      parsed.plain = b64.decode( b64text() );
      // Only use lines NOT beginning with '>' (i.e., CCs in replies) or \n
      var notCruft = /^[^>\n].*/gm;
      parsed.plain = parsed.plain.match( notCruft );
      parsed.plain = parsed.plain ? parsed.plain.join() : '';
      // Email parsing complete.
      return parsed;
    };


    /*-------------------------------------------------------
    Generic methods for building request promises.
    Can be run via .execute(callback) or .then(handler).
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
    // 'q' query field works like gmail search box. Filtering out chats.
    this.requestMessageIds = function requestMessageIds (page, query) {
      var params = {
        'userId' : USER,
        'maxResults' : BATCH_SIZE,
        'fields' : 'nextPageToken,messages/id',
        'q' : '-is:chat -in:spam '
      };
      if ( page ) params.pageToken = page;
      if ( query ) params.q += query;
      return gapi.client.gmail.users.messages.list( params );
    };

  }]);
