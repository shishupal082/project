var $S = require("../libs/stack.js");
var Logger = require("../common/logger-v2.js");
var FS = require("../common/fsmodule.js");
var DB = require("../common/db.js");
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
            FS.readJsonFile(configFilePath, null, function(jsonData) {
                if ($S.isObjectV2(jsonData)) {
                    ConfigData = jsonData;
                    DB.setDbParameter(jsonData["dbConfig"]);
                    Logger.log("Config data read success.", null, true);
                    DB.getDbConnection(function(dbCon) {
                        database = dbCon;
                        $S.callMethod(callback);
                    });
                } else {
                    Logger.log("Invalid config data: " + configFilePath, null, true);
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
        if ($S.isObject(deviceInfo) && $S.isStringV2(deviceInfo["did"])) {
            did = deviceInfo["did"];
        } else {
            return;
        }
        var dip = hostname;
        var ping_status = status;
        var response_id = $S.generateRandomUUID();
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
        var dbDataApis;
        var result;
        this.readConfigData(configPath, function() {
            if ($S.isObjectV2(ConfigData)) {
                dbDataApis = ConfigData["dbDataApis"];
                FS.readCsvData(dbDataApis, function() {
                    if ($S.isArray(dbDataApis)) {
                        for (var i=0; i<dbDataApis.length; i++) {
                            if ($S.isObject(dbDataApis[i]) && $S.isArray(dbDataApis[i]["tableData"])) {
                                if (dbDataApis[i]["tableData"].length === 1 && $S.isArray(dbDataApis[i]["tableData"][0])) {
                                    result = dbDataApis[i]["tableData"][0];
                                    Logger.log("Total HostList: " + result.length, null, true);
                                    for (var j=0; j<result.length; j++) {
                                        interval = 0;
                                        if ($S.isObject(result[j]) && $S.isStringV2(result[j]["dip"])) {
                                            if ($S.isNumeric(result[j]["delayInSec"])) {
                                                interval = result[j]["delayInSec"] * 1;
                                                if (interval < 0) {
                                                    interval = 0;
                                                }
                                            }
                                            self.pingRequest(result[j], result[j]["dip"], interval, function(deviceInfo, dip, status) {
                                                Logger.log(dip + ":" + status, null, true);
                                                self.savePingResult(deviceInfo, dip, status);
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                });
            } else {
                DB.closeDbConnection(database);
                Logger.log("Invalid config data.", null, true);
            }
        });
    }
});

module.exports = PingThread;

})();
