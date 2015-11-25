"use strict";
(function(){
angular.module("app.controllers", []).controller("LoginController", ['$scope', '$rootScope', function($scope, $rootScope) {
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
//    		var form = $rootScope.el(form);
//    		form.attr("onsubmit", "return false;");
//    		form.submit();
//        $scope.submited = true;
//        if($scope.is_form_valid){
//            $rootScope.http({
//              url : "/app/loginGetUser",
//              method : "POST",
//              data : $scope.login_data,
//              headers : {"Content-type" : "application/x-www-form-urlencoded"}
//            });
//        }
        return false;
    };
    setTimeout(function(){
    		$scope.validation_raedy = true;
    }, 5000);
}]);
angular.module('app', ["app.controllers"]);
angular.module('app').run(function($rootScope) {
	$rootScope.name = "APP";
	$rootScope.el = function(current_target){
		return angular.element(current_target);
	};
});
})();