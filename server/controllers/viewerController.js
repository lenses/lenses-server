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

      //if component is not a viz, output json data
      if(elementName.indexOf('-viz-')<0) {
        //console.log(typeof elementDataObj, elementDataObj, elementDataObj.output);
        var output = JSON.parse(elementDataObj).output || {};
        return res.json({lensData: output});
      }    
         
      res.render('viewer.html', {
        lens: lens,
        title: lens.title,
        elementName: elementName,
        elementData: elementDataObj
      });

	  });
  }
  		


};