'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');


// schema for input data pasted into lens
var ComponentDataSchema = new Schema({
  componentId: String, // dom id of component
  type: String, // input/output
	data: Schema.Types.Mixed
});

module.exports = mongoose.model('ComponentData', ComponentDataSchema);

var LensSchema = new Schema({
  title: String,
  author: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  cookieToken: String, //use to identify not logged in users.
  theme: String,
  type: String,
  structure: Schema.Types.Mixed,
  active: Boolean,
  revision: Number,
  /*finalResult: Object, //use componentData instead */
  componentData: Schema.Types.Mixed//for now! {type: Schema.Types.ObjectId, ref: 'ComponentData'}
  
});

module.exports = mongoose.model('Lens', LensSchema);

