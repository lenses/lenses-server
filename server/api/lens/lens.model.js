'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
  theme: String,
  type: String,
  structure: Schema.Types.Mixed,
  active: Boolean,
  revision: Number,
  finalResult: Object,
  inputData: {type: Schema.Types.ObjectId, ref: 'InputData'}
  
});

module.exports = mongoose.model('Lens', LensSchema);

