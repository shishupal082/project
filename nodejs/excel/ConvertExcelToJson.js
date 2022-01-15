const $S = require("../../static/js/stack.js");
const FS = require("../static/fsmodule.js");
const Logger = require("../static/logger-v2.js");
const Excel = require("./read_excel.js");
const generateFile = require("../mlk/src/js/generateFile.js");

(function() {
var ConfigData = {};
var configPath = "";
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
    setConfigPath: function(configFilePath) {
        if ($S.isStringV2(configFilePath)) {
            configPath = configFilePath;
        }
    },
    readConfigData: function(callback) {
        FS.readJsonFile(configPath, {}, function(jsonData) {
            if ($S.isObject(jsonData)) {
                ConfigData = jsonData;
                console.log("Config data read success.");
            } else {
                console.log("Invalid config data.");
            }
            $S.callMethod(callback);
        });

    }
});
ConvertExcelToJson.extend({
    getExcelConfig: function(request) {
        var excelConfig = [];
        if (!$S.isObject(request)) {
            return excelConfig;
        }
        var workId = request["workId"];
        if (!$S.isString(workId)) {
            return excelConfig;
        }
        if ($S.isArrayV2(ConfigData[workId])) {
            excelConfig = $S.clone(ConfigData[workId]);
        } else {
            console.log("Invalid workId: " + workId);
        }
        return excelConfig;
    },
    generateFile: function(excelConfig, callback) {
        if (!$S.isArray(excelConfig)) {
            return $S.callMethod(callback);
        }
        var data, source, destination, index;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && excelConfig[i]["isVisited"] !== "true") {
                source = excelConfig[i]["source"];
                destination = excelConfig[i]["destination"];
                index = excelConfig[i]["index"];
                if ($S.isStringV2(source) && $S.isStringV2(destination) && $S.isNumber(index) && index > 0) {
                    data = Excel.readFile(source, index);
                    if ($S.isArray(data) && data.length === 1) {
                        data = data[0];
                    }
                    generateFile.saveText([JSON.stringify(data)], destination, function(status) {
                        Logger.log("File read and write completed.");
                    });
                    excelConfig[i]["isVisited"] = "true";
                    return this.generateFile(excelConfig, callback);
                }
            }
        }
        return $S.callMethod(callback);
    },
    convert: function(request, callback) {
        console.log(request);
        var excelConfig = ConvertExcelToJson.getExcelConfig(request);
        ConvertExcelToJson.generateFile(excelConfig, function() {
            $S.callMethodV1(callback, "SUCCESS");
        });
    }
});

module.exports = ConvertExcelToJson;

})();
