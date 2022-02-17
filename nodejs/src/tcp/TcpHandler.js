var $S = require("../libs/stack.js");
var ConvertExcelToJson = require("../excel/ConvertExcelToJson.js");
var Logger = require("../common/logger-v2.js");
var NmsService = require("../nms/nms_service.js");

(function() {
var FinalResponse = {
    statusValidRequest: "00000",
    statusInvalidRequestLength: "00001",
    statusInvalidAppId: "00010",
    endOfResult: "11111"
};
var EnableAppId = [];
var appIdMappingFunction = {
    "001": ConvertExcelToJson.convert,
    "002": NmsService.getTcpResponse
};
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
            if (EnableAppId.indexOf("001") >= 0) {
                if ($S.isStringV2(jsonData["excel_configpath"])) {
                    ConvertExcelToJson.readConfigData(jsonData["excel_configpath"]);
                }
            }
            if (EnableAppId.indexOf("002") >= 0) {
                if ($S.isStringV2(jsonData["nms_service_configpath"])) {
                    NmsService.readConfigData(jsonData["nms_service_configpath"]);
                }
            }
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
                Logger.log("Request: appId: " + request["appId"] + ", workId: " + request["workId"], function() {
                    appIdMappingFunction[request["appId"]](request, function(result) {
                        response = result;
                        self.returResponse(FinalResponse.statusValidRequest, response, callback);
                    });
                }, true);
            } else {
                Logger.log("Invalid appId: " + request["appId"], function(status) {
                    self.returResponse(FinalResponse.statusInvalidAppId, null, callback);
                }, true);
            }
        } else {
            Logger.log("Invalid request: " + msg, null, true);
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
