var $S = require("../src/libs/stack.js");
var NmsService = require("../src/nms/nms_service.js");

var lineSepratorString = "----------------------------------------------";

NmsService.readConfigData("../config/nms_service_config.json", function() {
    console.log(lineSepratorString);
    NmsService.getData(NmsService.parseRequest("002|workId||did in (1)|1"), function(result) {
        console.log(result);
        console.log(lineSepratorString);
        NmsService.getTcpResponse({"appId":"002", "workId": "workId", "msg": "002|workId|timeRange|did in (1)|2"}, function(result) {
            console.log(result);
        });
    });
});

