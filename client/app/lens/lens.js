'use strict';

angular.module('lensesServerApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/lens?:type?', {
        templateUrl: 'app/lens/lens.html',
        reloadOnSearch: false,
        controller: 'LensCtrl'
      })
      .when('/lens/:lensId', {
        templateUrl: 'app/lens/lens.html',
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
