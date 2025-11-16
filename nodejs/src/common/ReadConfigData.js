const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const Get = require("./apis/getapi.js");

(function() {
var ConfigData = {};
var ReadConfigData = function(config) {
    return new ReadConfigData.fn.init(config);
};

ReadConfigData.fn = ReadConfigData.prototype = {
    constructor: ReadConfigData,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ReadConfigData.fn.init.prototype = ReadConfigData.fn;

$S.extendObject(ReadConfigData);
ReadConfigData.extend({
    readData: function(configFilePath, callback) {
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, {}, function(jsonData) {
                if ($S.isObject(jsonData) || $S.isArray(jsonData)) {
                    ConfigData = jsonData;
                    Logger.log("ReadConfigData: Config data read success.");
                } else {
                    Logger.log("Invalid config data: " + configFilePath);
                }
                $S.callMethod(callback);
            });
        } else {
            Logger.log("Config file path is not string.");
            Logger.log(configFilePath);
            $S.callMethod(callback);
        }
    },
    readApiData: function(api, isAddResponseLog, callback) {
        if ($S.isStringV2(api)) {
            Get.api(api, "api", isAddResponseLog, function(jsonData) {
                Logger.log("---------------");
                if ($S.isObject(jsonData) && $S.isArray(jsonData["data"])) {
                    // Logger.log("ReadConfigData: Config data read success.");
                    $S.callMethodV1(callback, jsonData["data"]);
                } else {
                    Logger.log("Invalid api data.");
                    $S.callMethodV1(callback, {});
                }
            });
        } else {
            Logger.log("Invalid api.");
            $S.callMethodV1(callback, {});
        }
    },
    readApiDataV2: function(api, request, isAddResponseLog, callback) {
        this.readApiData(api, isAddResponseLog, function(response) {
            $S.callMethodV2(callback, response, request);
        });
    },
    callApi: function(api, callback) {
        if ($S.isStringV2(api)) {
            Get.api(api, "requestId", true, function(jsonData) {
                Logger.log("---------------");
                $S.callMethodV1(callback, jsonData);
            });
        } else {
            Logger.log("Invalid api.");
            $S.callMethodV1(callback, null);
        }
    },
    getData: function() {
        return $S.clone(ConfigData);
    },
    // getApiData: function() {
    //     return $S.clone(ConfigApiData);
    // }
});
ReadConfigData.extend({
    getExcelConfigByWorkId: function(request) {
        var excelConfig = [];
        if (!$S.isObject(request)) {
            return excelConfig;
        }
        var workId = request["workId"];
        if (!$S.isStringV2(workId)) {
            return excelConfig;
        }
        if ($S.isArrayV2(ConfigData[workId])) {
            excelConfig = $S.clone(ConfigData[workId]);
        } else {
            Logger.log("Invalid workId: " + workId);
        }
        return excelConfig;
    },
});
module.exports = ReadConfigData;
})();
