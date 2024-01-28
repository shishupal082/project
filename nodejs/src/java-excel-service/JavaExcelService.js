const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");

const ReadConfigData = require("../common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");

(function() {
var ConfigData = {};
var runningIds = [];

var FINAL_CALLING_CONFIG = {};

var JavaExcelService = function(config) {
    return new JavaExcelService.fn.init(config);
};

JavaExcelService.fn = JavaExcelService.prototype = {
    constructor: JavaExcelService,
    init: function(config) {
        this.config = config;
        return this;
    }
};
JavaExcelService.fn.init.prototype = JavaExcelService.fn;

$S.extendObject(JavaExcelService);
var _self = JavaExcelService;
JavaExcelService.extend({
    setConfigData: function(_configData, _container) {
        if ($S.isObject(_configData)) {
            ConfigData = _configData;
            if ($S.isObject(ConfigData["FINAL_CALLING_CONFIG"])) {
                FINAL_CALLING_CONFIG = ConfigData["FINAL_CALLING_CONFIG"];
            }
        }
    },
    getPortNumber: function() {
        if ($S.isStringV2(ConfigData["port"]) && $S.isNumeric(ConfigData["port"])) {
            return ConfigData["port"];
        }
        return 8082;
    },
    getBaseUrl: function() {
        if ($S.isStringV2(ConfigData["baseUrl"])) {
            return ConfigData["baseUrl"];
        }
        return "http://localhost";
    }
});
JavaExcelService.extend({
    _updateContainer: function(_arg, _container) {
        if (_arg.length >= 1 && $S.isString(_arg[0]) && _arg[0].length > 0) {
            _container["WORK_ID"] = _arg[0];
        } else {
            _container["IS_INVALID_WORK_ID"] = true;
            _container["WORK_ID"] = "gs-csv-file-data-nodejs";
            Logger.log("-----Command line argument 'workId' required.-----");
        }
        _container["WORK_ID"] = "nodejs-"+_container["WORK_ID"];
    }
});
JavaExcelService.extend({
    generateNodejsWorkId: function(_result) {
        var nodejsWorkId = [];
        var nodejsWorkIdIndex = 7;
        if ($S.isNumeric(ConfigData["nodejsWorkIdIndex"])) {
            nodejsWorkIdIndex = ConfigData["nodejsWorkIdIndex"]*1;
        }
        if ($S.isArray(_result) && nodejsWorkIdIndex >= 0) {
            for (var i=0; i<_result.length; i++) {
                if ($S.isArray(_result[i])) {
                    for(var j=0; j<_result[i].length; j++) {
                        if ($S.isArray(_result[i][j]) && _result[i][j].length > nodejsWorkIdIndex) {
                            nodejsWorkId.push(_result[i][j][nodejsWorkIdIndex]);
                        }
                    }
                }
            }
        }
        console.log(nodejsWorkId.sort());
    },
    generateFinalResult: function(_container, _callback) {
      if (_container["FINAL_DATA"].length < 1) {
        return _callback();
      }
      var i,j,k;
      for (i=0; i<_container["FINAL_DATA"].length; i++) {
        if (_container["FINAL_DATA"][i]["status"] === "PENDING") {
          _container["FINAL_DATA"][i]["status"] = "IN_PROGRESS";
          ConvertGoogleSheetsToCsv.generateResult([_container["FINAL_DATA"][i]["excelConfigSpreadsheets"]], [], function(status, result) {
              if (status === "SUCCESS") {
                for (j=0; j<_container["FINAL_DATA"].length; j++) {
                  if (_container["FINAL_DATA"][j]["status"] === "IN_PROGRESS") {
                    _container["FINAL_DATA"][i]["status"] = "SUCCESS";
                    _container["FINAL_DATA"][j]["excelData"] = result;
                    if ($S.isArray(result)) {
                        for(k=0;k<result.length;k++) {
                            console.log("Total row count: " + _container["WORK_ID"] + ": " + result[k].length);
                        }
                    }
                    break;
                  }
                }
                if (_container["IS_INVALID_WORK_ID"]) {
                    _self.generateNodejsWorkId(result);
                    _callback();
                    return;
                }
                _container["IS_ALL_DATA_LOADED"] = true;
                for (j=0; j<_container["FINAL_DATA"].length; j++) {
                    if (_container["FINAL_DATA"][j]["status"] !== "SUCCESS") {
                        _container["IS_ALL_DATA_LOADED"] = false;
                    }
                }
                if (_container["IS_ALL_DATA_LOADED"]){
                  console.log("Data load completed.");
                  CsvDataFormate.replaceSpecialCharacterEachCell(_container["FINAL_DATA"]);
                  ConvertGoogleSheetsToCsv.saveCSVData(_container["FINAL_DATA"]);
                  _callback();
                } else {
                  _self.generateFinalResult(_container, _callback);
                }
              }
          });
          break;
        }
      }
    },
    getNextWorkId: function(_container, fileMapping) {
        if (FINAL_CALLING_CONFIG[_container["WORK_ID"]]) {
            return FINAL_CALLING_CONFIG[_container["WORK_ID"]];
        }
        var fileMappingEntry;
        var requiredColIndex;
        var csvRequestIdIndex, callNext;
        if ($S.isArray(fileMapping) && fileMapping.length >= 0 && $S.isObject(fileMapping[0])) {
            fileMappingEntry = fileMapping[0];
            requiredColIndex = fileMappingEntry["requiredColIndex"];
            if ($S.isArray(requiredColIndex) && requiredColIndex.length >= 7) {
                csvRequestIdIndex = requiredColIndex[5];
                callNext = requiredColIndex[6];
                if ($S.isNumeric(csvRequestIdIndex) && $S.isNumeric(callNext)) {
                    csvRequestIdIndex = csvRequestIdIndex*1;
                    callNext = callNext * 1;
                    if (csvRequestIdIndex >= 0 && callNext >= 0 && $S.isArray(fileMappingEntry["data"])) {
                        if (fileMappingEntry["data"].length > csvRequestIdIndex) {
                            if (fileMappingEntry["data"].length > callNext) {
                                if (fileMappingEntry["data"][callNext] === "TRUE") {
                                    if (fileMappingEntry["data"][csvRequestIdIndex]) {
                                        return fileMappingEntry["data"][csvRequestIdIndex];
                                    } else {
                                        // console.log("next work id not defined for: " + _container["WORK_ID"]);
                                        // console.log("Invalid config for next work id.");
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        return "";
    },
    sendNextRequest: function(_container, fileMapping, callback) {
        var nextWorkId = this.getNextWorkId(fileMapping);
        if ($S.isStringV2(nextWorkId)) {
            setTimeout(function(){
                ReadConfigData.callApi(_self.getBaseUrl() + ":" + _self.getPortNumber() + "/api/update_excel_data?requestId=" + nextWorkId, function() {
                    $S.callMethodV1(callback, "SUCCESS");
                });
            }, 3000);
        } else {
            $S.callMethodV1(callback, "SUCCESS");
        }
    },
    readApiData: function(_container, callback) {
        var api = _self.getBaseUrl() + ":" + _self.getPortNumber() + "/api/get_excel_data_config?requestId=" + _container["WORK_ID"];
        ReadConfigData.readApiDataV2(api, _container, function(excelConfig, __container) {
            var request = {"appId": __container["APP_ID"], "workId": __container["WORK_ID"]};
            var requiredColIndex, spreadsheetIdIndex, sheetNameIndex;
            ConvertGoogleSheetsToCsv.convert(request, excelConfig, function(status, result) {
              if (status === "SUCCESS") {
                if ($S.isArray(result)) {
                  for (var i=0; i<result.length; i++) {
                    if ($S.isObject(result[i]) && $S.isArray(result[i]["data"])) {
                      requiredColIndex = result[i]["requiredColIndex"];
                      if (requiredColIndex.length >= 3) {
                         spreadsheetIdIndex = requiredColIndex[1];
                         sheetNameIndex = requiredColIndex[2];
                      }
                      if (result[i]["data"].length > spreadsheetIdIndex && result[i]["data"].length > sheetNameIndex) {
                        __container["FINAL_DATA"].push({
                          "status": "PENDING",
                          "fileMappingData": result[i]["data"],
                          "excelConfigSpreadsheets": {
                            "spreadsheetId": result[i]["data"][spreadsheetIdIndex],
                            "sheetName": result[i]["data"][sheetNameIndex]
                          },
                          "requiredColIndex": requiredColIndex,
                          "excelData": []
                        });
                      } else {
                        console.log("Invalid file-mapping data: 1");
                        console.log(result[i]);
                      }
                    } else {
                      console.log("Invalid file-mapping data: 2");
                    }
                  }
                  console.log("--------FINAL_DATA length------------- " + __container["WORK_ID"] + "  " + __container["FINAL_DATA"].length);
                    _self.generateFinalResult(__container, function() {
                        _self.sendNextRequest(__container, result, callback);
                    });
                } else {
                  console.log("Invalid config parameter generated.");
                  $S.callMethodV1(callback, "FAILURE");
                }
              } else {
                $S.callMethodV1(callback, "FAILURE");
              }
            });
        });
    }
});
JavaExcelService.extend({
    handleRequest: function(request, callback) {
        var Container = {};
        Container["FINAL_DATA"] = [];
        Container["IS_INVALID_WORK_ID"] = false;
        Container["IS_ALL_DATA_LOADED"] = false;
        var reqMsg, _reqArg = [];
        if ($S.isObject(request)) {
            if ($S.isStringV2(request["appId"])) {
                Container["APP_ID"] = request["appId"];
            }
            if ($S.isStringV2(request["workId"])) {
                Container["WORK_ID"] = request["workId"];
            }
            if ($S.isStringV2(request["msg"])) {
                reqMsg = request["msg"];
            }
            _reqArg.push(Container["WORK_ID"]);
        }
        if (runningIds.indexOf(Container["WORK_ID"]) >= 0) {
            $S.callMethodV1(callback, "IN_PROGRESS");
            return;
        }
        runningIds.push(Container["WORK_ID"]);
        _self._updateContainer(_reqArg, Container);
        _self.readApiData(Container, function(status) {
            runningIds = runningIds.filter(function(el, i, arr) {
                if (!$S.isString(el) || !$S.isStringV2(el)) {
                    el = "gs-csv-file-data-nodejs";
                }
                if ("nodejs-"+el === Container["WORK_ID"]) {
                    return false;
                }
                return true;
            });
            $S.callMethodV2(callback, status+"|"+Container["WORK_ID"], Container["FINAL_DATA"]);
        });
    }
});
module.exports = JavaExcelService;

})();
