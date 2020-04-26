# project
All technology together

PHP
----------------
Captcha
Recaptcha
AES encryption

JAVA/PHP
----------------
Class extention
class parent {}
class parent implements interface {}
class child extends parent{}

JAVA
----------------
PDF to Text converter
Text to PDF converter
Dropowizard fully functioning
Customised exception handller
Customised logger pattern

Angularjs
----------------
stateprovider
rootprovider
model
view
controller
directive
service (factory)
material design

Nodejs
----------------
Create server
set env variables
sync all interdependent code files using nodejs

Reactjs
----------------

Jquery
----------------

Javascript
----------------

1)
Object extention using Object.extend

(function(window, $S) {
var Model = function(selector, context) {
    return new Model.fn.init(selector, context);
};
Model.fn.init.prototype = Model.fn;
Model.extend = Model.fn.extend = function(options) {
    if (typeof options == "object" && isNaN(options.length)) {
        for (var key in options) {
            if (typeof options[key] == "function") {
                /*If method already exist then it will be overwritten*/
                if (typeof Model[key]  == "function") {
                    console.log('Method "' + Model.name + "." + key + '" is overwritten.');
                }
                Model[key] = options[key];
            }
        }
    }
    return Model;
};
window.Model = window.$M = Model;
})(window, $S);
$M.extend({
	method: function() {}	
});

Object (should not be extended outside of scope)
Object extended using prototype method

2)
var DT = (function() {
	function DateTime() {}
	DateTime.prototype.method = function() {};
    return DateTime;
})();

3)
var LocalStorage = (function(){
    function LocalStorage () {
        function get(key) {};
        function getAll() {};
        return {
            getAll: getAll,
            get: get,
            set: set,
            remove: remove,
            clear: clear
        };
    }
    return LocalStorage;
})();

Youtube api
Google map api
Recaptcha

Live pages
[Links](https://docs.google.com/spreadsheets/d/1-kRxk-nzYA8EHnwrWwAZojOm2u502wnmPx0pZ6uULTs/pubhtml)


