'use strict';

var _ = require('lodash');
var Stats = require('./stats.model');

// Get list of statss
exports.index = function(req, res) {
  Stats.find(function (err, statss) {
    if(err) { return handleError(res, err); }
    return res.json(200, statss);
  });
};

// Get a single stats
exports.show = function(req, res) {
  Stats.findById(req.params.id, function (err, stats) {
    if(err) { return handleError(res, err); }
    if(!stats) { return res.send(404); }
    return res.json(stats);
  });
};

// Creates a new stats in the DB.
exports.create = function(req, res) {
  Stats.create(req.body, function(err, stats) {
    if(err) { return handleError(res, err); }
    return res.json(201, stats);
  });
};

// Updates an existing stats in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Stats.findById(req.params.id, function (err, stats) {
    if (err) { return handleError(res, err); }
    if(!stats) { return res.send(404); }
    var updated = _.merge(stats, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, stats);
    });
  });
};

// Deletes a stats from the DB.
exports.destroy = function(req, res) {
  Stats.findById(req.params.id, function (err, stats) {
    if(err) { return handleError(res, err); }
    if(!stats) { return res.send(404); }
    stats.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.foruser = function(req, res){
  Stats.find({"user._id": req.params.id}, function(err, result) {
      res.json(result);
  })
}

function handleError(res, err) {
  return res.send(500, err);
}