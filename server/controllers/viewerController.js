'use strict';

var Lens = require('../api/lens/lens.model');

exports.index = function(req, res) {
  var pageLens;
  if(req.params.id) {
	  Lens.findById(req.params.id, function (err, lens) {
	    if(err) { /*return handleError(res, err);*/ console.log(err); }
	    if(!lens) { return res.send(404); }
	    pageLens = lens
	      console.log('appPath', req.app.get('appPath'));
		
		 
		 res.render('viewer.html', {
		    lens: pageLens
		  });


	  });

  }
  		


};