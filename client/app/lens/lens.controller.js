'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', '$location', function ($scope, $routeParams, $http, $location) {
  	var lensId = $routeParams.lensId;
  	if(lensId) 
  	{
	  	console.log('getting lens');
	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	    	//put structure into scope seperately to have more control over when it updates
	    	$scope.lens_structure = data.structure;

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

	},

	$scope.saveLens = function() {
		var lens = document.querySelector('lenses-freeform');
		var lensData = lens.dumpStateDataAsString();
		console.log('lensData', lensData, this.lens);
		if(this.lens && this.lens._id) {
			// update lens when id already exist
	
			this.lens.revision = this.lens.revision + 1;
			this.lens.structure = lensData;
			$http.put('api/lenses/'+this.lens._id, this.lens).success(function(data) {
				console.log('updated', data);
				$location.path('/lens/'+ data._id + '/' + data.revision, false);
			});
		}
		else {
			// save new lens
			var lens = {name: 'new lens', active: true, structure: lensData, revision: 0};
			var scope = this;
		
			$http.post('api/lenses/', lens).success(function(data) {
				console.log('saved', data);
				scope.lens = data;
				$location.path('/lens/'+ data._id, false);
			});

		}
		
		
	}



	//}
    
  }]);
