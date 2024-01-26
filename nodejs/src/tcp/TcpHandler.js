var $S = require("../libs/stack.js");
const ReadConfigData = require("../common/ReadConfigData.js");
var ConvertExcelToCsv = require("../excel/ConvertExcelToCsv.js");
var ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
var JavaExcelService = require("../java-excel-service/JavaExcelService.js");
var Logger = require("../common/logger-v2.js");
var NmsService = require("../nms/nms_service.js");
var DBAccess = require("../db/DBAccess.js");

(function() {
var FinalResponse = {
    statusValidRequest: "00000",
    statusInvalidRequestLength: "00001",
    statusInvalidAppId: "00010",
    endOfResult: "11111"
};
var EnableAppId = [];
var appIdMappingFunction = {
    "001": ConvertExcelToCsv.convert,
    "002": NmsService.getTcpResponse,
    "003": DBAccess.HandleDbAccess,
    "004": ConvertGoogleSheetsToCsv.convert,
    "005": JavaExcelService.handleRequest
};
var Q = $S.getQue(10);
var TcpHandler = function(config) {
    return new UDP.fn.init(config);
};

TcpHandler.fn = TcpHandler.prototype = {
    constructor: TcpHandler,
    init: function(config) {
        this.config = config;
        return this;
    }
};
TcpHandler.fn.init.prototype = TcpHandler.fn;
$S.extendObject(TcpHandler);

TcpHandler.extend({
    _readApplicationConfigData: function(callback) {
        if (Q.getSize() < 1) {
            $S.callMethod(callback);
            return;
        }
        var qItem = Q.Deque();
        if ($S.isObject(qItem) && $S.isStringV2(qItem["config_path"]) && $S.isFunction(qItem["setConfigData"])) {
            ReadConfigData.readData(qItem["config_path"], function() {
                qItem["setConfigData"](ReadConfigData.getData());
                TcpHandler._readApplicationConfigData(callback);
            });
        } else {
            Logger.log("Invalid qItem.");
            console.log(qItem);
            this._readApplicationConfigData(callback);
        }
    },
});
TcpHandler.extend({
    _parseRequest: function(msg) {
        var result = {"appId": "", "workId": "", "msg": ""};
        var msgArr = msg.split("|");
        if (msgArr.length < 2) {
            result["appId"] = msg;
            return result;
        }
        if (EnableAppId.indexOf(msgArr[0]) >= 0 && appIdMappingFunction[msgArr[0]]) {
            result["appId"] = msgArr[0];
            result["workId"] = msgArr[1];
            result["msg"] = msg;
        }
        return result;
    },
    handleConfigData: function(jsonData) {
        if ($S.isObjectV2(jsonData)) {
            if ($S.isArray(jsonData["enableAppId"])) {
                EnableAppId = jsonData["enableAppId"];
            }
            Logger.log("EnableAppId: " + JSON.stringify(EnableAppId));
            if (EnableAppId.indexOf("001") >= 0) {
                if ($S.isStringV2(jsonData["excel_configpath"])) {
                    Q.Enque({"config_path": jsonData["excel_configpath"], "setConfigData": ConvertExcelToCsv.setConfigData});
                }
            }
            if (EnableAppId.indexOf("002") >= 0) {
                if ($S.isStringV2(jsonData["nms_service_configpath"])) {
                    Q.Enque({"config_path": jsonData["nms_service_configpath"], "setConfigData": NmsService.setConfigData});
                }
            }
            if (EnableAppId.indexOf("003") >= 0) {
                if ($S.isStringV2(jsonData["db_access_configpath"])) {
                    Q.Enque({"config_path": jsonData["db_access_configpath"], "setConfigData": DBAccess.setConfigData});
                }
            }
            if (EnableAppId.indexOf("004") >= 0) {
                if ($S.isStringV2(jsonData["google_sheets_configpath"])) {
                    Q.Enque({"config_path": jsonData["google_sheets_configpath"], "setConfigData": ConvertGoogleSheetsToCsv.setConfigData});
                }
            }
            if (EnableAppId.indexOf("005") >= 0) {
                if ($S.isStringV2(jsonData["java_excel_config"])) {
                    Q.Enque({"config_path": jsonData["java_excel_config"], "setConfigData": JavaExcelService.setConfigData});
                }
            }
            this._readApplicationConfigData(function() {
                Logger.log("Config data read completed.");
            });
        }
    },
    returResponse: function(status, response, callback) {
        var responseLength;
        if (!$S.isString(response)) {
            response = "";
        }
        responseLength = 1 + 5 + 1 + response.length + 1 + 5;
        $S.callMethodV1(callback, responseLength + "|" + status + "|" + response + "|" + FinalResponse.endOfResult);
    },
    HandleRequest: function(msg, ip, port, length, callback) {
        var status = "", response = "";
        var request = {};
        var returnResponseStatus = true;
        var self = this;
        msg = msg.toString();
        request = this._parseRequest(msg);
        if ($S.isStringV2(request["appId"])) {
            returnResponseStatus = false;
            if ($S.isFunction(appIdMappingFunction[request["appId"]])) {
                status = FinalResponse.statusValidRequest;
                Logger.log("Request: appId: " + request["appId"] + ", workId: " + request["workId"]);
                appIdMappingFunction[request["appId"]](request, function(result) {
                    if ($S.isString(result)) {
                        response = result;
                    } else {
                        response = "INVALID_RESPONSE";
                    }
                    self.returResponse(FinalResponse.statusValidRequest, response, callback);
                });
            } else {
                Logger.log("Invalid appId: " + request["appId"]);
                self.returResponse(FinalResponse.statusInvalidAppId, null, callback);
            }
        } else {
            Logger.log("Invalid request: " + msg);
            status = FinalResponse.statusInvalidAppId;
        }
        if (returnResponseStatus) {
            this.returResponse(status, response, callback);
        }
    }
});

module.exports = TcpHandler;

})();

/**
 * Request pattern (Total minimum 7 character required)
 *      appId(3 character)|workId(min 3 character)
 * Result pattern
 *      responseLength(Total length max 5 digit excluding responseLength size)|status(5 character)|response|endOfResult(5 character)
 *      for response = SUCCESS
 *          responseLength = 1+5+1+7(SUCCESS length)+1+5 = 20
 *      final response = 20|00000|SUCCESS|11111
 * 
*/
