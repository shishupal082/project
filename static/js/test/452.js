var App = null;
function startApp(btn){
	if(App && App.name){
		console.log("App alredy bootstraped.");
		return;
	}
	var html = '<div class="container" ng-app="AngularApp"><div class="js-controller" ng-controller="AppController"><div><div><button ng-click="checkNewController($event)">NG added</button></div></div></div></div>';
	btn.parents(".js-controller").append(html);
	App = angular.module("AngularApp", []);
	App.run(function($rootScope) {
		$rootScope.name = "AppParent";
	});
	App.controller("AppController", ['$scope', '$rootScope',function($scope, $rootScope) {
		$scope.added = false;
		$scope.html = "";
		$scope.checkNewController = function(e){
			console.log("New Controller working.");
		};
	}]);
	angular.bootstrap(btn.parents(".js-controller"), ['AngularApp']);
}
$(document).on("ready", function() {
	$("#parent_btn").on("click", function(e){
		var btn = $(e.currentTarget);
		startApp(btn);
	});
});