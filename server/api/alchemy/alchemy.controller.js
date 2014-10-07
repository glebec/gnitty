'use strict';

var _ = require('lodash');
var AlchemyAPI = require('alchemy-api');
var key = require('./../../config/environment/index.js')
var alchemyApiKey = key.alchemy.apiKey;
var alchemy = new AlchemyAPI(alchemyApiKey);

exports.sentiment = function(req,res) {
  alchemy.sentiment(req.body.text, {}, function(err, response) {
    console.log(req.body.text);
    if (err) throw err;
    // See http://www.alchemyapi.com/api/sentiment/htmlc.html for format of returned object
    var sentiment = response.docSentiment;
    console.log(sentiment);
    res.json(sentiment);
    // Do something with data
  });
};

exports.keywords = function(req, res) {
  alchemy.keywords(req.body.text, {}, function(err, response) {
    if (err) throw err;
    var keywords = {
      k: response.keywords
      };
    console.log(keywords);
    res.json(keywords);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}