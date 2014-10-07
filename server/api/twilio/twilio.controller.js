'use strict';
var _ = require('lodash');
var Twilio = require('./twilio.model');
var accountSid = 'ACb45bf3f465bc4874627b694c7d0d0d84';
var authToken = 'eacd2daaf404735d2a7f43c8f73a6626';
var client = require('twilio')(accountSid, authToken);

exports.send = function(req, res) {
  client.messages.create({
      body: "Did you know that you sent 47 emails on June 6, 1999? View more info here.",
      to: "+15402557850",
      from: "+15403242991"
      // mediaUrl: "http://www.example.com/hearts.png"
  }, function(error, message) {
      if (error) {
        console.log(error.message);
      }
  });
  // .success(function() {
  //   console.log("message sent");
  //   })
  };

function handleError(res, err) {
  return res.send(500, err);
}