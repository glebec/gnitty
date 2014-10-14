'use strict';

var index = require('../../config/environment/index.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AlchemySchema = new Schema({
  apikey: String,
  text: String,
  outputMode: String
});

module.exports = mongoose.model('Alchemy', AlchemySchema);