/*Controller.js*/
(function(){
	angular.module('F1FeederApp.controllers', []).
	controller('driversController', function($scope, ergastAPIservice) {
	    $scope.driversList = [
	      {
	          Driver: {
	              givenName: 'Sebastian',
	              familyName: 'Vettel'
	          },
	          points: 322,
	          nationality: "German",
	          Constructors: [
	              {name: "Red Bull"}
	          ]
	      },
	      {
	          Driver: {
	          givenName: 'Fernando',
	              familyName: 'Alonso'
	          },
	          points: 207,
	          nationality: "Spanish",
	          Constructors: [
	              {name: "Ferrari"}
	          ]
	      }
	    ];
	    $scope.searchFilter = function (driver) {
	        var keyword = new RegExp($scope.nameFilter, 'i');
	        return !$scope.nameFilter || keyword.test(driver.Driver.givenName) || keyword.test(driver.Driver.familyName);
	    };
	    ergastAPIservice.getDrivers().success(function (response) {
	        //Dig into the responde to get the relevant data
	        $scope.driversList = response.MRData.StandingsTable.StandingsLists[0].DriverStandings;
	    });
	}).
	controller('driverController', function($scope, $routeParams, ergastAPIservice) {
	    $scope.id = $routeParams.id;
	    $scope.races = [];
	    $scope.driver = null;

	    ergastAPIservice.getDriverDetails($scope.id).success(function (response) {
	        $scope.driver = response.MRData.StandingsTable.StandingsLists[0].DriverStandings[0]; 
	    });

	    ergastAPIservice.getDriverRaces($scope.id).success(function (response) {
	        $scope.races = response.MRData.RaceTable.Races; 
	    }); 
	});
})();