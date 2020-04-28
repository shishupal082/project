$(document).ready(function() {
var api = "http://localhost:3000/twitter";
$S.loadJsonData($, [api], function(response) {
	$("#loadStatus").remove();
	$("#api-response").html(JSON.stringify(response));
});
});
