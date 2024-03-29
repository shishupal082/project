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
var Q = $S.getQue(100);
var IsProcessing = false;
var ValidResponsePattern = new RegExp(/bytes=32/, "g");
PingThread.extend({
    _sendRequest: function() {
        if (Q.getSize() < 1 || IsProcessing) {
            return;
        }
        var temp = Q.Deque();
        var hostname, deviceInfo;
        var self = this;
        IsProcessing = true;
        if ($S.isObject(temp)) {
            hostname = temp["hostname"];
            deviceInfo = temp["deviceInfo"];
            callback = temp["callback"];
            exec("ping -c 1 " + hostname, function(error, stdout, stderr) {
                if (error === null && stdout !== null && stdout.search(ValidResponsePattern) >= 0) {
                    $S.callMethodV3(callback, deviceInfo, hostname, "Connected");
                } else {
                    $S.callMethodV3(callback, deviceInfo, hostname, "Not Connected");
                }
                IsProcessing = false;
                self._sendRequest();
            });
        } else {
            IsProcessing = false;
            self._sendRequest();
        }
    },
});
PingThread.extend({
    readConfigData: function(configFilePath, callback) {
        if ($S.isStringV2(configFilePath)) {
            FS.readJsonFile(configFilePath, null, function(jsonData) {
                if ($S.isObjectV2(jsonData)) {
                    ConfigData = jsonData;
                    DB.setDbParameter(jsonData["dbConfig"]);
                    Logger.log("PingThread: Config data read success.");
                    DB.getDbConnection(function(dbCon) {
                        database = dbCon;
                        $S.callMethod(callback);
                    });
                } else {
                    Logger.log("Invalid config data: " + configFilePath);
                    $S.callMethod(callback);
                }
            });
        } else {
            Logger.log("Invalid config path: " + configFilePath);
            $S.callMethod(callback);
        }
    },
    savePingResult: function(deviceInfo, hostname, status) {
        var did;
        if ($S.isObject(deviceInfo) && $S.isStringV2(deviceInfo["did"])) {
            did = deviceInfo["did"];
        } else {
            return;
        }
        var dip = hostname;
        var ping_status = status;
        var response_id = $S.generateRandomUUID();
        var q = "INSERT INTO ping_status (did, dip, status, response_id) values('"+did+"', '"+dip+"', '"+ping_status + "', '"+response_id+"')";
        DB.executeQuery(database, q, function(currentDB) {
            database = currentDB;
        });
    },
    pingRequest: function(deviceInfo, hostname, interval, callback) {
        var self = this;
        function sendRequest(hostname, callback) {
            Q.Enque({"hostname": hostname, "deviceInfo": deviceInfo, "callback": callback});
            self._sendRequest();
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
                                    Logger.log("Total HostList: " + result.length);
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
                                                Logger.log(dip + ":" + status);
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
                Logger.log("Invalid config data.");
            }
        });
    }
});

module.exports = PingThread;

})();
