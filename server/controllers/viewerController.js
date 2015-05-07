'use strict';

var Lens = require('../api/lens/lens.model');

exports.index = function(req, res) {
  var pageLens;
  if(req.params.id) {
	  Lens.findById(req.params.id, function (err, lens) {
	    if(err) { /*return handleError(res, err);*/ console.log(err); }
	    if(!lens) { return res.send(404); }

      var elementName = lens.finalResult ? lens.finalResult.componentName : "",
          elementDataObj = lens.finalResult ? lens.finalResult.componentState : {};
         
      res.render('viewer.html', {
        lens: lens,
        title: lens.title,
        elementName: elementName,
        elementData: elementDataObj
      });

	  });
  }
  		


};