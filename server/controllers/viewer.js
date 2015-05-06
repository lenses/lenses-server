'use strict';

var Lens = require('../api/lens/lens.model');


exports.index = function(req, res) {
  var pageLens;
  console.log(req.params.id);
  if(req.params.id) {
  	  console.log('looking up lens '+ req.params.id)
	  Lens.findById(req.params.id, function (err, lens) {
	    if(err) { console.log('error', err); return handleError(res, err); }
	    if(!lens) { console.log('not found'); return res.send(404); }
	    //return res.json(lens);
	    console.log('lens', lens);
	    pageLens = lens
	      /*
		  res.render(req.app.get('appPath') + '/viewer/viewer.html', {
		    title: 'a lens title'
		  });
		*/
		 
		 res.render('viewer', {
		    title: 'a lens title',
		    lens: pageLens
		  });

	  });

  }
  		


};