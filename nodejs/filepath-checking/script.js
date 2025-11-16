const $S = require("../src/libs/stack.js");
const FS = require("../src/common/fsmodule.js");
const Logger = require("../src/common/logger-v2.js");
const generateFile = require("../src/common/generateFile.js");
const ReadConfigData = require("../src/common/ReadConfigData.js");
const Get = require("../src/common/apis/getapi.js");

(function() {
var ConfigData = {};
var FinalResult = {};
var FilepathChecking = function(config) {
    return new FilepathChecking.fn.init(config);
};

FilepathChecking.fn = FilepathChecking.prototype = {
    constructor: FilepathChecking,
    init: function(config) {
        this.config = config;
        return this;
    }
};
FilepathChecking.fn.init.prototype = FilepathChecking.fn;

$S.extendObject(FilepathChecking);


FilepathChecking.extend({
	setConfigData: function(_configData) {
        ConfigData = _configData;
    },
    getFinalResult: function() {
        return $S.clone(FinalResult);
    },
    clearFinalResult: function() {
        FinalResult = {};
    }
});
FilepathChecking.extend({
    _validateFilepath: function(currentData) {
        var filepathIndex;
        var isFile;
        if ($S.isObject(currentData) && $S.isArray(currentData["all"])) {
            if (!$S.isArray(currentData["inValidFilepath"])) {
                currentData["inValidFilepath"] = [];
            }
            if (!$S.isArray(currentData["validFilepath"])) {
                currentData["validFilepath"] = [];
            }
            filepathIndex = currentData["filepath-index"];
            if ($S.isNumber(filepathIndex)) {
                for (var i=0; i<currentData["all"].length; i++) {
                    if ($S.isArray(currentData["all"][i]) && filepathIndex < currentData["all"][i].length) {
                        isFile = FS.isFile(currentData["all"][i][filepathIndex]);
                        if (isFile) {
                            currentData["validFilepath"].push(currentData["all"][i]);
                        } else {
                            currentData["inValidFilepath"].push(currentData["all"][i]);
                        }
                    }
                }
            }
        }
    },
    _generateCheckingResult: function(request, currentData, callback) {
        if (!$S.isObject(currentData)) {
            $S.callMethod(callback);
            return;
        }
        if (!$S.isObject(request)) {
            $S.callMethod(callback);
            return;
        }
        var requestId = $S.getRequestId();
        var self = this;
        var id = request["workId"];
        if ($S.isStringV2(currentData["filepathApi"])) {
            Get.api(currentData["filepathApi"] + id, requestId, true, function(response) {
                console.log("---------------------------------------------");
                var result = [];
                if ($S.isObject(response) && response["status"] === "SUCCESS") {
                    if ($S.isArray(response["data"])) {
                        for (var i=0; i<response["data"].length; i++) {
                            if ($S.isObject(response["data"][i]) && $S.isArray(response["data"][i]["sheetData"])) {
                                for (j=0; j<response["data"][i]["sheetData"].length; j++) {
                                    result.push(response["data"][i]["sheetData"][j]);
                                }
                            }
                        }
                    }
                }
                currentData["all"] = result;
                self._validateFilepath(currentData);
                $S.callMethod(callback);
            });
        }
        
    },
    generateCheckingResult: function(request, callback) {
        var currentData = null;
        var self = this;
        if ($S.isArray(ConfigData)) {
            for (var i=0; i<ConfigData.length; i++) {
                if ($S.isObject(ConfigData[i]) && $S.isArrayV2(ConfigData[i]["fileConfig"])) {
                    for (var j=0; j<ConfigData[i]["fileConfig"].length; j++) {
                        if ($S.isObject(ConfigData[i]["fileConfig"][j])) {
                            if (!$S.isBooleanTrue(ConfigData[i]["fileConfig"][j]["traversed"])) {
                                currentData = ConfigData[i]["fileConfig"][j];
                                break;
                            }
                        }
                    }
                    if ($S.isObject(currentData)) {
                        FinalResult = currentData;
                        break;
                    }
                }
            }
        }
        if ($S.isObject(currentData)) {
            currentData["traversed"] = true;
            this._generateCheckingResult(request, currentData, function() {
                self.generateCheckingResult(request, callback);
            });
        } else {
            $S.callMethodV1(callback, "SUCCESS");
        }
    }
});
FilepathChecking.extend({
    check: function(request, callback) {
        var excelConfig = ReadConfigData.getExcelConfigByWorkId(request);
        this.setConfigData(excelConfig);
        this.generateCheckingResult(request, function() {
            if ($S.isObject(FinalResult) && $S.isArray(FinalResult["result"])) {
                for (var i=0; i<FinalResult["result"].length; i++) {
                    console.log(FinalResult[FinalResult["result"][i]]);
                }
            } else {
                console.log(FinalResult);
            }
            $S.callMethod(callback);
        });
    }
});
module.exports = FilepathChecking;

})();
