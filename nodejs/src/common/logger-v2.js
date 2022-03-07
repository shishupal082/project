const $S = require("../libs/stack.js");
const FS = require("./fsmodule.js");


(function() {
var Logger = function(config) {
    return new Logger.fn.init(config);
};
var DT = $S.getDT();
var LogFileDir;
var isEnableLoging = false;
Logger.fn = Logger.prototype = {
    constructor: Logger,
    init: function(config) {
        this.config = config;
        return this;
    },
    setLogDir: function() {
        if ($S.isStringV2(this.config)) {
            LogFileDir = $S.clone(this.config);
        } else {
            console.log("Invalid log dir: " + this.config);
        }
        return this;
    },
    enableLoging: function(callback) {
        FS.isDirExist(LogFileDir, function(status) {
            if (status) {
                isEnableLoging = true;
            } else {
                console.log("Invalid log dir: " + LogFileDir);
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
        if (Q.getSize() < 1 || IsProcessing) {
            $S.callMethod(callback);
            return;
        }
        IsProcessing = true;
        var self = this;
        var qItem = Q.Deque();
        var text = qItem["text"];
        if ($S.isObject(qItem)) {
            if (isEnableLoging) {
                FS.appendTextFile(LogFileDir + DT.getDateTime("YYYY/-/MM/-/DD", "/") +".log", text, function(status, textData) {
                    console.log(textData);
                    $S.callMethodV2(qItem["callback"], status, textData);
                    IsProcessing = false;
                    self._log(callback);
                });
            } else {
                console.log(text);
                $S.callMethodV2(qItem["callback"], false, text);
                IsProcessing = false;
                this._log(callback);
            }
        } else {
            IsProcessing = false;
            this._log(callback);
        }
    },
    log: function(text, notAddDate) {
        if ($S.isBooleanTrue(notAddDate)) {
        } else {
            text = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/") + " " + text;
        }
        Q.Enque({"text": text});
        this._log();
    },
    logV2: function(obj, notAddDate) {
        if ($S.isObject(obj) || $S.isArray(obj)) {
            this.log(JSON.stringify(obj), notAddDate);
        } else {
            this.log(obj, notAddDate);
        }
    }
});

module.exports = Logger;

})();

