"use strict";
(function(){
	angular.module('APP.controllers', []).
	controller('EventController', function($scope, $location, $rootScope) {
		$scope.renderView = function(name){
			$location.path(name);
			$rootScope.name = "Version directive change";
		};
	}).
	controller('MultipleViewController', ['$scope',  function($scope) {
		$scope.email = "user@domain.com";
		$scope.name = "UserName";
	}]);
	angular.module('APP.directives', []).directive('appVersion', function() {
	  return {
	    template: '<div>Version : {{name}}-v1.0</div>'
	  };
	});
	angular.module('APP', ['APP.controllers','APP.directives','ngRoute']).
    config(['$routeProvider', function($routeProvider) {
    		$routeProvider.
	    when("/email", {templateUrl: "/templates/angularjs/partials/multiple_view_email.html", controller: "MultipleViewController"}).
	    	when("/name", {templateUrl: "/templates/angularjs/partials/multiple_view_name.html", controller: "MultipleViewController"}).
	    	otherwise({templateUrl: "/templates/angularjs/partials/multiple_view_default.html", controller: "MultipleViewController"});
//	    otherwise({redirectTo: '/name'});
    }]);
	angular.module('APP').run(function($rootScope) {
		$rootScope.name = "AngularApp";
	});
})();