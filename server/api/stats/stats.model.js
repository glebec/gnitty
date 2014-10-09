'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatsSchema = new Schema({
  date: Date,
  userName: String,
  userID: String,
  email: {
    date: Date,
    subject: String,
    sender: String,
    recip: String
  },
  sentiment: {
    score: Number,
    type: String,
    mixed: String,
  },
  keywords: [{}],
  concepts: [{}],
  active: Boolean
});

module.exports = mongoose.model('Stats', StatsSchema);