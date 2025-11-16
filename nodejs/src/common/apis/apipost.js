//gapi : Get api
const https = require('https');
const http = require('http');
const request = require('request');
const $S = require("../../libs/stack.js");
const Logger = require("../logger-v2.js");
const AppConstant = require("../AppConstant.js");

const Post = {
    api: function(api, postData, requestId, elableLogging, callback) {
        function addLog(requestId, message) {
            // message = message.substring(0, 100);
            if (elableLogging) {
                if ($S.isStringV2(requestId)) {
                    Logger.log(`${requestId}:${message}`);
                } else {
                    Logger.log(`${message}`);
                }
            }
        }
        addLog(requestId, `Post request:(${api})`);
        var ports = {
            http: http,
            https: https
        };
        var apiParseData = api.split("://");
        if (apiParseData.length < 2 || ports[apiParseData[0]] == AppConstant.UNDEFINED) {
            var response = {"STATUS": "FAILURE", "REASON": "Invalid request"};
            addLog(requestId, `Get response(${api}):(${JSON.stringify(response)})`);
            callback(response);
            return 0;
        }
        var options = {
            url: api,
            json: true,
            body: postData
        };
        request.post(options, (err, res, body) => {
            if (err) {
                addLog(requestId, "Error: " + err.message);
            }
            if ($S.isFunction(callback)) {
                callback(body);
            } else {
                addLog(requestId, "Get callback is not a function.");
            }
        });
    }
};

module.exports = Post;
