var App = angular.module("AngularApp", []), JS;
App.run(function($rootScope) {
	$rootScope.name = "AppParent";
});
App.controller("AppController", ['$scope', function($scope) {
	$scope.added = false;
	$scope.addNewController = function(e){
		if(!$scope.added){
			JS();
			console.log("New Controller added.");
			$scope.added = true;
		}else{
			console.log("New Controller already added.");
		}
	};
}]);
App.controller("AppControllerV2", ['$scope', function($scope) {
	$scope.checkNewController = function(e){
		console.log("Dynamic controller working.");
	};
}]);
JS = function(){
	var html = '<div class="second-controller ng-scope" ng-controller="AppControllerV2">'
				+'<div><button ng-click="checkNewController(this)">Click me to confirm.</button></div>'
			+'</div>';
	$("div.container").append(html);
	App.controller("AppControllerV2", ['$scope', function($scope) {
		$scope.checkNewController = function(e){
			console.log("Dynamic controller working.");
		};
	}]);
};