"use strict";
(function(){
    angular.module('app.controllers', []).
    controller('HomeController', ['$scope', '$rootScope',  function($scope, $rootScope) {
        $rootScope.backButtonClass = "hide";
        $rootScope.backUrl = "#";
    }]);
})();
(function(){
    angular.module('app.controllers').
    controller('TestController', ['$scope', '$rootScope',  function($scope, $rootScope) {
        $rootScope.backButtonClass = "";
        $rootScope.backUrl = "#";
    }]);
})();
(function(){
    angular.module('app.controllers').
    controller('AppsController', ['$scope', '$rootScope',  function($scope, $rootScope) {
        $rootScope.backButtonClass = "";
        $rootScope.backUrl = "#";
    }]);
})();
(function(){
    angular.module('app', ['app.controllers','ngRoute']).
    config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when("/test",{templateUrl: "/app/dashboard/partials/test.html", controller: "TestController"}).
        when("/app",{templateUrl: "/app/dashboard/partials/app.html", controller: "AppsController"}).
        otherwise({template: 'Default template', controller: "HomeController"});
    }]);
    angular.module('app').run(function($rootScope) {
        $rootScope.name = "AngularApp";
        $rootScope.backButtonClass = "hide";
    });
})();