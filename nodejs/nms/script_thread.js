var $S = require("../src/libs/stack.js");
var Logger = require("../src/common/logger-v2.js");
var PingThread = require("../src/nms/PingThread.js");

Logger("C:/java/nodejs_ping_thread/").setLogDir().enableLoging(function(status) {
    if (status) {
        Logger.log("Logging enable", null, true);
    } else {
        Logger.log("Error in logging enable", null, true);
    }
    PingThread.start("../config/ping_thread_config.json");
});
