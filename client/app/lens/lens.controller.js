'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', '$location', function ($scope, $routeParams, $http, $location) {
  	var lensId = $routeParams.lensId;
  	var revision = $routeParams.revision;
  	var lensType = $routeParams.type || 'linear';
  	//lensType = lensType ? lensType.substring(1, lensType.length) : 'linear';
  	$scope.lens = {type: lensType};
  	if(lensId) 
  	{
	  	console.log('getting lens ' + lensId + ', revision: ' + revision);
	  	$http.get('api/lenses/'+lensId+'/'+revision).success(function(data) {
	    	$scope.lens = data;
	    	//put structure into scope seperately to have more control over when it updates
	    	$scope.lens_structure = data.structure;

	  	});
	}
 	else {
			$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});
	}

	console.log('scope.lens', $scope.lens);

	/**
	 * Removes lens from list and sends a DELETE request to server
	 */
	$scope.delete = function (index) {
       $scope.lenses.splice(index, 1);
       // TODO: update server also
    }


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
		var lens = document.querySelector('#page-lens');
		var lensData = lens.dumpData();
		var title = lens.lensTitle || "";
		var author = lens.lensAuthor || "";

		console.log('lensData', lensData, this.lens);
		if(this.lens && this.lens._id) {
			
			// UPDATE lens when id already exist
			this.lens.revision = this.lens.revision + 1;
			this.lens.structure = lensData;
			console.log('lens state ',this.lens.structure);
			$http.put('api/lenses/'+this.lens._id, this.lens).success(function(data) {
				console.log('updated', data);
				$location.path('/lens/'+ data._id + '/' + data.revision, false);
			});
		}
		else {
			
			// SAVE new lens
			
			var lens = {name: 'new lens', type: this.lens.type, active: true, structure: lensData, revision: 0};
			var scope = this;
		
			$http.post('api/lenses/', lens).success(function(data) {
				console.log('saved', data);
				scope.lens = data;
				$location.path('/lens/'+ data._id, false).search({});
			});

		}
		
		
	}



    
  }]);
