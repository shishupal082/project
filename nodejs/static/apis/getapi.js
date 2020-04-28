//gapi : Get api
const https = require('https');
const http = require('http')
const $S = require("../../../static/js/stack.js");
const Logger = require("../logger.js");
const AppConstant = require("../AppConstant.js");

const Get = {
    api: function(api, requestId, callback) {
        function addLog(requestId, message) {
            // message = message.substring(0, 100);
            Logger.log(`${requestId}:${message}`);
        }
        addLog(requestId, `Get request:(${api})`);
        var ports = {
            http: http,
            https: https
        };
        var apiParseData = api.split("://");
        if (apiParseData.length < 2 || ports[apiParseData[0]] == AppConstant.UNDEFINED) {
            var response = {"STATUS": "FAILURE", "REASON": "Invalid request"};
            addLog(requestId, `Get response(${api}):(${JSON.stringify(response)})`);
            callback(response);
            return 1;
        }
        var port = ports[apiParseData[0]];
        port.get(api, (resp) => {
            var data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {data += chunk;});
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                addLog(requestId, `Get response(${api}):(${data})`);
                if ($S.isFunction(callback)) {
                    callback(JSON.parse(data));
                } else {
                    addLog(requestId, "Get callback is not a function.");
                }
            });
        }).on("error", (err) => {
            addLog(requestId, "Error: " + err.message);
            callback({});
        });
    }
};

module.exports = Get;
