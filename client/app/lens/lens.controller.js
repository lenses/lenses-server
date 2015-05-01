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
	/*
	else {
	  	$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});

	}
	*/

	/**
	 * sets the height of the page when there is lenses freeform in the page.
	 */
	$scope.setHeights = function() {
		console.log('setheights');
		var html = document.querySelector('html'),
			body = document.querySelector('body');

		html.style.width = '100%';
		html.style.height = '100%';

		body.style.width = '100%';
		body.style.height = '100%';

	}

	//}
    
  }]);
