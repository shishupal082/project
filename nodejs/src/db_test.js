var $S = require("./libs/stack.js");
var Logger = require("./common/logger-v2.js");
var FS = require("./common/fsmodule.js");
var DB = require("./common/db.js");


var args = FS.readArgs();
var configFilePath = "";

if (args.length > 0 && $S.isStringV2(args[0])) {
    configFilePath = args[0];
}

FS.readJsonFile(configFilePath, null, function(jsonData) {
    if ($S.isObject(jsonData)) {
        DB.setDbParameter(jsonData["dbConfig"]);
        Logger.log("Config data read success.");
        DB.getDbConnection(function(dbCon) {
            setTimeout(function() {
                DB.closeDbConnection(dbCon);
            }, 1000);
        });
    } else {
        Logger.log("Config data read success.");
    }
});

