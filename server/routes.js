/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/lenses', require('./api/lens'));
  app.use('/api/users', require('./api/user'));

  //route for viewer
  //app.get('/viewer', require('./controllers/viewer.js'));
  var viewerController = require('./controllers/viewerController');
  app.get('/viewer/:id', viewerController.index);

//  app.use('/viewer', require('./controllers/viewer'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);


  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      console.log('other');
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
