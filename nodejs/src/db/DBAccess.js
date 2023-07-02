var $S = require("../libs/stack.js");
var Logger = require("../common/logger-v2.js");
var FS = require("../common/fsmodule.js");
var DB = require("../common/db.js");

(function() {
var ConfigData = {};
var DBAccess = function(config) {
    return new UDP.fn.init(config);
};

DBAccess.fn = DBAccess.prototype = {
    constructor: DBAccess,
    init: function(config) {
        this.config = config;
        return this;
    }
};
DBAccess.fn.init.prototype = DBAccess.fn;
$S.extendObject(DBAccess);
DBAccess.extend({
    readConfigData: function(configFilePath, callback) {
        isConfigDataRead = true;
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, null, function(jsonData) {
                if ($S.isObject(jsonData)) {
                    ConfigData = jsonData;
                    DB.setDbParameter(ConfigData["dbConfig"]);
                    Logger.log("DBAccess: Config data read success.");
                    DB.getDbConnection(function(dbCon) {
                        database = dbCon;
                        $S.callMethod(callback);
                    });
                } else {
                    Logger.log("Invalid config data: " + configFilePath);
                    $S.callMethod(callback);
                }
            });
        } else {
            Logger.log("Invalid config path: " + configFilePath);
            $S.callMethod(callback);
        }
    },
    setConfigData: function(_configData) {
        ConfigData = _configData;
    },
});

DBAccess.extend({
    generateNmsCsvFile: function(appId, workId, msg, callback) {
        $S.callMethodV1(callback, "METHOD_IMPLIMENTATION_PENDING");
    },
});

DBAccess.extend({
    HandleDbAccess: function(request, callback) {
        if (!$S.isObject(request)) {
            $S.callMethodV1(callback, "INVALID_REQUEST");
            return;
        }
        var appId, workId;
        appId = request["appId"];
        workId = request["workId"];
        msg = request["msg"];
        if (workId === "GenerateNmsCsvFile") {
            DBAccess.generateNmsCsvFile(appId, workId, msg, function(result) {
                if ($S.isStringV2(result)) {
                    $S.callMethodV1(callback, result);
                } else {
                    $S.callMethodV1(callback, "INVALID_RESPONSE");
                }
            });
        } else {
            $S.callMethodV1(callback, "INVALID_WORK_ID");
        }
    }
});

module.exports = DBAccess;

})();
