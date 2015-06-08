'use strict';

var Lens = require('../api/lens/lens.model');

// Return JSON of all datasets for lens (array of arrays)
exports.index = function(req, res) {
  if(req.params.id) {
    Lens.findById(req.params.id, function (err, lens) {
      if(err) { return res.send(500, err); }
      if(!lens) { return res.send(404); }
      
      return res.json(lens.outputData);

    });
  }
};

// Return JSON of single dataset for track within a lens (array of objects)
exports.track = function(req, res) {
   if(req.params.id) {
    Lens.findById(req.params.id, function (err, lens) {
      if(err) { return res.send(500, err); }
      if(!lens) { return res.send(404); }

      var trackIndex = req.params.trackIndex;
     
      if (trackIndex && lens.outputData && lens.outputData[trackIndex]){
       return res.json(lens.outputData[trackIndex]);
      } else {
       return res.send(404);
      }
    });
  }
};

