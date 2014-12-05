'use strict';

/*--------------------------------------------------------------------
A service to handle Gmail API logic. Specialized methods for external
consumption are gAPI.start(), which returns a promise for authorized
Gmail access, and gAPI.collectEmails(), which returns a promise for an
emaildata object (each key is a UID, each value a parsed email object).
That promise also sends notifications counting emails fetched so far.
----------------------------------------------------------------------*/

angular.module('gnittyApp')
  .service('gAPI', function ($http, $q, $log, $timeout, b64) {

    // TODO: reference CLIENT_ID key from local.env
    // `gapi` object is loaded in index.html script header.
    // 'me' is a special user string indicating the authenticated user.
    // BATCH_SIZE is limited by Google's server to 100.
    var _gAPI      = this,
        CLIENT_ID  = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES     = ['profile','https://www.googleapis.com/auth/gmail.readonly'],
        USER       = 'me',
        MSG_LIMIT  = 1000,
        BATCH_SIZE = 100;

    // A controller-ready trigger for enabling further gAPI calls.
    // Returns a promise for authorized Gmail library client access.
    this.start = function () {
      return authInitCheck.then( function checkTime (expireDate) {
        if (new Date() < expireDate) return _gAPI.loadGmail();
        else return _gAPI.getAuth().then( _gAPI.loadGmail );
      });
    };

    /*-------------------------------------------------
    Authorization, initiation, and user-centric methods
    -------------------------------------------------*/

    // On instantiation, do an immediate-mode check in case of existing access.
    // Terrible hack: $timeout to deal with slow external script load issue.
    var authInitCheck = $timeout( function init () {
      return _gAPI.getAuth(true);
    }, 500);

    // Generic auth method. Returns promise for an expiration date.
    this.getAuth = function getAuth (immediate) {
      immediate = !!immediate || false;
      var authDeferral = $q.defer();
      gapi.auth.authorize({
        'client_id': CLIENT_ID,
        'scope': SCOPES,
        'immediate': immediate,
      }, function handleAuth (authResult) {
        if ( authResult && !authResult.error ) {
          $log.debug( 'Authorized.', authResult );
          authDeferral.resolve( new Date(+authResult.expires_at * 1000) );
        } else {
          $log.warn( 'Unauthorized.', authResult );
          authDeferral.resolve( new Date() );
        }
      });
      return authDeferral.promise;
    };

    // Assumes authorized access via getAuth above. Returns a promise.
    this.loadGmail = function loadGmail () {
      return gapi.client.load( 'gmail', 'v1' );
    };


    /*----------------------------------------------------------------
    Gmail-specific actions (convenience methods definded further down)
    ----------------------------------------------------------------*/

    // Assumes Gmail API loaded via loadGmail above.
    // Fetches message IDs, then batch requests actual messages,
    // then parses them. Returns a promise that resolves to emaildata object.
    // TODO: insert a timeout checker to reject the collection.
    this.collectEmails = function collectEmails () {
      var emailDeferral = $q.defer(),
          emailData = {},
          requestedNum = 0,
          receivedNum = 0,
          parsedNum = 0;

      startCollecting();
      return emailDeferral.promise;

      // Main collection chain trigger. Will be called per-batch.
      function startCollecting (fromPage ) {
        getNextList ( fromPage )
        .then( startBatch )
        .then( parseAndSave, function rejectIt (err) {
          emailDeferral.reject(err);
        });
        // for some reason .catch breaks here. :-/
      }

      // Get promise for a list of message IDs, optionally from a given page.
      function getNextList (fromPage) {
        $log.debug( '△  Requesting list of emails' );
        return _gAPI.requestMessageIds( fromPage );
      }

      // Handler for successful response to message ID list request.
      function startBatch (listResponse) {
        $log.debug( '▽⬆ Received new list of emails; fetching.');
        requestedNum += BATCH_SIZE;
        // Start another message ID list request if needed.
        if ( requestedNum < MSG_LIMIT && listResponse.result.nextPageToken ) {
          startCollecting( listResponse.result.nextPageToken );
        }
        // …in the meantime, begin fetching actual messages.
        return _gAPI.batchRequest( listResponse.result.messages );
      }

      // Handler for successful response to batched messages request.
      function parseAndSave (batchResponse) {
        $log.debug( '─⬇─────────────\nFetched emails; now parsing.' );
        var responses = batchResponse.result;
        receivedNum += BATCH_SIZE;
        for ( var id in responses ) {
          var parsed = _gAPI.parseMessage( responses[id].result );
          if ( parsed ) {
            parsedNum++;
            emailData[id] = parsed;
          }
        }
        // Send progress updates.
        emailDeferral.notify( parsedNum / MSG_LIMIT );
        $log.debug( parsedNum + ' total parsed & stored.\n￣￣￣￣￣￣￣￣￣￣' );
        // If this is the last batch, resolve the master promise.
        if ( receivedNum >= MSG_LIMIT ) emailDeferral.resolve( emailData );
      }

    };


    /*----------------------------------------------------------------
    Convenience methods for the main collection function above.
    ----------------------------------------------------------------*/

    // Batch builder, specific to message requests based on IDs.
    this.batchRequest = function batchRequest (messages) {
      var batch = gapi.client.newBatch();
      for (var i = 0, len = messages.length; i < len; i++) {
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
      // console.log("gmail object before parse:", gmailObj.payload)
      function getHeaders (gmailObj) {
        // Headers delivered as array of objs w 'name' and 'val' keys;
        // converting to a single hash with name:val properties.
        // Collision doesn't matter as we only use unique from/to/etc.
        function convertOne (outputObj, header) {
          outputObj[ header.name ] = header.value;
          return outputObj;
        }
        return gmailObj.payload.headers.reduce( convertOne, {} );
      }
      var headers    = getHeaders( gmailObj );
      parsed.from    = headers.From;
      parsed.to      = headers.To;
      parsed.cc      = headers.Cc;
      parsed.subject = headers.Subject;
      parsed.date    = new Date( headers.Date );
      // Directly-accessible values:
      parsed.id      = gmailObj.id;
      parsed.labels  = gmailObj.labelIds || [];
      parsed.size    = gmailObj.sizeEstimate;
      // Find the actual message body in base-64 plaintext, depending on MIME:
      function getB64text () {
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
          default:
            $log.warn( raw.mimeType + ' body currently ignored' );
            return '';
        }
      }
      // Convert to UTF-8
      parsed.plain = b64.decode( getB64text() );
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
    // Response's .result property is JSON data.
    this.requestMessageById = function requestMessageById (id) {
      return gapi.client.gmail.users.messages.get({
        'userId' : USER,
        'id' : id
      });
    };

    // Build a GAPI request for message IDs. Thread ids &c. ignored.
    // Response has .result.messages, each message has .id.
    // 'q' query field uses gmail search box syntax.
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

  });
