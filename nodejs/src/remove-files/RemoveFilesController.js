const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const Post = require("../common/apis/apipost.js");

const ReadConfigData = require("../common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");
const RemoveFilesModel = require("./RemoveFilesModel.js");

(function() {
var ConfigData = [];
var runningIds = [];

var FINAL_CALLING_CONFIG = {};

var RemoveFilesController = function(config) {
    return new RemoveFilesController.fn.init(config);
};

RemoveFilesController.fn = RemoveFilesController.prototype = {
    constructor: RemoveFilesController,
    init: function(config) {
        this.config = config;
        return this;
    }
};
RemoveFilesController.fn.init.prototype = RemoveFilesController.fn;

$S.extendObject(RemoveFilesController);
var _self = RemoveFilesController;
RemoveFilesController.extend({
    setConfigData: function(_configData, _container) {
        if ($S.isObject(_configData)) {
            ConfigData = _configData;
            if ($S.isObject(ConfigData["FINAL_CALLING_CONFIG"])) {
                FINAL_CALLING_CONFIG = ConfigData["FINAL_CALLING_CONFIG"];
            }
        }
        if ($S.isArray(_configData)) {
            ConfigData = _configData;
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
RemoveFilesController.extend({
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
RemoveFilesController.extend({
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
            return {"id": FINAL_CALLING_CONFIG[_container["WORK_ID"]], "type": "csv_update"};
        }
        var fileMappingEntry;
        var requiredColIndex;
        var csvRequestIdIndex, callNext;
        var updateMysqlIndex;
        if ($S.isArray(fileMapping) && fileMapping.length >= 0 && $S.isObject(fileMapping[0])) {
            fileMappingEntry = fileMapping[0];
            requiredColIndex = fileMappingEntry["requiredColIndex"];
            if ($S.isArray(requiredColIndex) && requiredColIndex.length >= 8) {
                csvRequestIdIndex = requiredColIndex[5];
                callNext = requiredColIndex[6];
                updateMysqlIndex = requiredColIndex[7];
                if ($S.isNumeric(csvRequestIdIndex)) {
                    csvRequestIdIndex = csvRequestIdIndex*1;
                } else {
                    csvRequestIdIndex = -1;
                }
                if ($S.isNumeric(updateMysqlIndex)) {
                    updateMysqlIndex = updateMysqlIndex*1;
                } else {
                    updateMysqlIndex = -1;
                }
                if ($S.isNumeric(callNext) && $S.isArray(fileMappingEntry["data"])) {
                    callNext = callNext * 1;
                    if (callNext >= 0 && fileMappingEntry["data"].length > callNext && fileMappingEntry["data"][callNext] === "TRUE") {
                        if (updateMysqlIndex >= 0 && fileMappingEntry["data"].length > updateMysqlIndex && $S.isStringV2(fileMappingEntry["data"][updateMysqlIndex])) {
                            return {"id": fileMappingEntry["data"][updateMysqlIndex], "type": "csv_mysql_update"};
                        }
                        if (csvRequestIdIndex >= 0 && fileMappingEntry["data"].length > csvRequestIdIndex && $S.isStringV2(fileMappingEntry["data"][csvRequestIdIndex])) {
                            return {"id": fileMappingEntry["data"][csvRequestIdIndex], "type": "csv_update"};
                        }
                    }
                }
            }

        }
        return {};
    },
    sendNextRequest: function(_container, fileMapping, callback) {
        var nextWork = this.getNextWorkId(_container, fileMapping);
        if ($S.isObject(nextWork) && $S.isStringV2(nextWork["id"])) {
            setTimeout(function(){
                if (nextWork["type"] === "csv_mysql_update") {
                    ReadConfigData.callApi(_self.getBaseUrl() + ":" + _self.getPortNumber() + "/api/update_mysql_table_data_from_csv?table_config_id=" + nextWork["id"], function() {
                        $S.callMethodV1(callback, "SUCCESS");
                    });
                } else {
                    ReadConfigData.callApi(_self.getBaseUrl() + ":" + _self.getPortNumber() + "/api/update_excel_data?requestId=" + nextWork["id"], function() {
                        $S.callMethodV1(callback, "SUCCESS");
                    });
                }
            }, 3000);
        } else {
            $S.callMethodV1(callback, "SUCCESS");
        }
    },
    readApiDataV2: function(sourceApi, model, callback) {
        var api = sourceApi;//_self.getBaseUrl() + ":" + _self.getPortNumber() + "/api/get_excel_data_config?requestId=" + _container["WORK_ID"];
        var __container = {};
        ReadConfigData.readApiDataV2(api, {}, false, function(response, request) {
            if ($S.isArray(response)) {
                Logger.log("Total response length: " + response.length);
            } else {
                Logger.log("Total response length: 0");
            }
            model.changeStatus("SUCCESS", response);
            $S.callMethod(callback);
        });
    }
});
RemoveFilesController.extend({
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
RemoveFilesController.extend({
    _handleRequestV2: function(sourceApi, model, callback) {
        var workId = model.currentId;
        if (runningIds.indexOf(workId) >= 0) {
            model.changeStatus("IN_PROGRESS", []);
            $S.callMethod(callback);
            return;
        }
        runningIds.push(workId);
        this.readApiDataV2(sourceApi, model, function(status) {
            runningIds = runningIds.filter(function(el, i, arr) {
                if (!$S.isString(el) || !$S.isStringV2(el)) {
                    if (model.currentId === el) {
                        return false;
                    }
                }
                return true;
            });
            $S.callMethod(callback);
        });
    },
    removeFile: function(workId, callback) {
        var model = new RemoveFilesModel(ConfigData);
        model.setCurrentConfigData(workId);
        model.changeStatus("FAILURE", []);
        Logger.log("currentConfigData: " + JSON.stringify(model.currentConfigData));
        if (model.isValidTrashPath()) {
            var sourceApi = model.getSourceApi();
            if (sourceApi === null) {
                Logger.log("Invalid source_api in configData.");
                $S.callMethodV1(callback, model);
            } else {
                this._handleRequestV2(sourceApi, model, function() {
                    $S.callMethodV1(callback, model);
                });
            }
        } else {
            Logger.log("Invalid trash path in configData: " + model.getTrashPath());
            $S.callMethodV1(callback, model);
        }
    },
    removeFileV2: function(workId, MODEL, resultData, callback) {
        var _self = this;
        var api = MODEL.getMoveFileApi();
        var postData = {"filepath": "", "move_dir": MODEL.getTrashPath(), "role_id": "defaultRole"};
        var requestId = $S.getRequestId();
        var uniqueRowId;
        var rowData;
        var request;
        if ($S.isArray(resultData)) {
            for (var i=0; i<resultData.length; i++) {
                rowData = resultData[i];
                if ($S.isArray(rowData) && rowData.length > 0) {
                    uniqueRowId = rowData[0];
                } else {
                    continue;
                }
                if (runningIds.indexOf(uniqueRowId) >= 0) {
                    continue;
                }
                if (rowData.length < 3) {
                    continue;
                }
                runningIds.push(uniqueRowId);
                postData["filepath"] = rowData[2];
                Logger.log(i + ": " + JSON.stringify(postData));
                Post.api(api, postData, "", false, function(response) {
                    Logger.log(JSON.stringify(response));
                    _self.removeFileV2(workId, MODEL, resultData, callback);
                });
                return;
            }
            $S.callMethod(callback);
        } else {
            $S.callMethod(callback);
        }
    }
});
module.exports = RemoveFilesController;

})();
