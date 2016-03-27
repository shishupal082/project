"use strict";

(function () {
    var app = angular.module('app', []);
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.name = "AngularApp";
        $rootScope.getBlockStyle = function(){
            return "display:block;";
        };
    }]);
}());

(function(){
    var injectParams = ['$scope', '$rootScope'];
    var HomeController = function ($scope, $rootScope) {
    };
    HomeController.$inject = injectParams;
    angular.module('app').controller('HomeController', HomeController);
    angular.module('app').directive('pvtLinksDirective', function() {
      return {
        restrict : "A",
        templateUrl: '/pvt/links/pvt_link.html'
      };
    }).directive('tsLinksDirective', function() {
      return {
        restrict : "A",
        templateUrl: '/pvt/links/ts_link.html'
      };
    }).directive('gssLinksDirective', function() {
      return {
        restrict : "A",
        templateUrl: '/pvt/links/gss_link.html'
      };
    }).directive('personalQoatesDirective', function() {
      return {
        restrict : "A",
        templateUrl: '/pvt/links/personal_qoates.html'
      };
    });
}());
