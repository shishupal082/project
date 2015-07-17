'use strict';
/*app.js*/
angular.module('App', [
	'ngRoute',
	'App.controllers',
	'App.directives',
	'App.services'
]).config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/login', {
		title:'Login User App',
		templateUrl: '/app/loginAppV3/loginView.html', 
		controller: 'LoginCtrl',
	});  
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
/*controller.js*/
angular.module('App.controllers', []).
controller("LoginCtrl", ['$scope', 'apiService', 'authFactory', function($scope, apiService, authFactory){
	$scope.formError = "";
	$scope.user = {
		"username" : "",
		"password" : ""
	};
	$scope.Login = function(e, form){
		e.preventDefault();
		var response = authFactory.validateUsername($scope, form);
		$scope.formError = response.getMessage();
		if(!response.getStatus()){
			return false;
		}
		apiService.login($scope.user).success(function(data, status, headers, config) {
			console.log(data);
		});
		return true;
	};
}]);
/*directive.js*/
angular.module('App.directives', []).
directive('userDirective', [function() {
	return {
		templateUrl: function(elem, attr){
			return '/app/loginAppV3/partials/'+attr.type+'.html';
		}
	};
}]);
/*services.js*/
angular.module('App.services', []).
service('apiService', function($http) {
	var apiService = {};
	apiService.login = function(user) {
		return $http.post('/app/loginUser', user);
	};
	return apiService;
}).
factory('responseFactory', function() {
	var response = {};
	response.Response = (function(){
		function Response(response){
			this.status = response.status ? response.status : "FAILURE";
			this.msg = response.msg ? response.msg : "";
		}
		Response.prototype.getStatus = function() {
			return this.status == "SUCCESS";
		};
		Response.prototype.getMessage = function(){
			return this.msg;
		};
		return Response;
	})();
	response.fromJson = function(response){
		return new this.Response(response);
	};
	return response;
}).
factory('authFactory',['responseFactory', function(responseFactory){
	var factory = {};
	factory.validateUsername = function(scope, form){
		var response = {status : "ERROR", msg : ""}, username = scope.user.username;
		if(!username || username.trim() === ""){
			response.msg = "Username required.";
		}else if(form.username.$invalid){
			response.msg = "Please enter valid Username.";
		}else{
			response.status = "SUCCESS";
		}
		return responseFactory.fromJson(response);
	};
	return factory;
}]);