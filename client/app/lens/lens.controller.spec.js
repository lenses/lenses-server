'use strict';

describe('Controller: LensCtrl', function () {

  // load the controller's module
  beforeEach(module('lensesServerApp'));

  var LensCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LensCtrl = $controller('LensCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
