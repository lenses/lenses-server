'use strict';

var _ = require('lodash');
var Lens = require('./lens.model');

// Get list of lenss
exports.index = function(req, res) {
  Lens.find(function (err, lenss) {
    if(err) { return handleError(res, err); }
    return res.json(200, lenss);
  });
};

// Get a single lens
exports.show = function(req, res) {
  Lens.findById(req.params.id, function (err, lens) {
    if(err) { return handleError(res, err); }
    if(!lens) { return res.send(404); }
    return res.json(lens);
  });
};

// Creates a new lens in the DB.
exports.create = function(req, res) {
  Lens.create(req.body, function(err, lens) {
    if(err) { return handleError(res, err); }
    return res.json(201, lens);
  });
};

// Updates an existing lens in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Lens.findById(req.params.id, function (err, lens) {
    if (err) { return handleError(res, err); }
    if(!lens) { return res.send(404); }
    var updated = _.merge(lens, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, lens);
    });
  });
};

// Deletes a lens from the DB.
exports.destroy = function(req, res) {
  Lens.findById(req.params.id, function (err, lens) {
    if(err) { return handleError(res, err); }
    if(!lens) { return res.send(404); }
    lens.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}