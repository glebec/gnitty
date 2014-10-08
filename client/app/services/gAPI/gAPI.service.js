'use strict';

angular.module('gnittyApp')
  .service('gAPI', ['$http', '$rootScope', '$q', function ($http, $rootScope, $q) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // TODO: reference CLIENT_ID key from local.env
    // gapi object is loaded in index.html script header from external resource
    var _this = this,
        CLIENT_ID = '626085391000-vbd4dkua39odasb6sjrq0tn3es8uboet.apps.googleusercontent.com',
        SCOPES   = ['https://www.googleapis.com/auth/gmail.readonly'],
        USER     = 'me',
        deferred = $q.defer();

    // runs on main controller load to initialize, prevent popup blockers, etc.
    // TODO: fix this
    // this.handleClientLoad = function() {
    //   gapi.client.setApiKey(apiKey);
    //   gapi.auth.init(function() {});
    //   window.setTimeout(checkAuth, 1);
    // };

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
            console.log('auth response:', resp);
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
      }, this.handleAuthResultOld);
    };

    // this.handleAuthClick = function(event) {
    //   gapi.auth.authorize({
    //     'client_id': CLIENT_ID,
    //     'scope': SCOPES,
    //     'immediate': false,
    //   }, this.handleAuthResult);
    //   return false;
    // };

    this.handleAuthResultOld = function (authResult) {
      if (authResult && !authResult.error) {
        // Access token has been successfully retrieved, requests can be sent to the API.
        gapi.client.load('gmail', 'v1', function() {
          _this.listThreads(USER, function(resp) {
            var threads = resp.threads;
            console.log(threads);
            for (var i = 0; i < threads.length; i++) {
              var thread = threads[i];
              console.log(i);
              console.log(thread.id);
              console.log(thread);
            }
          });
        });
      } else {
        console.log('no token retrieved', authResult);
      }
    };

    // list user threads from earlier demo
    this.listThreads = function (userId, callback) {
      var request = gapi.client.gmail.users.threads.list({
        'userId': userId
      });
      request.execute(callback);
    };

  }]);
