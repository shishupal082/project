const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");

const ReadConfigData = require("../common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");

(function() {
var ConfigData = {};
var FinalResult = [];

var APP_ID = "";
var WORK_ID = "";
var PORT = "8082";
var BASE_URL = "http://localhost";

var nodejsWorkIdIndex = 7;
var nodejsWorkId = [];

var FINAL_CALLING_CONFIG = {};
var FINAL_DATA = [];
var IS_INVALID_WORK_ID = false;
var IS_ALL_DATA_LOADED = false;

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
JavaExcelService.extend({
    setConfigData: function(_configData) {
        ConfigData = _configData;
        if ($S.isObject(ConfigData)) {
            if ($S.isStringV2(ConfigData["port"]) && $S.isNumeric(PORT)) {
                PORT = ConfigData["port"];
            }
            if ($S.isStringV2(ConfigData["baseUrl"])) {
                BASE_URL = ConfigData["baseUrl"];
            }
            if ($S.isObject(ConfigData["FINAL_CALLING_CONFIG"])) {
                FINAL_CALLING_CONFIG = ConfigData["FINAL_CALLING_CONFIG"];
            }
            if ($S.isNumeric(ConfigData["nodejsWorkIdIndex"])) {
                nodejsWorkIdIndex = ConfigData["nodejsWorkIdIndex"]*1;
            }
        }
    },
    getFinalResult: function() {
        return $S.clone(FinalResult);
    },
    clearFinalResult: function() {
        FinalResult = [];
    }
});
JavaExcelService.extend({
    _updateConfigData: function(_arg) {
        if (_arg.length >= 1 && _arg[0].length > 0) {
            WORK_ID = _arg[0];
        } else {
            IS_INVALID_WORK_ID = true;
            WORK_ID = "gs-csv-file-data-nodejs";
            Logger.log("-----Command line argument 'workId' required.-----");
        }
        WORK_ID = "nodejs-"+WORK_ID;
    }
});
JavaExcelService.extend({
    generateNodejsWorkId: function(_result) {
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
    generateFinalResult: function(_callback) {
      if (FINAL_DATA.length < 1) {
        return _callback();
      }
      var i,j,k;
      for (i=0; i<FINAL_DATA.length; i++) {
        if (FINAL_DATA[i]["status"] === "PENDING") {
          FINAL_DATA[i]["status"] = "IN_PROGRESS";
          ConvertGoogleSheetsToCsv.generateResult([FINAL_DATA[i]["excelConfigSpreadsheets"]], function(status) {
              if (status === "SUCCESS") {
                var result = ConvertGoogleSheetsToCsv.getFinalResult();
                ConvertGoogleSheetsToCsv.clearFinalResult();
                for (j=0; j<FINAL_DATA.length; j++) {
                  if (FINAL_DATA[j]["status"] === "IN_PROGRESS") {
                    FINAL_DATA[i]["status"] = "SUCCESS";
                    FINAL_DATA[j]["excelData"] = result;
                    if ($S.isArray(result)) {
                        for(k=0;k<result.length;k++) {
                            console.log("Total row count: " + result[k].length);
                        }
                    }
                    break;
                  }
                }
                if (IS_INVALID_WORK_ID) {
                    JavaExcelService.generateNodejsWorkId(result);
                    _callback();
                    return;
                }
                IS_ALL_DATA_LOADED = true;
                for (j=0; j<FINAL_DATA.length; j++) {
                  if (FINAL_DATA[j]["status"] !== "SUCCESS") {
                    IS_ALL_DATA_LOADED = false;
                  }
                }
                if (IS_ALL_DATA_LOADED){
                  console.log("Data load completed.");
                  CsvDataFormate.replaceSpecialCharacterEachCell(FINAL_DATA);
                  // CsvDataFormate.format(FINAL_DATA);
                  ConvertGoogleSheetsToCsv.saveCSVData(FINAL_DATA);
                  _callback();
                } else {
                  JavaExcelService.generateFinalResult(_callback);
                }
              }
          });
          break;
        }
      }
    },
    getNextWorkId: function(fileMapping) {
        if (FINAL_CALLING_CONFIG[WORK_ID]) {
            return FINAL_CALLING_CONFIG[WORK_ID];
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
                                        // console.log("next work id not defined for: " + WORK_ID);
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
    sendNextRequest: function(callback, fileMapping) {
        var nextWorkId = this.getNextWorkId(fileMapping);
        if ($S.isStringV2(nextWorkId)) {
            setTimeout(function(){
                ReadConfigData.callApi(BASE_URL + ":" + PORT + "/api/update_excel_data?requestId=" + nextWorkId, function() {
                    $S.callMethodV1(callback, "SUCCESS");
                });
            }, 3000);
        } else {
            $S.callMethodV1(callback, "SUCCESS");
        }
    },
    readApiData: function(callback) {
      ReadConfigData.readApiData(BASE_URL + ":" + PORT + "/api/get_excel_data_config?requestId=" + WORK_ID, function() {
        var request = {"appId": APP_ID, "workId": WORK_ID};
        var excelConfig = ReadConfigData.getApiData();
        var requiredColIndex, spreadsheetIdIndex, sheetNameIndex;
        CsvDataFormate.updateConfigData(WORK_ID, excelConfig);
        ConvertGoogleSheetsToCsv.convert(request, excelConfig, function(status) {
          if (status === "SUCCESS") {
            var fileMapping = ConvertGoogleSheetsToCsv.getFinalResult();
            ConvertGoogleSheetsToCsv.clearFinalResult();
            if (fileMapping) {
              for (var i=0; i<fileMapping.length; i++) {
                if ($S.isObject(fileMapping[i]) && $S.isArray(fileMapping[i]["data"])) {
                  requiredColIndex = fileMapping[i]["requiredColIndex"];
                  if (requiredColIndex.length >= 3) {
                     spreadsheetIdIndex = requiredColIndex[1];
                     sheetNameIndex = requiredColIndex[2];
                  }
                  if (fileMapping[i]["data"].length > spreadsheetIdIndex && fileMapping[i]["data"].length > sheetNameIndex) {
                    FINAL_DATA.push({
                      "status": "PENDING",
                      "fileMappingData": fileMapping[i]["data"],
                      "excelConfigSpreadsheets": {
                        "spreadsheetId": fileMapping[i]["data"][spreadsheetIdIndex],
                        "sheetName": fileMapping[i]["data"][sheetNameIndex]
                      },
                      "requiredColIndex": requiredColIndex,
                      "excelData": []
                    });
                  } else {
                    console.log("Invalid file-mapping data: 1");
                    console.log(fileMapping[i]);
                  }
                } else {
                  console.log("Invalid file-mapping data: 2");
                }
              }
              // console.log(FINAL_DATA);
              console.log("--------FINAL_DATA length------------- " + FINAL_DATA.length);
              // console.log(fileMapping);
              // console.log(FINAL_DATA);
              // console.log(FINAL_DATA[0]["excelConfig"]);
                JavaExcelService.generateFinalResult(function() {
                    JavaExcelService.sendNextRequest(callback, fileMapping);
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
        FINAL_DATA = [];
        IS_INVALID_WORK_ID = false;
        IS_ALL_DATA_LOADED = false;
        var reqMsg, _reqArg = [];
        if ($S.isObject(request)) {
            if ($S.isStringV2(request["appId"])) {
                APP_ID = request["appId"];
            }
            if ($S.isStringV2(request["workId"])) {
                WORK_ID = request["workId"];
            }
            if ($S.isStringV2(request["msg"])) {
                reqMsg = request["msg"];
            }
            _reqArg.push(WORK_ID);
        }
        JavaExcelService._updateConfigData(_reqArg);
        JavaExcelService.readApiData(function(status) {
            $S.callMethodV1(callback, status)
        });
    }
});
module.exports = JavaExcelService;

})();
