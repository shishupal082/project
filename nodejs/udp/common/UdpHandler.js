var $S = require("../../../static/js/stack.js");
var ConvertExcelToJson = require("../../excel/ConvertExcelToJson.js");

ConvertExcelToJson.setConfigPath("./excel/config.json");
ConvertExcelToJson.readConfigData();

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
        var result = {"appId": "", "workId": ""};
        var msg = msg.toString();
        var msgArr = msg.split("|");
        if (msgArr.length < 2) {
            return result;
        }
        result["appId"] = msgArr[0];
        result["workId"] = msgArr[1];
        if (appIdMappingFunction[msgArr[0]]) {
            result["appId"] = msgArr[0];
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
            console.log("Invalid request length");
            status = FinalResponse.statusInvalidRequestLength;
        } else {
            request = this._parseRequest(msg);
            if ($S.isStringV2(request["appId"])) {
                status = FinalResponse.statusValidRequest;
                if ($S.isFunction(appIdMappingFunction[request["appId"]])) {
                    returnResponseStatus = false;
                    appIdMappingFunction[request["appId"]](request, function(result) {
                        response = result;
                        self.returResponse(FinalResponse.statusValidRequest, response, callback);
                    });
                }
            } else {
                console.log("Invalid request appId");
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
 * Request pattern
 *      appId(3 bit)|workId(3 bit)
 * Result pattern
 *      responseLength|status(5 bit)|response|endOfResult(5 bit)
 * 
*/