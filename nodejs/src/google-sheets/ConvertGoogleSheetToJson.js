const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const generateFile = require("../common/generateFile.js");
const {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues,
  getSpreadSheetValuesV2
} = require('./googleSheetsService.js');

async function getSpreadSheetValuesData(spreadsheetId, sheetName, callback) {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth
    });
    $S.callMethodV1(callback, response.data);
  } catch(error) {
    console.log(error.message, error.stack);
    $S.callMethodV1(callback, null);
  }
}


(function() {
var ConfigData = {};
var FinalResult = [];
var ConvertGoogleSheetToJson = function(config) {
    return new ConvertGoogleSheetToJson.fn.init(config);
};

ConvertGoogleSheetToJson.fn = ConvertGoogleSheetToJson.prototype = {
    constructor: ConvertGoogleSheetToJson,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ConvertGoogleSheetToJson.fn.init.prototype = ConvertGoogleSheetToJson.fn;

$S.extendObject(ConvertGoogleSheetToJson);
ConvertGoogleSheetToJson.extend({
    readConfigData: function(configFilePath, callback) {
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, {}, function(jsonData) {
                if ($S.isObject(jsonData)) {
                    ConfigData = jsonData;
                    Logger.log("ConvertGoogleSheetToJson: Config data read success.");
                } else {
                    Logger.log("Invalid config data.");
                }
                $S.callMethod(callback);
            });
        } else {
            Logger.log("Invalid config path.");
            $S.callMethod(callback);
        }
    },
    getFinalResult: function() {
        return $S.clone(FinalResult);
    },
    clearFinalResult: function() {
        FinalResult = [];
    }
});
ConvertGoogleSheetToJson.extend({
    _saveData: function(data, config) {
        if ($S.isObject(config) && $S.isArrayV2(config["fileMappingData"]) && config["fileMappingData"].length >= 5) {
            var destination = config["fileMappingData"][4];
            generateFile.saveText([data.join(",")], destination, function(status) {
                // Logger.log("File read and write completed.");
            });
        }
    },
    saveCSVData: function(finalData) {
        for (var i=0; i<finalData.length; i++) {
            if ($S.isArray(finalData[i]["excelData"])) {
                for (var j=0; j<finalData[i]["excelData"].length; j++) {
                    if ($S.isArray(finalData[i]["excelData"][j])) {
                        for (var k=0; k<finalData[i]["excelData"][j].length; k++) {
                            this._saveData(finalData[i]["excelData"][j][k], finalData[i]);
                       }
                    }
                }
            }
        }
    }
});
ConvertGoogleSheetToJson.extend({
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
    generateResult: function(excelConfig, callback) {
        if (!$S.isArray(excelConfig)) {
            Logger.log("Invalid excelConfig.", callback);
            return;
        }
        if (excelConfig.length < 1) {
            Logger.log("excelConfig not found.", callback);
            return;
        }
        var self = this;
        var data, spreadsheetId, sheetName, index;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && excelConfig[i]["isVisited"] !== "true") {
                spreadsheetId = excelConfig[i]["spreadsheetId"];
                sheetName = excelConfig[i]["sheetName"];
                excelConfig[i]["isVisited"] = "true";
                getSpreadSheetValuesData(spreadsheetId, sheetName, function(response) {
                    if ($S.isObject(response) && $S.isArrayV2(response["values"])) {
                        FinalResult.push(response["values"]);
                    }
                    for (var j=0; j<excelConfig.length; j++) {
                        if (excelConfig[j]["isVisited"] !== "true") {
                            break;
                        }
                    }
                    $S.callMethodV1(callback, "SUCCESS");
                });
            }
        }
        return $S.callMethodV1(callback, "IN_PROGRESS");
    },
    convert: function(request, callback) {
        Logger.logV2(request);
        var excelConfig = ConvertGoogleSheetToJson.getExcelConfig(request);
        ConvertGoogleSheetToJson.generateResult(excelConfig, function(status) {
            $S.callMethodV1(callback, status);
        });
    }
});

module.exports = ConvertGoogleSheetToJson;

})();
