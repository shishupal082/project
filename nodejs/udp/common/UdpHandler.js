var $S = require("../../../static/js/stack.js");
var ConvertExcelToJson = require("../../excel/ConvertExcelToJson.js");
var Logger = require("../../static/logger-v2.js");

ConvertExcelToJson.readConfigData("./excel/config.json");

(function() {
var FinalResponse = {
    statusValidRequest: "00000",
    statusInvalidRequestLength: "00001",
    statusInvalidAppId: "00010",
    endOfResult: "11111",
};
var appIdMappingFunction = {
    "001": ConvertExcelToJson.convert
};
var UdpHandler = function(config) {
    return new UDP.fn.init(config);
};

UdpHandler.fn = UdpHandler.prototype = {
    constructor: UdpHandler,
    init: function(config) {
        this.config = config;
        return this;
    }
};
UdpHandler.fn.init.prototype = UdpHandler.fn;
$S.extendObject(UdpHandler);
UdpHandler.extend({
    _parseRequest: function(msg) {
        var result = {"appId": "", "workId": "", "msg": ""};
        var msg = msg.toString();
        var msgArr = msg.split("|");
        if (msgArr.length < 2) {
            return result;
        }
        if (appIdMappingFunction[msgArr[0]]) {
            result["appId"] = msgArr[0];
            result["workId"] = msgArr[1];
            result["msg"] = msg;
        }
        return result;
    },
    returResponse: function(status, response, callback) {
        var responseLength = 0;
        if ($S.isStringV2(response)) {
            responseLength = response.length;
        }
        $S.callMethodV1(callback, responseLength + "|" + status + "|" + response + "|" + FinalResponse.endOfResult);
    },
    HandleRequest: function(msg, ip, port, length, callback) {
        var status = "", response = "";
        var request = {};
        var returnResponseStatus = true;
        var self = this;
        if (length < 7) {
            Logger.log("Invalid request length");
            status = FinalResponse.statusInvalidRequestLength;
        } else {
            request = this._parseRequest(msg);
            if ($S.isStringV2(request["appId"])) {
                if ($S.isFunction(appIdMappingFunction[request["appId"]])) {
                    status = FinalResponse.statusValidRequest;
                    returnResponseStatus = false;
                    Logger.log("Request: appId: " + request["appId"] + ", workId: " + request["workId"], function() {
                        appIdMappingFunction[request["appId"]](request, function(result) {
                            response = result;
                            self.returResponse(FinalResponse.statusValidRequest, response, callback);
                        });
                    });
                } else {
                    status = FinalResponse.statusInvalidAppId;
                }
            } else {
                Logger.log("Invalid request appId");
                status = FinalResponse.statusInvalidAppId;
            }
        }
        if (returnResponseStatus) {
            this.returResponse(status, response, callback);
        }
    }
});

module.exports = UdpHandler;

})();

/**
 * Request pattern (Total minimum 7 character required)
 *      appId(3 character)|workId(min 3 character)
 * Result pattern
 *      responseLength(same as response.length)|status(5 character)|response|endOfResult(5 character)
 * 
*/
