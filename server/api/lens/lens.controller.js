'use strict';

var _ = require('lodash');
var Lens = require('./lens.model');
var User = require('../user/user.model');

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
  if(req.user) {
    //if user is logged in set user as owner of the lens 
    req.body.user = req.user;

    createLens(req.body);

  }
  else {
    //make anonymous user the owner
    User.findOne({defaultUser: true}, function(err, user) {

        if(err) { return handleError(res, err); }
        req.body.user = user;

        var lensesCookie = req.cookies.lenses; //TODO signed cookies?

        if(!lensesCookie) {

          var token;
          require('crypto').randomBytes(16, function(ex, buf) {
            token = buf.toString('hex');
            console.log('gen token', token);
            res.cookie('lenses', token, { expires: new Date(Date.now() + 900000)});
            req.body.cookieToken = token;

            createLens(req.body);

          });
        }
        else {
          console.log('lensescookie', lensesCookie);
          req.body.cookieToken = lensesCookie;

          createLens(req.body);
        }


    });
  }

  function createLens(mylens) {
      Lens.create(req.body, function(err, mylens) {
        if(err) { return handleError(res, err); }
        return res.json(201, mylens);
  });

  }
};

// Updates an existing lens in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  if(req.body.__v || req.body.__v === 0) { delete req.body.__v; } // Version key should not be hardcoded and is updated interally. MongoDB will not allow it to be set manually, so remove it from data.

  // findOneAndUpdate updates non-string attributes properly, whereas findById was not saving those values to the DB.
  // Mongoose documentation: http://mongoosejs.com/docs/api.html#model_Model.findOneAndUpdate
  Lens.findOneAndUpdate({_id: req.params.id}, req.body, {upsert: true}, function(err, lens){
    if (err) { console.log(err); return handleError(res, err); }
    return res.json(200, lens);
  });

  // Removed because it was not updating non-string fields, like finalResult.
  //   Lens.findById(req.params.id, function (err, lens) {
  //     if (err) { return handleError(res, err); }
  //     if(!lens) { return res.send(404); }
  //     var updated = _.merge(lens, req.body);
  //     updated.save(function (err) {  
  //       if (err) { return handleError(res, err); }
  //       return res.json(200, lens);
  //     });
  //   });
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