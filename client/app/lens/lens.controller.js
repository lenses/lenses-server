'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  	var lensId = $routeParams.lensId;
  	if(lensId) {
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
		 * Sends a POST request to create a new lens given the data from lens-composer
		 */
		$scope.createLens = function() {
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
		$scope.updateLens = function() {
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
