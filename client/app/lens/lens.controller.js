'use strict';

angular.module('lensesServerApp')
	.controller('LensCtrl', 
                ['$scope', '$routeParams', '$http', '$location', 
                function ($scope, $routeParams, $http, $location) {
  	var lensId = $routeParams.lensId;
  	var lensType = $routeParams.type || 'linear';
  	$scope.lens = {type: lensType, editable: true};
 
  	if(lensId) {
			// Get lens and set scope
 	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	    	
	    	//put structure into scope seperately to have more control over when it updates
	    	$scope.lensStructure = data.structure;
		  	});
	} else {
			// Get lenses list
		$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});
	}

	/**
	 * Removes lens from list and sends a DELETE request to server
	 */
	$scope.delete = function (index, lensId) {
		if(confirm('Are you sure you want to delete this lens?')){
	    $scope.lenses.splice(index, 1);
      $http.delete('api/lenses/'+lensId).success(function() {
	    	console.log('deleted lens '+lensId);
			});
    }
	};

  	/**
	 * Gets the state of the lens and calls the appropriate save method
	 */
	$scope.save = function() {
		var lens = document.querySelector('#page-lens');
		this.lens.structure = lens.dumpData();
		this.lens.title = lens.lensTitle || '';
		this.lens.author = lens.lensAuthor || '';
		this.lens.finalResult = lens.getFinalResult() || {};
		// console.log(this.lens.finalResult);

		if(this.lens && this.lens._id) {
			this.update();
		} else {
			this.create();				
		}	
	};

	$scope.fork = function() {
		//TODO implementation
	}


	/**
	 * Sends a PUT request to update the lens
	 */
	$scope.update = function(){	
		this.lens.revision = this.lens.revision + 1;

		$http.put('api/lenses/'+this.lens._id, this.lens).success(function(data) {
			console.log('updated', data);
			$location.path('/lens/'+ data._id + '/' + data.revision, false);
		});
	};

	/**
	 * Sends a POST request to create a new lens
	 */
	$scope.create = function(){	
		var scope = this;
		this.lens.active = true;
		this.lens.revisions = 0;
		
		$http.post('api/lenses/', this.lens).success(function(data) {
			console.log('saved', data);
			scope.lens = data;
			$location.path('/lens/'+ data._id, false).search({});
		});
	};


	/**
	 * sets the height of the page when there is lenses freeform in the page.
	 */
	$scope.setHeights = function() {
		if ($scope.lens.type === 'freeform'){
			console.log('setheights');
			var html = document.querySelector('html'),
				body = document.querySelector('body');

			html.style.width = '100%';
			html.style.height = '100%';

			body.style.width = '100%';
			body.style.height = '100%';
		}
	};


    
}]);
