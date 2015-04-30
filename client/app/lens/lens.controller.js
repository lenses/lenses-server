'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  	var lensId = $routeParams.lensId;
  	if(lensId) 
  	{
	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	  	});
	}
	else {
	  	$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});

	}
    
  }]);
