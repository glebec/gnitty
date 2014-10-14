'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StatsSchema = new Schema({
  date: Date,
  user: {
    _id: String
    },
  email: {
    date: Date,
    subject: String,
    sender: String,
    recip: String
  },
  sentiment: {},
  keywords: [{
    relevance: Number,
    text: String
  }],
  concepts: {},
  active: Boolean
});

module.exports = mongoose.model('Stats', StatsSchema);