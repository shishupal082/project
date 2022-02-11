var $S = require("../../static/js/stack.js");
var NmsService = require("./nms_service.js");

NmsService.getData("config.json", "did in (1)", "1", function(result) {
    console.log(result.length);
    NmsService.getTcpResponse("002", "workId", "002|workId|did in (1)|2", function(result) {
        console.log(result.length);
    });
});

