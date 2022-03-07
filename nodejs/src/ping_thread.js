var $S = require("./libs/stack.js");
var Logger = require("./common/logger-v2.js");
var FS = require("./common/fsmodule.js");
var PingThread = require("./nms/PingThread.js");


var args = FS.readArgs();
var configFilePath = "";

if (args.length > 0 && $S.isStringV2(args[0])) {
    configFilePath = args[0];
}

FS.readJsonFile(configFilePath, null, function(jsonData) {
    if ($S.isObject(jsonData)) {
        Logger.log("ping_thread: Config data read success.");
        if ($S.isStringV2(jsonData["log_filepath"])) {
            Logger(jsonData["log_filepath"]).setLogDir().enableLoging();
        }
        PingThread.start(jsonData["config_path"]);
    } else {
        Logger.log("Invalid config data: " + configFilePath);
    }
});

