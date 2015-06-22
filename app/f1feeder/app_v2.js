(function(){
	angular.module('F1FeederApp', [
	                               'F1FeederApp.services',
	                               'F1FeederApp.controllers',
	                               'ngRoute'
	                             ]).
     config(['$routeProvider', function($routeProvider) {
        $routeProvider.
     	when("/drivers", {templateUrl: "/templates/angularjs/partials/f1feederV2_drivers.html", controller: "driversController"}).
     	when("/drivers/:id", {templateUrl: "/templates/angularjs/partials/f1feederV2_driver.html", controller: "driverController"}).
     	otherwise({redirectTo: '/drivers'});
//     	otherwise({templateUrl: "/templates/angularjs/partials/f1feederV2_drivers.html", controller: "driversController"});
     }]);
})();
