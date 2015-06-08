'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');


// schema for input data pasted into lens
var InputDataSchema = new Schema({
	name: String,
	keywords: [String],
	data: Schema.Types.Mixed
});

module.exports = mongoose.model('InputData', InputDataSchema);

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
  finalResult: Object,
  inputData: {type: Schema.Types.ObjectId, ref: 'InputData'},
  outputData: Array
  
});

module.exports = mongoose.model('Lens', LensSchema);