var $S = require("../../static/js/stack.js");
var Logger = require("../static/logger-v2.js");
var PingThread = require("./PingThread.js");

Logger("C:/java/nodejs_ping_thread/").setLogDir().enableLoging(function(status) {
    PingThread.start("config.json");
});
