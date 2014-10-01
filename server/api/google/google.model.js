'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GoogleSchema = new Schema({
  "id": string,
  "threadId": string,
  // "labelIds": [
  //   string
  // ],
  // "snippet": string,
  // "historyId": unsigned long,
  // "payload": {
  //   "partId": string,
  //   "mimeType": string,
  //   "filename": string,
  //   "headers": [
  //     {
  //       "name": string,
  //       "value": string
  //     }
  //   ],
  //   "body": users.messages.attachments Resource,
  //   "parts": [
  //     (MessagePart)
  //   ]
  // },
  // "sizeEstimate": integer,
  "raw": bytes
});

module.exports = mongoose.model('Google', GoogleSchema);