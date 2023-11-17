const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const generateFile = require("../common/generateFile.js");
const {
  getAuthToken,
  getSpreadSheet,
  getSpreadSheetValues
} = require('./googleSheetsService.js');

async function getSpreadSheetValuesData(spreadsheetId, sheetName, config, callback) {
  try {
    const auth = await getAuthToken();
    const response = await getSpreadSheetValues({
      spreadsheetId,
      sheetName,
      auth
    });
    $S.callMethodV2(callback, config, response.data);
  } catch(error) {
    console.log(error.message, error.stack);
    $S.callMethodV2(callback, config, null);
  }
}


(function() {
var ConfigData = {};
var FinalResult = [];
var ConvertGoogleSheetsToCsv = function(config) {
    return new ConvertGoogleSheetsToCsv.fn.init(config);
};

ConvertGoogleSheetsToCsv.fn = ConvertGoogleSheetsToCsv.prototype = {
    constructor: ConvertGoogleSheetsToCsv,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ConvertGoogleSheetsToCsv.fn.init.prototype = ConvertGoogleSheetsToCsv.fn;

$S.extendObject(ConvertGoogleSheetsToCsv);
ConvertGoogleSheetsToCsv.extend({
    setConfigData: function(_configData) {
        ConfigData = _configData;
    },
    getFinalResult: function() {
        return $S.clone(FinalResult);
    },
    clearFinalResult: function() {
        FinalResult = [];
    }
});
ConvertGoogleSheetsToCsv.extend({
    _saveData: function(que, callback) {
        var self = this;
        if (que.getSize() > 0) {
            var queElement = que.Deque();
            if ($S.isArray(queElement) && queElement.length === 2) {
                var data = queElement[0];
                var config = queElement[1];
                if ($S.isObject(config) && $S.isArrayV2(config["fileMappingData"]) && config["fileMappingData"].length >= 5) {
                    var destination = config["fileMappingData"][4];
                    if ($S.isArray(data)) {
                        generateFile.saveTextV3([data.join(",")], destination, function(status) {
                            // Logger.log("File read and write completed.");
                            self._saveData(que, callback);
                        });
                    } else {
                        self._saveData(que, callback);
                    }
                }
            }
        } else {
            $S.callMethod(callback);
        }
    },
    _isCopyRequired: function(excelConfig) {
        if ($S.isArrayV2(excelConfig) && $S.isObject(excelConfig[0]) && $S.isBooleanTrue(excelConfig[0]["copyOldData"])) {
            return true;
        }
        return false;
    },
    _copyOldContentAndSaveNewData: function(configQue, que, callback) {
        var self = this;
        if (configQue.getSize() > 0) {
            var config = configQue.Deque();
            if ($S.isObject(config) && $S.isArrayV2(config["fileMappingData"]) && config["fileMappingData"].length >= 5) {
                var destination = config["fileMappingData"][4];
                if (this._isCopyRequired(config["excelConfig"])) {
                    generateFile.copyFileWithTimeStamp(destination, function(status) {
                        generateFile.deleteText(destination, function(status) {
                            self._copyOldContentAndSaveNewData(configQue, que, callback);
                        });
                    });
                } else {
                    generateFile.deleteText(destination, function(status) {
                        self._copyOldContentAndSaveNewData(configQue, que, callback);
                    });
                }
            }
        } else {
            self._saveData(que, callback);
        }
    },
    saveCSVData: function(finalData, callback) {
        var que = $S.getQue();
        var configQue = $S.getQue();
        for (var i=0; i<finalData.length; i++) {
            configQue.Enque(finalData[i]);
            if ($S.isArray(finalData[i]["excelData"])) {
                for (var j=0; j<finalData[i]["excelData"].length; j++) {
                    if ($S.isArray(finalData[i]["excelData"][j])) {
                        for (var k=0; k<finalData[i]["excelData"][j].length; k++) {
                            que.Enque([finalData[i]["excelData"][j][k], finalData[i]]);
                       }
                    }
                }
            }
        }
        this._copyOldContentAndSaveNewData(configQue, que, function(status) {
            $S.callMethodV1(callback, status);
        });
    }
});
ConvertGoogleSheetsToCsv.extend({
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
                getSpreadSheetValuesData(spreadsheetId, sheetName, {}, function(config, response) {
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
    _getSpreadsheetId: function(gsConfigData) {
        var spreadsheetId = "";
        if ($S.isObject(gsConfigData) && $S.isObject(gsConfigData["fileConfigMapping"])) {
            if ($S.isArray(gsConfigData["fileConfigMapping"]["fileConfig"])) {
                if (gsConfigData["fileConfigMapping"]["fileConfig"].length > 0) {
                    spreadsheetId = gsConfigData["fileConfigMapping"]["fileConfig"][0];
                }
            }
        }
        return spreadsheetId;
    },
    _getSpreadsheetName: function(gsConfigData) {
        var spreadsheetName = "";
        if ($S.isObject(gsConfigData) && $S.isObject(gsConfigData["fileConfigMapping"])) {
            if ($S.isArray(gsConfigData["fileConfigMapping"]["fileConfig"])) {
                if (gsConfigData["fileConfigMapping"]["fileConfig"].length > 1) {
                    spreadsheetName = gsConfigData["fileConfigMapping"]["fileConfig"][1];
                }
            }
        }
        return spreadsheetName;
    },
    _fireCallback: function(excelConfig, callback) {
        if (!$S.isArray(excelConfig)) {
            return $S.callMethodV1(callback, "SUCCESS");
        }
        var isVisited = true, isBreak;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && excelConfig[i]["isVisited"] !== "true") {
                isVisited = false;
                break;
            }
            if ($S.isObject(excelConfig[i]) && $S.isArrayV2(excelConfig[i]["gsConfig"])) {
                isBreak = false;
                for (var j=0; j<excelConfig[i]["gsConfig"].length; j++) {
                    if ($S.isObject(excelConfig[i]["gsConfig"][j]) && excelConfig[i]["gsConfig"][j]["isVisited"] !== "true") {
                        isBreak = true;
                    }
                }
                if (isBreak) {
                    isVisited = false;
                }
            }
        }
        if (isVisited) {
            $S.callMethodV1(callback, "SUCCESS");
        }
    },
    generateResultV2: function(excelConfig, callback) {
        if (!$S.isArray(excelConfig)) {
            Logger.log("Invalid excelConfig.", callback);
            return;
        }
        if (excelConfig.length < 1) {
            Logger.log("excelConfig not found.", callback);
            return;
        }
        var self = this;
        var data, id, spreadsheetId, sheetName, index;
        var destination, finalList = [], isBreak;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && $S.isArray(excelConfig[i]["gsConfig"])) {
                id = excelConfig[i]["id"];
                for (var j=0; j<excelConfig[i]["gsConfig"].length; j++) {
                    if ($S.isObject(excelConfig[i]["gsConfig"][j]) && excelConfig[i]["gsConfig"][j]["isVisited"] !== "true") {
                        spreadsheetId = this._getSpreadsheetId(excelConfig[i]["gsConfig"][j]);
                        sheetName = this._getSpreadsheetName(excelConfig[i]["gsConfig"][j]);
                        getSpreadSheetValuesData(spreadsheetId, sheetName, {i: i, j: j, id: id, excelConfig: excelConfig}, function(config, response) {
                            if ($S.isObject(response) && $S.isArray(response.values)) {
                                for (var k=0; k<response.values.length; k++) {
                                    if ($S.isArray(response.values[k]) && response.values[k].length >= 6) {
                                        if (response.values[k][5] === config["id"]) {
                                            FinalResult.push(response.values[k]);
                                        }
                                    }
                                }
                            }
                            config["excelConfig"][config["i"]]["gsConfig"][config["j"]]["isVisited"] = "true";
                            self._fireCallback(excelConfig, callback);
                        });
                    }
                }
            }
            if ($S.isObject(excelConfig[i])) {
                excelConfig[i]["isVisited"] = "true";
            }
        }
        return this._fireCallback(excelConfig, callback);
    },
    convert: function(request, excelConfig, callback) {
        Logger.logV2(request);
        ConvertGoogleSheetsToCsv.generateResultV2(excelConfig, function(status) {
            $S.callMethodV1(callback, status);
        });
    }
});

module.exports = ConvertGoogleSheetsToCsv;

})();
