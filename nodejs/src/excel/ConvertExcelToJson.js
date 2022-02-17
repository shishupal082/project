const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const generateFile = require("../common/generateFile.js");
const Excel = require("./read_excel.js");

(function() {
var ConfigData = {};
var ConvertExcelToJson = function(config) {
    return new UDP.fn.init(config);
};

ConvertExcelToJson.fn = ConvertExcelToJson.prototype = {
    constructor: ConvertExcelToJson,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ConvertExcelToJson.fn.init.prototype = ConvertExcelToJson.fn;

$S.extendObject(ConvertExcelToJson);
ConvertExcelToJson.extend({
    readConfigData: function(configFilePath, callback) {
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, {}, function(jsonData) {
                if ($S.isObject(jsonData)) {
                    ConfigData = jsonData;
                    Logger.log("ConvertExcelToJson: Config data read success.", null, true);
                } else {
                    Logger.log("Invalid config data.", null, true);
                }
                $S.callMethod(callback);
            });
        } else {
            Logger.log("Invalid config path.", null, true);
            $S.callMethod(callback);
        }
    }
});
ConvertExcelToJson.extend({
    getExcelConfig: function(request) {
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
    generateFile: function(excelConfig, callback) {
        if (!$S.isArray(excelConfig)) {
            Logger.log("Invalid excelConfig.", callback);
            return;
        }
        if (excelConfig.length < 1) {
            Logger.log("excelConfig not found.", callback);
            return;
        }
        var self = this;
        var data, source, destination, index;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && excelConfig[i]["isVisited"] !== "true") {
                source = excelConfig[i]["source"];
                destination = excelConfig[i]["destination"];
                index = excelConfig[i]["index"];
                excelConfig[i]["isVisited"] = "true";
                if ($S.isStringV2(source)) {
                    data = Excel.readFile(source, index);
                    if ($S.isArray(data) && data.length === 1) {
                        data = data[0];
                    }
                    if ($S.isStringV2(destination)) {
                        generateFile.saveText([JSON.stringify(data)], destination, function(status) {
                            Logger.log("File read and write completed.");
                            self.generateFile(excelConfig, callback);
                        });
                    } else {
                        Logger.logV2(data, function(status) {
                            Logger.log("File read completed.");
                            self.generateFile(excelConfig, callback);
                        });
                    }
                    return;
                }
            }
        }
        return $S.callMethodV1(callback, "SUCCESS");
    },
    convert: function(request, callback) {
        Logger.logV2(request, function(status) {
            var excelConfig = ConvertExcelToJson.getExcelConfig(request);
            ConvertExcelToJson.generateFile(excelConfig, function(status) {
                $S.callMethodV1(callback, status);
            });
        });
    }
});

module.exports = ConvertExcelToJson;

})();
