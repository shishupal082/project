var Test = window.Test;
var Apis = require("../apis/apis.js");
var actions = (function(){
	function Actions(){
		this.apis = new Apis();
	}
	Actions.prototype.loadAlltodos = function() {
		this.apis.loadAlltodos(function(response, status, self, data){
			Test.TODOLIST = JSON.parse(response);
			Test.renderBody();
		});
	};
	Actions.prototype.loadTodoCallback = function(response, status, ajax, data){
		Test.selectedTodo = JSON.parse(response)[0];
		Test.renderAll();
	};
	Actions.prototype.loadTodo = function(data) {
		var data = data ? data : {};
		var ajax_object = {
	    		url : "/todoapi/get",
	    		data : data,
	    		method : "GET"
	    	};
	    Test.Ajax.call_ajax(ajax_object, this.loadTodoCallback);
	};
	Actions.prototype.updateTodo = function(data) {
		var data = data ? data : {};
		var ajax_object = {
	    		url : "/todoapi/update",
	    		data : data,
	    		method : "GET"
	    	};
	    Test.Ajax.call_ajax(ajax_object);
	};
	return Actions;
})();
var Actions = new actions();
module.exports = Actions;