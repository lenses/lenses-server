'use strict';

var request = require('request');

exports.index = function(req, res) {
  
  var url =  req.params[0].replace('/proxy/','');//req.params.url;//req.url;//.slice(7);
	console.log('!!!!!!  PROXY', req.params, req.url);
	console.log('url', url);

  req.pipe(request(url)).pipe(res);
}