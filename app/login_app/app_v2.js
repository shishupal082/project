"use strict";
(function(){
	angular.module('app.controllers', []).
	controller('LoginController', ['$scope',  function($scope) {
		$scope.validation_raedy = false;
	    $scope.errors = {
	    		"username" : "",
	    		"password" : ""
	    };
	    $scope.user = {
	        "username" : "",
	        "password" : "",
	        "remember_me" : ""
	    };
	    $scope.$watch("user.username", function(new_val, old_val, scope){
	    		if(!scope.validation_raedy){
	    			return;
	    		}
	    		if(new_val == ""){
	    			scope.errors.username = "Username required.";
	    		}else{
	    			scope.errors.username = "";
	    		}
	    });
	    $scope.$watch("user.password", function(new_val, old_val, scope){
	    		if(!scope.validation_raedy){
				return;
			}
	    		if(new_val == ""){
	    			scope.errors.password = "Password required.";
	    		}else{
	    			scope.errors.password = "";
	    		}
	    });
	    $scope.Login = function(el){
	    		if($scope.errors.username != "" || $scope.errors.password != ""){
	    			el.preventDefault();
	    		}
	        return true;
	    };
	}]);
	angular.module('app', ['app.controllers','ngRoute']).
    config(['$routeProvider', function($routeProvider) {
    		$routeProvider.
	    	otherwise({templateUrl: "/templates/angularjs/partials/login_v2_form.html", controller: "LoginController"});
    }]);
	angular.module('app').run(function($rootScope) {
		$rootScope.name = "AngularApp";
	});
})();