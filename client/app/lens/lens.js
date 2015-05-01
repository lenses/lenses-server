'use strict';

angular.module('lensesServerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lens', {
        templateUrl: 'app/lens/lens.html',
        controller: 'LensCtrl'
      })
      .when('/lens/:lensId', {
        templateUrl: 'app/lens/lens.html',
        controller: 'LensCtrl'
      })
      .otherwise({
      	redirectTo: '/lens'
      })
  });
