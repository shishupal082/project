var $S = require("../libs/stack.js");
var Logger = require("../common/logger-v2.js");
var FS = require("../common/fsmodule.js");
var DB = require("../common/db.js");
var exec = require('child_process').exec;
var mysql = require('mysql');
var generateFile = require("../common/generateFile.js");

(function() {
var ConfigData = {};
var isConfigDataRead = false;
var database = null;
var dt = $S.getDT();
var NmsService = function(config) {
    return new UDP.fn.init(config);
};

NmsService.fn = NmsService.prototype = {
    constructor: NmsService,
    init: function(config) {
        this.config = config;
        return this;
    }
};

NmsService.fn.init.prototype = NmsService.fn;
$S.extendObject(NmsService);
NmsService.extend({
    parseRequest: function(request) {
        var result = {"appId": "", "workId": "", "timeRange": "", "filterParameter": "", "limitParam": "", "uiFilterParam": ""};
        if (!$S.isStringV2(request)) {
            return result;
        }
        var msgArr = request.split("|");
        if (msgArr.length > 0) {
            result["appId"] = msgArr[0];
        }
        if (msgArr.length > 1) {
            result["workId"] = msgArr[1];
        }
        if (["NMS_Service", "NMS_Service_File"].indexOf(result["workId"]) >= 0) {
            if (msgArr.length > 2) {
                result["timeRange"] = msgArr[2];
            }
            if (msgArr.length > 3) {
                result["filterParameter"] = msgArr[3];
            }
            if (msgArr.length > 4) {
                result["limitParam"] = msgArr[4];
            }
            if (msgArr.length > 5) {
                result["uiFilterParam"] = msgArr[5];
            }
        }
        if (result["workId"] === "NMS_Service_File") {
            if (msgArr.length > 6) {
                result["username"] = msgArr[6];
            }
            if (msgArr.length > 7) {
                result["filename"] = msgArr[7];
            }
            if ($S.isStringV2(result["username"]) && (result["username"].indexOf("/") >= 0 || result["username"].indexOf("\\") >= 0)) {
                result["username"] = "";
            }
            if ($S.isStringV2(result["filename"]) && (result["filename"].indexOf("/") >= 0 || result["filename"].indexOf("\\") >= 0)) {
                result["filename"] = "";
            }
        }
        return result;
    },
    setConfigData: function(_configData) {
        ConfigData = _configData;
    },
});
NmsService.extend({
    readConfigData: function(configFilePath, callback) {
        isConfigDataRead = true;
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, null, function(jsonData) {
                if ($S.isObject(jsonData)) {
                    ConfigData = jsonData;
                    Logger.log("NmsService: Config data read success.");
                } else {
                    Logger.log("Invalid config data: " + configFilePath);
                }
                $S.callMethod(callback);
            });
        } else {
            Logger.log("Invalid config path: " + configFilePath);
            $S.callMethod(callback);
        }
    },
    _connectDB: function(callback) {
        if ($S.isObjectV2(ConfigData) && $S.isObjectV2(ConfigData["dbConfig"])) {
            DB.setDbParameter(ConfigData["dbConfig"]);
            DB.getDbConnection(function(dbCon) {
                database = dbCon;
                $S.callMethod(callback);
            });
        } else {
            Logger.log("Invalid config data.");
            $S.callMethod(callback);
        }
    },
    _handleTimestamp: function(result) {
        if ($S.isArray(result)) {
            for(var i=0; i<result.length; i++) {
                if ($S.isObject(result[i])) {
                    result[i]["timestamp"] = dt.formateDateTime("YYYY/-/MM/-/DD/ /hh/:/mm", "/", result[i].timestamp);
                }
            }
        }
    },
    _getTimeRangeParameter: function(timeRange) {
        var finalTimeRange = dt.getDateRange(timeRange);
        var finalStr = "", startTime = "", endTime = "";
        if ($S.isArray(finalTimeRange) && finalTimeRange.length === 2) {
            startTime = finalTimeRange[0];
            endTime = finalTimeRange[1];
        }
        if ($S.isStringV2(startTime)) {
            finalStr += " and timestamp >= '" + startTime + "'";
        }
        if ($S.isStringV2(endTime)) {
            finalStr += " and timestamp < '" + endTime + "'";
        }
        return finalStr;
    },
    getDevicePingStatus: function(requestParam, callback) {
        var finalResult = [];
        var self = this;
        var tableFilterParam = "";

        if (!$S.isObject(requestParam)) {
            $S.callMethodV1(callback, finalResult);
            return;
        }

        var timeRange = requestParam["timeRange"];
        var filterParameter = requestParam["filterParameter"];
        var limitParam = requestParam["limitParam"];
        var uiFilterParam = requestParam["uiFilterParam"];

        if (!$S.isNumeric(limitParam)) {
            limitParam = "";
        }
        if ($S.isStringV2(filterParameter)) {
            tableFilterParam += " and " + filterParameter;
        }
        if ($S.isStringV2(uiFilterParam)) {
            tableFilterParam += " and " + uiFilterParam;
        }
        var timeParameter = this._getTimeRangeParameter(timeRange);
        var q = "SELECT did, dip, status, response_id, timestamp from ping_status where deleted = false "+ tableFilterParam + timeParameter + " order by s_no desc";
        if ($S.isStringV2(limitParam)) {
            q += " limit " + limitParam;
        }
        q += ";";
        Logger.log(q);
        if (database === null) {
            $S.callMethodV1(callback, finalResult);
            return;
        }
        database.query(q, function (err, result, fields) {
            if (err) {
                Logger.log(err);
            }
            if ($S.isArray(result) && result.length > 0) {
                finalResult = result;
            }
            self._handleTimestamp(finalResult);
            $S.callMethodV1(callback, finalResult);
        });
    },
    _getData: function(requestParam, callback) {
        var self = this;
        if (isConfigDataRead) {
            this._connectDB(function() {
                self.getDevicePingStatus(requestParam, function(result) {
                    DB.closeDbConnection(database);
                    database = null;
                    $S.callMethodV1(callback, result);
                });
            });
        } else {
            Logger.log("Config data read pending.");
            $S.callMethodV1(callback, "[]");
        }
    },
    getTcpResponse: function(request, callback) {
        if (!$S.isObject(request)) {
            $S.callMethodV1(callback, "FAILURE");
            return;
        }
        var requestParam = NmsService.parseRequest(request["msg"]);
        Logger.log("Request: " + JSON.stringify(requestParam));
        var isNotFound = true, filepath;
        NmsService._getData(requestParam, function(result) {
            if (requestParam["workId"] === "NMS_Service_File") {
                if ($S.isObjectV2(ConfigData) && $S.isStringV2(ConfigData["fileSaveDir"])) {
                    if ($S.isStringV2(requestParam["username"]) && $S.isStringV2(requestParam["filename"])) {
                        filepath = requestParam["username"] + "/" + requestParam["filename"] + ".json";
                        isNotFound = false;
                        FS.isDirExist(ConfigData["fileSaveDir"], function(status) {
                            if (status) {
                                FS.isDirExist(ConfigData["fileSaveDir"] + requestParam["username"], function(status) {
                                    if (!status) {
                                        FS.createDir(ConfigData["fileSaveDir"] + requestParam["username"]);
                                    }
                                    Logger.log("Result length: " + JSON.stringify(result).length + ", count: " + result.length);
                                    generateFile.saveTextV2([JSON.stringify(result)], ConfigData["fileSaveDir"] + filepath, function(status) {
                                        Logger.log("File operation completed.");
                                        if (FS.isFile(ConfigData["fileSaveDir"] + filepath)) {
                                            result = {"status": "SUCCESS", "type": "file", "filepath": filepath};
                                        } else {
                                            result = {"status": "FAILURE", "type": "file", "filepath": null};
                                        }
                                        $S.callMethodV1(callback, JSON.stringify(result));
                                    });
                                });
                            } else {
                                Logger.log("fileSaveDir: " + ConfigData["fileSaveDir"] + " does not exist.");
                                result = {"status": "SUCCESS", "type": "data", "response": result};
                                $S.callMethodV1(callback, JSON.stringify(result));
                            }
                        });
                    } else {
                        Logger.log("Invalid request parameter username or filename: " + requestParam["username"] + "/" + requestParam["filename"]);
                    }
                } else {
                    Logger.log("Invalid config parameter fileSaveDir: " + ConfigData["fileSaveDir"]);
                }
            }
            if (isNotFound) {
                result = {"status": "SUCCESS", "type": "data", "response": result};
                $S.callMethodV1(callback, JSON.stringify(result));
            }
        });
    }
});

module.exports = NmsService;

})();
