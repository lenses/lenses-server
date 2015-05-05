'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', '$location', function ($scope, $routeParams, $http, $location) {
  	
  	var lensId = $routeParams.lensId;
		$scope.type = 'linear';

  	if(lensId) {
	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	    	$scope.lens_structure = data.structure;
	    	$scope.type = data.type;
	  	});
		} else {
			$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});
		}
		
	
		/**
		 * Removes lens from list and sends a DELETE request to server
		 */
		$scope.delete = function (index) {
       $scope.lenses.splice(index, 1);
       // TODO: update server also
    }


		/**
		 * Sends a POST/PUT request to create/update a lens given the data from lens-composer or lenses-freeform
		 */
		$scope.save = function() {
			
			if (this.type === 'linear'){
				var lens = document.querySelector('lens-composer'),
						structure = lens.saveLens(),
						title = lens.lensTitle,
						author = lens.lensAuthor;

			} else {
				var lens = document.querySelector('lenses-freeform'),
						structure = lens.dumpStateDataAsString(),
						title = lens.lensTitle || "",
						author = lens.lensAuthor || "";
			}
			
			if(this.lens && this.lens._id) {
				// Update lens when it already exists
				this.lens.revision = this.lens.revision + 1;
				this.lens.structure = structure;
				$http.put('api/lenses/'+this.lens._id, this.lens).success(function(data) {
					console.log('updated', data);
					$location.path('/lens/'+ data._id + '/' + data.revision, false);
				});
			}
			else {
				// Save a new lens 
				console.log(this.type)
				var lens = {title: title, author: author, active: true, type: this.type, structure: structure, revision: 0};
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
