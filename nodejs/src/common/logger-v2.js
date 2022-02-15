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
Logger.extend({
    log: function(text, callback, isAddDate) {
        if ($S.isBooleanTrue(isAddDate)) {
            text = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/") + " " + text;
        }
        if (isEnableLoging) {
            FS.appendTextFile(fileDir + logFilename, text, function(status, textData) {
                console.log(textData);
                $S.callMethodV2(callback, status, textData);
            });
        } else {
            console.log(text);
            $S.callMethodV2(callback, false, text);
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

