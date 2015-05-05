'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', '$location', function ($scope, $routeParams, $http, $location) 
  	
  	var lensId = $routeParams.lensId


  	if(lensId) {
	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	    	$scope.lens_structure = data.structure;
	  	});

		} 

		$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	    	console.log(data);
	  	});
		/*
		else {
		  	$http.get('api/lenses/').success(function(data) {
		    	$scope.lenses = data;
		  	});

		}
		*/
	
		/**
		 * Removes lens from list and sends a DELETE request to server
		 */
		$scope.delete = function (index) {
       $scope.lenses.splice(index, 1);
       // TODO: update server also
    }


		/**
		 * Sends a POST request to create a new lens given the data from lens-composer
		 */
		$scope.create = function() {
			var lensComposer = document.querySelector('lens-composer'),
					lensData = lensComposer.saveLens();
					// lensData.finalResult = lensComposer.getFinalResult();

			if (lensData){
				$http.post('api/lenses/', lensData).success(function(data) {
		    	$scope.lens = data;
		    	console.log(data);
		    	$http.get('api/lenses/'+data._id).success(function(data) {
			    	$scope.lens = data;
			  	});
				})
			}	
		}

		/**
		 * Sends a PUT request to update the lens given the data from lens-composer
		 */
		$scope.update = function() {
			var lensComposer = document.querySelector('lens-composer'),
					lensData = lensComposer.saveLens();
					lensData.finalResult = lensComposer.getFinalResult(),
					lensId = $routeParams.lensId;

			if (lensData){
				$http.put('api/lenses/'+lensId, lensData).success(function(data) {
		    	$scope.lens = data;
		    	console.log(data);
				})
			}
		}

		$scope.save = function() {
			
			if (this.type === 'linear'){
				var lens = document.querySelector('lens-composer');
				var lensData = lens.saveLens();
				
			} else {
				var lens = document.querySelector('lenses-freeform');
				var lensData = lens.dumpStateDataAsString();

			}
			
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

    
  }]);
