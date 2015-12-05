"use strict";

(function () {
    var app = angular.module('app', ['ngRoute']);
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when("/test",{templateUrl: "/app/dashboard/partials/linkGenerator.html", controller: "TestController"}).
            when("/app",{templateUrl: "/app/dashboard/partials/linkGenerator.html", controller: "AppController"}).
            otherwise({template: 'Default template', controller: "HomeController"});
    }]);
    app.run(['$rootScope', function ($rootScope) {
        $rootScope.name = "AngularApp";
        $rootScope.backButtonClass = "hide";
    }]);
}());

(function(){
    var injectParams = ['$http'];
    var apiService = function ($http) {
        this.getTestData = function(callback){
            return $http.get("/data/test-pages.json").then(function (response) {
                var data = [];
                var testInfo, url, title, text;
                if(response.statusText == "OK" && response.data){
                    for(var testId in response.data){
                        testInfo = response.data[testId];
                        url = "/test/id/"+testId;
                        title = testInfo.html;
                        text = testId;
                        data.push({url:url, title:title, text:text});
                    }
                }
                callback(data);
                return response;
            });
        };
        this.getAppData = function(callback){
            return $http.get("/data/app-pages.json").then(function (response) {
                var data = [];
                if(response.statusText == "OK" && response.data){
                    data = response.data;
                }
                callback(data);
                return response;
            });
        };
    };
    apiService.$inject = injectParams;
    angular.module('app').service('apiService', apiService);
}());

(function(){
    var injectParams = ['$scope', '$rootScope'];
    var HomeController = function ($scope, $rootScope) {
        $rootScope.backButtonClass = "hide";
        $rootScope.backUrl = "#";
    };
    HomeController.$inject = injectParams;
    angular.module('app').controller('HomeController', HomeController);
}());

(function(){
    var injectParams = ['$scope', '$rootScope', 'apiService'];
    var TestController = function ($scope, $rootScope, apiService) {
        $rootScope.backButtonClass = "";
        $rootScope.backUrl = "#";
        // $scope.linkData = [{"url" : "#", "title" : "title", "text" : "Name"}];
        $scope.linkData = [];
        function getTestDataCallback(data){
            $scope.linkData = data;
        }
        apiService.getTestData(getTestDataCallback);
    };
    TestController.$inject = injectParams;
    angular.module('app').controller('TestController', TestController);
}());

(function(){
    angular.module('app').controller('AppController',['$scope', '$rootScope', 'apiService', function ($scope, $rootScope, apiService) {
        $rootScope.backButtonClass = "";
        $rootScope.backUrl = "#";
        $scope.linkData = [];
        function getAppDataCallback(data){
            $scope.linkData = data;
        }
        apiService.getAppData(getAppDataCallback);
    }]);
}());