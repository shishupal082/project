var Apis = (function(){
	function Apis(){}
	Apis.prototype.loadAlltodos = function(callback) {
		// $.get(, function(result) {
		// 	console.log("get result ", result);
  //     		callback(result);
  //   	}.bind(this));
    	var data = {},
    		ajax_object = {
	    		url : "/todoapi/get",
	    		data : data,
	    		method : "GET"
	    	};
    	var self = this,
			request = $.ajax(ajax_object);

		request.success(function(response){
			console.log(response);
			if(callback){
				callback(response, "success",self, data);
			}
		});
		request.fail(function(response){
			if(callback){
				callback(response, "fail",self, data);
			}
		});
    };
	return Apis;
})();

module.exports = Apis;