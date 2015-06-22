(function(){
	angular.module('APP.controllers', []).
	controller('MultipleViewController', function($scope, $location) {
		$scope.email = "user@domain.com";
		$scope.name = "UserName";
		$scope.renderView = function(name){
			$location.path(name);
		};
	});
	angular.module('APP', ['APP.controllers','ngRoute']).
    config(['$routeProvider', function($routeProvider) {
	    $routeProvider.
	    	when("/email", {templateUrl: "/templates/angularjs/partials/multiple_view_email.html", controller: "MultipleViewController"}).
	    	when("/name", {templateUrl: "/templates/angularjs/partials/multiple_view_name.html", controller: "MultipleViewController"});
//	    	otherwise({redirectTo: '/name'});
    }]);
})();