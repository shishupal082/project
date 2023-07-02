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
    _saveData: function(que) {
        var self = this;
        if (que.getSize() > 0) {
            var queElement = que.Deque();
            if ($S.isArray(queElement) && queElement.length === 2) {
                var data = queElement[0];
                var config = queElement[1];
                if ($S.isObject(config) && $S.isArrayV2(config["fileMappingData"]) && config["fileMappingData"].length >= 5) {
                    var destination = config["fileMappingData"][4];
                    generateFile.saveTextV3([data.join(",")], destination, function(status) {
                        // Logger.log("File read and write completed.");
                        self._saveData(que);
                    });
                }
            }
        }
    },
    _isCopyRequired: function(excelConfig) {
        if ($S.isArrayV2(excelConfig) && $S.isObject(excelConfig[0]) && $S.isBooleanTrue(excelConfig[0]["copyOldData"])) {
            return true;
        }
        return false;
    },
    _copyOldContentAndSaveNewData: function(configQue, que) {
        var self = this;
        if (configQue.getSize() > 0) {
            var config = configQue.Deque();
            if ($S.isObject(config) && $S.isArrayV2(config["fileMappingData"]) && config["fileMappingData"].length >= 5) {
                var destination = config["fileMappingData"][4];
                if (this._isCopyRequired(config["excelConfig"])) {
                    generateFile.copyFileWithTimeStamp(destination, function(status) {
                        generateFile.deleteText(destination, function(status) {
                            self._copyOldContentAndSaveNewData(configQue, que);
                        });
                    });
                } else {
                    generateFile.deleteText(destination, function(status) {
                        self._copyOldContentAndSaveNewData(configQue, que);
                    });
                }
            }
        } else {
            self._saveData(que);
        }
    },
    saveCSVData: function(finalData) {
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
        this._copyOldContentAndSaveNewData(configQue, que);
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
    convert: function(request, excelConfig, callback) {
        Logger.logV2(request);
        ConvertGoogleSheetsToCsv.generateResult(excelConfig, function(status) {
            $S.callMethodV1(callback, status);
        });
    }
});

module.exports = ConvertGoogleSheetsToCsv;

})();
