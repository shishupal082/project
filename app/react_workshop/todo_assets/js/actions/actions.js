var actions = (function(){
	function Actions(){
		this.apis = new Apis();
	}
	Actions.prototype.loadAlltodos = function() {
		this.apis.loadAlltodos(function(response, status, self, data){
			TODOLIST = JSON.parse(response);
			renderBody();
		});
	};
	Actions.prototype.updateTodo = function(data) {
		var data = data ? data : {};
		data["user"] = USER;
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