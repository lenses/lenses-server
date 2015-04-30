'use strict';

angular.module('lensesServerApp')
  .controller('LensCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
  	var lensId = $routeParams.lensId;
  	if(lensId) 
  	{
	  	$http.get('api/lenses/'+lensId).success(function(data) {
	    	$scope.lens = data;
	    	/*
			var lens = document.querySelector('#page-lens');
			var lensStructure = $scope.lens.structure;
			console.log( lens, lens.scaffoldFromData, lensStructure);
			lens.scaffoldFromData(lensStructure.elements, lensStructure.connections);
			*/

	  	});
	}
	else {
	  	$http.get('api/lenses/').success(function(data) {
	    	$scope.lenses = data;
	  	});

	}

	//$scope.initLens = function() {
		/*
		setTimeout(function() {
			console.log('init lens', this);

			var lens = document.querySelector('#page-lens');
			var lensStructure = this.lens.structure;
			console.log( lens, lensStructure);
			lens.scaffoldFromData(lensStructure.elements, lensStructure.connections);
		}.bind(this),2000);

		*/
	//}
    
  }]);
