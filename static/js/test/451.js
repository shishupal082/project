var App = angular.module("AngularApp", []), JS;
App.run(function($rootScope) {
	$rootScope.name = "AppParent";
});
App.controller("AppController", ['$scope', '$rootScope',function($scope, $rootScope) {
	$scope.checkController = function(e){
		console.log("Controller working.");
		$rootScope.$broadcast("add");
	};
	$scope.checkNewEventController = function(){
		console.log("New Event working.");
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
		template: '<div ng-show="status"><button ng-click="checkNewEventController()">Click me to confirm.</button></div>'
	};
});