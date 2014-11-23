'use strict';

var AlchemyAPI = require('alchemy-api');
var config = require('./../../config/environment/index.js')
var alchemyApiKey = config.alchemy.apiKey;
var alchemy = new AlchemyAPI(alchemyApiKey);

exports.sentiment = function (req,res) {
  alchemy.sentiment( req.body.text, {}, function (err, response) {
    if (err) throw err;
    res.json( response.docSentiment);
  });
};

exports.keywords = function (req, res) {
  alchemy.keywords( req.body.text, {}, function (err, response) {
    if (err) throw err;
    res.json( response.keywords );
  });
};

exports.concepts = function (req, res) {
  alchemy.concepts( req.body.text, {}, function (err, response) {
    if (err) throw err;
    res.json( response.concepts );
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
