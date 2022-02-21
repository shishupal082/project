const $S = require("../libs/stack.js");
const FS = require("./fsmodule.js");


(function() {
var Logger = function(config) {
    return new Logger.fn.init(config);
};
var DT = $S.getDT();
var dateTime = DT.getDateTime("YYYY/-/MM/-/DD/-/hh/-/mm", "/");
var logFilename = dateTime+".log";
var fileDir;
var isEnableLoging = false;
Logger.fn = Logger.prototype = {
    constructor: Logger,
    init: function(config) {
        this.config = config;
        return this;
    },
    setLogDir: function() {
        if ($S.isStringV2(this.config)) {
            fileDir = $S.clone(this.config);
        } else {
            console.log("Invalid log dir: " + this.config);
        }
        return this;
    },
    setLogFilename: function() {
        if ($S.isStringV2(this.config)) {
            logFilename = $S.clone(this.config);
        } else {
            console.log("Invalid log filename: " + this.config);
        }
        return this;
    },
    enableLoging: function(callback) {
        FS.isDirExist(fileDir, function(status) {
            if (status) {
                isEnableLoging = true;
            } else {
                console.log("Invalid log dir: " + fileDir);
            }
            $S.callMethodV1(callback, isEnableLoging);
        });
    }
};
Logger.fn.init.prototype = Logger.fn;
$S.extendObject(Logger);
var Q = $S.getQue();
var IsProcessing = false;
Logger.extend({
    _log: function(callback) {
        if (Q.getSize() < 1) {
            IsProcessing = false;
            $S.callMethod(callback);
            return;
        }
        IsProcessing = true;
        var self = this;
        var qItem = Q.Deque();
        var text = qItem["text"];
        if ($S.isObject(qItem)) {
            if (isEnableLoging) {
                FS.appendTextFile(fileDir + logFilename, text, function(status, textData) {
                    console.log(textData);
                    $S.callMethodV2(qItem["callback"], status, textData);
                    self._log(callback);
                });
            } else {
                console.log(text);
                $S.callMethodV2(qItem["callback"], false, text);
                this._log(callback);
            }
        } else {
            this._log(callback);
        }
    },
    log: function(text, callback, isAddDate) {
        if ($S.isBooleanTrue(isAddDate)) {
            text = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/") + " " + text;
        }
        Q.Enque({"text": text, "callback": callback});
        if (IsProcessing === false) {
            this._log();
        }
    },
    logV2: function(obj, callback, isAddDate) {
        if ($S.isObject(obj) || $S.isArray(obj)) {
            this.log(JSON.stringify(obj), callback, isAddDate);
        } else {
            this.log(obj, callback, isAddDate);
        }
    }
});

module.exports = Logger;

})();

