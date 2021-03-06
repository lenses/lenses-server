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

    // turn mongoose object to plain object so we can set editable property
    var mylens = lens.toObject();

    // make lens savable
    if(req.cookies.lenses === mylens.cookieToken) {
      mylens.editable = true;
    }
    return res.json(mylens);

  });
};

// Creates a new lens in the DB.
exports.create = function(req, res) {
  if(req.user) {
    //if user is logged in set user as owner of the lens 
    req.body.user = req.user;

    createLens(req, res);

  }
  else {
    //make anonymous user the owner
    User.findOne({defaultUser: true}, function(err, user) {

        if(err) { return handleError(res, err); }
        req.body.user = user;

        //check if a cookie token is set for anonymous user
        var lensesCookie = req.cookies.lenses; //TODO signed cookies?

        if(!lensesCookie) {

          var token;
          require('crypto').randomBytes(16, function(ex, buf) {
            token = buf.toString('hex');
            res.cookie('lenses', token, { expires: new Date(Date.now() + 30*24*60*60*100), httpOnly: true });
            req.body.cookieToken = token;

            createLens(req, res);

          });
        }
        else {
          req.body.cookieToken = lensesCookie;

          createLens(req, res);
        }


    });
  }


};

/*

 original update

+exports.update = function(req, res) {
+  if(req.body._id) { delete req.body._id; }
+  Lens.findById(req.params.id, function (err, lens) {
+    if (err) { return handleError(res, err); }
+    if(!lens) { return res.send(404); }
+    var updated = _.merge(lens, req.body);
+    updated.save(function (err) {
+      if (err) { return handleError(res, err); }
+      return res.json(200, lens);
+    });
+  });
+}
 */

// Updates an existing lens in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  //saving object sometimes causes “VersionError: No matching document found.” error. below line fixes that!!
  if(req.body.__v || req.body.__v === 0) { delete req.body.__v; } 


    Lens.findById(req.params.id, function (err, lens) {
      if (err) { return handleError(res, err); }
      if(!lens) { return res.send(404); }
      
      //original code had: var updated = _.merge(lens, req.body);
      //changed to _extend as per  https://github.com/DaftMonk/generator-angular-fullstack/issues/310
      var updated = _.extend(lens, req.body);

      // make sure updated has the structure passed by request
      if(req.body.structure) {

        updated.structure = req.body.structure;
      }

      //check if user is allowed to update the lens
      if(allowUpdate(req, lens)) {

        updated.save(function (err, savedLens) {  
          if (err) { 
            return handleError(res, err); 
          }

          return res.json(200, savedLens);
        });

      }
      else {
        console.log('doesnt own the lens, not alowed to update');
        //TODO error handling
      }

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
  console.log('!!!!!!!!!!! ERROR', err);
  return res.send(500, err);
}

function createLens(req, res) {
    //needed for forking? otherwise mongoose rewrites?
    if(req.body._id) { delete req.body._id; }

    Lens.create(req.body, function(err, mylens) {
      if(err) { return handleError(res, err); }
      console.log('id', mylens.id)

      // created lens always needs to be editable
      var mylensClone = mylens.toObject();
      mylensClone.editable = true;

      return res.json(201, mylensClone);
    });
}

function allowUpdate(req, lens) {

  // 1 user is logged in and is the owner of the lens
  //console.log(req.user, lens.user);
  if(req.user) { 
    //TODO compare user with lens.user
    return true;
  }
   
  // 2 user if anonymous but the cookieToken(s) match
  //console.log(req.cookies.lenses, lens.cookieToken);
  if(req.cookies && req.cookies.lenses === lens.cookieToken) {
    return true;
  }

  return false;

}
