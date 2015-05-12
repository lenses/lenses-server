'use strict';

angular.module('lensesServerApp')
  .controller('MainCtrl', function ($scope, $http, $location) {
   
    $scope.openNewLens = function(type) {

       $location.path('/lens').search({type: type});
    };
  });
