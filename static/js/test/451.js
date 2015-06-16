var App = angular.module("AngularApp", []), JS;
App.run(function($rootScope) {
	$rootScope.name = "AppParent";
});
App.controller("AppController", ['$scope', '$rootScope',function($scope, $rootScope) {
	$scope.added = false;
	$scope.html = "";
	$scope.addNewController = function(e){
		if(!$scope.added){
			JS($scope);
			$rootScope.$broadcast("add");
			console.log("New Controller added.");
			$scope.added = true;
		}else{
			console.log("New Controller already added.");
		}
	};
	$scope.checkNewController = function(){
		console.log("New Controller working.");
	};
}]);
// App.directive("appDirective", function(){
// 	return {
// 		restrict: 'E',
// 		templateUrl: 'templates/angularjs/451_directive.html'
// 	};
// });
App.directive("appDirective", function(){
	return {
		restrict: 'E',
		controller: function($scope){
			$scope.$on("add", function(){
				$scope.status = true;
			});
		},
		template: '<div ng-show="status"><button ng-click="checkNewController(this)">Click me to confirm.</button></div>'
	};
});
// App.controller("AppControllerV2", ['$scope', function($scope) {
// 	$scope.checkNewController = function(e){
// 		console.log("Dynamic controller working.");
// 	};
// }]);
JS = function(scope){
	App.directive("appDirective", function(){
		return {
			restrict: 'E',
			template: '<div><button ng-click="checkNewController(this)">Click me to confirm.</button></div>'
		};
	});
	// var html = '<div class="second-controller">'
	// 			+'<div><button ng-click="checkNewController(this)">Click me to confirm.</button></div>'
	// 			+'<div><button>Click me to confirm.</button></div>'
	// 		+'</div>';
	// scope.html = html;

	// $("div.container").append(html);
	// App.controller("AppControllerV2", ['$scope', function($scope) {
	// 	$scope.checkNewController = function(e){
	// 		console.log("Dynamic controller working.");
	// 	};
	// }]);
};