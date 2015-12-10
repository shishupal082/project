"use strict";

(function () {
    var app = angular.module('app', []);
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.name = "AngularApp";
    }]);
}());

(function(){
    var injectParams = ['$scope', '$rootScope'];
    var HomeController = function ($scope, $rootScope) {
        $scope.load_count = 101;
        $scope.getLoadCountStyle = function(){
            return "display:block";
        };
    };
    HomeController.$inject = injectParams;
    angular.module('app').controller('HomeController', HomeController);
    angular.module('app').directive('pvtLinks', function() {
      return {
        templateUrl: '/pvt/links/pvt_link.html'
      };
    }).directive('tsLinks', function() {
      return {
        templateUrl: '/pvt/links/ts_link.html'
      };
    }).directive('gssLinks', function() {
      return {
        templateUrl: '/pvt/links/gss_link.html'
      };
    });
}());
