var $S = require("../../static/js/stack.js");
var Logger = require("../static/logger-v2.js");
var FS = require("../static/fsmodule.js");
var DB = require("../static/db.js");
var exec = require('child_process').exec;

(function() {
var ConfigData = {};
var database = null;
var PingThread = function(config) {
    return new UDP.fn.init(config);
};

PingThread.fn = PingThread.prototype = {
    constructor: PingThread,
    init: function(config) {
        this.config = config;
        return this;
    }
};

PingThread.fn.init.prototype = PingThread.fn;
$S.extendObject(PingThread);
PingThread.extend({
    readConfigData: function(configFilePath, callback) {
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, {}, function(jsonData) {
                if ($S.isObject(jsonData)) {
                    ConfigData = jsonData;
                    DB.setDbParameter(jsonData["dbConfig"]);
                    Logger.log("Config data read success.", null, true);
                    DB.getDbConnection(function(dbCon) {
                        database = dbCon;
                        $S.callMethod(callback);
                    });
                } else {
                    Logger.log("Invalid config data.", null, true);
                    $S.callMethod(callback);
                }
            });
        } else {
            Logger.log("Invalid config path.", null, true);
            $S.callMethod(callback);
        }
    },
    savePingResult: function(deviceInfo, hostname, status) {
        var did = "1";
        var dip = hostname;
        var ping_status = status;
        var response_id = "2";
        var q = "INSERT INTO ping_status (did, dip, status, response_id) values('"+did+"', '"+dip+"', '"+ping_status + "', '"+response_id+"')";
        database.query(q);
    },
    pingRequest: function(deviceInfo, hostname, interval, callback) {
        var validResponsePattern = new RegExp(/bytes=32/, "g");
        function sendRequest(hostname, callback) {
            exec("ping -c 1 " + hostname, function(error, stdout, stderr) {
                if (error === null && stdout !== null && stdout.search(validResponsePattern) >= 0) {
                    $S.callMethodV3(callback, deviceInfo, hostname, "Connected");
                } else {
                    $S.callMethodV3(callback, deviceInfo, hostname, "Not Connected");
                }
            });
        }
        if ($S.isNumber(interval) && interval > 0) {
            setInterval(function() {
                sendRequest(hostname, callback);
            }, interval * 1000);
        }
        sendRequest(hostname, callback);
    },
    start: function(configPath) {
        var self = this;
        var interval;
        this.readConfigData(configPath, function() {
            if ($S.isObject(ConfigData) && $S.isArray(ConfigData["hostList"])) {
                for (var i=0; i<ConfigData["hostList"].length; i++) {
                    interval = 0;
                    if ($S.isObject(ConfigData["hostList"][i]) && $S.isStringV2(ConfigData["hostList"][i]["hostname"])) {
                        if ($S.isNumber(ConfigData["hostList"][i]["delayInSec"]) && ConfigData["hostList"][i]["delayInSec"] > 0) {
                            interval = ConfigData["hostList"][i]["delayInSec"];
                        }
                        self.pingRequest(ConfigData["hostList"][i], ConfigData["hostList"][i]["hostname"], interval, function(deviceInfo, hostname, status) {
                            Logger.log(hostname + ":" + status, null, true);
                            self.savePingResult(deviceInfo, hostname, status);
                        });
                    }
                }
            }
        });
    }
});

module.exports = PingThread;

})();
