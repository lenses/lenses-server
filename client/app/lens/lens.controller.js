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
	    	console.log('lens', $scope.lens);
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
		//TODO don't delete, mark active:false or deleted:true
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

		if(this.lens && this.lens._id) {
			this.update();
		} else {
			this.create();				
		}	
	};

	$scope.fork = function() {
		var lens = document.querySelector('#page-lens');
		this.lens.structure = lens.dumpData();
		this.lens.title = lens.lensTitle || '';
		this.lens.author = lens.lensAuthor || '';
		this.lens.finalResult = lens.getFinalResult() || {};

		//fake fork animation
		var forkbtn = document.querySelector('#forkbtn');
		forkbtn.firstChild.data = 'forking....';
		forkbtn.style.opacity = 0;

		setTimeout(function() {

			this.create();	
			//just in case wee needed it back!
			forkbtn.style.opacity = 1;

		}.bind(this), 2000);




	};

	/**
	 * Sends a PUT request to update the lens
	 */
	$scope.update = function(){	
		this.lens.revision = this.lens.revision + 1;

		$http.put('api/lenses/'+this.lens._id, this.lens).success(function(data) {
			$location.path('/lens/'+ data._id + '/' + data.revision, false);
		});
	};

	/**
	 * Sends a POST request to create a new lens
	 */
	$scope.create = function(){	
		//var scope = this;
		this.lens.active = true;
		this.lens.revisions = 0;
		console.log('posting ', this.lens);
		
		$http.post('api/lenses/', this.lens).success(function(data) {
			console.log('saved', data);
			$scope.lens = data;
			console.log('scope lens', $scope, $scope.lens);
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
