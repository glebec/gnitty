'use strict';

var _ = require('lodash');
var Google = require('./google.model');

// Get list of googles
exports.index = function(req, res) {
  Google.find(function (err, googles) {
    if(err) { return handleError(res, err); }
    return res.json(200, googles);
  });
};

// Get a single google
exports.show = function(req, res) {
  Google.findById(req.params.id, function (err, google) {
    if(err) { return handleError(res, err); }
    if(!google) { return res.send(404); }
    return res.json(google);
  });
};

// Creates a new google in the DB.
exports.create = function(req, res) {
  Google.create(req.body, function(err, google) {
    if(err) { return handleError(res, err); }
    return res.json(201, google);
  });
};

// Updates an existing google in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Google.findById(req.params.id, function (err, google) {
    if (err) { return handleError(res, err); }
    if(!google) { return res.send(404); }
    var updated = _.merge(google, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, google);
    });
  });
};

// Deletes a google from the DB.
exports.destroy = function(req, res) {
  Google.findById(req.params.id, function (err, google) {
    if(err) { return handleError(res, err); }
    if(!google) { return res.send(404); }
    google.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}