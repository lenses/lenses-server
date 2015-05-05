'use strict';

angular.module('lensesServerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lens', {
        templateUrl: 'app/lens/lens.html',
        reloadOnSearch: false,
        controller: 'LensCtrl'
      })
      .when('/lens/:lensId', {
        templateUrl: 'app/lens/lens.html',
        controller: 'LensCtrl'
      })
      .when('/lens/:lensId/view', {
        templateUrl: 'app/lens/lens-view.html',
        controller: 'LensCtrl'
      })
      .when('/lenses', {
        templateUrl: 'app/lens/lenses.html',
        controller: 'LensCtrl'
      })
      .when('/lens/:lensId/:revision', {
        templateUrl: 'app/lens/lens.html',
        controller: 'LensCtrl'
      })
      .otherwise({
      	redirectTo: '/lens'
      })
  });
