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

    // copy component data into lens structure
    mylens = copyComponentData(mylens);

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

      var modifiedLens = extractComponentData(updated);

      //check if user is allowed to update the lens
      if(allowUpdate(req, lens)) {

        modifiedLens.save(function (err, savedLens) {  
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

    var modifiedLens = extractComponentData(req.body);

    Lens.create(modifiedLens, function(err, mylens) {
      if(err) { return handleError(res, err); }
      console.log('id', mylens.id)

      // created lens always needs to be editable
      var mylensClone = mylens.toObject();
      mylensClone.editable = true;

      return res.json(201, mylensClone);
    });
}

function extractComponentData(lensObject) {
  
  var type = lensObject.type;

  console.log(lensObject.structure, typeof lensObject.structure);

  var structure = (typeof lensObject.structure==='string') ? JSON.parse(lensObject.structure) : lensObject.structure;


  var componentData = lensObject.componentData || [];

  if(type==='freeform') {
    var elements = structure.elements;
    console.log(elements);
    elements = elements.map(function(el) {
      if(el.output ) {
        componentData.push({data: el.output, type: 'output', componentId: el.id})
        delete el.output;
      }
      if(el.input ) {
        componentData.push({data: el.input, type: 'input', componentId: el.id})
        delete el.input;
      }
      return el;
    });

    structure.elements = elements;

  } else if (type==='linear') {

    //TODO

  }

  lensObject.structure = structure;
  lensObject.componentData = componentData;
  console.log(JSON.stringify(lensObject));

  return lensObject;
  
  //return lensObject;

}

function copyComponentData(lensObject) {

  var componentData = lensObject.componentData;


  componentData.forEach(function(item) {

    var id = item.componentId;

    var element;
    //freeform
    if(lensObject.type==='freeform') {
      element = lensObject.structure.elements.filter(function(el) {
        return el.id === id;
      })[0];

    }
    else if (type==='linear') {
      //TODO
    }

    element[item.type] = item.data;
  });
    

  lensObject.componentData = null;


  console.log('after', lensObject);



  return lensObject;

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
