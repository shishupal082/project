const $S = require("../../../static/js/stack.js");
const Logger = require("../logger.js");
const FS = require("../fsmodule.js");
const AppConstant = require("../AppConstant.js");

(function() {
var File = function(config) {
    return new File.fn.init(config);
};

File.fn = File.prototype = {
    constructor: File,
    init: function(config) {
        return this;
    }
};

File.fn.init.prototype = File.fn;

File.extend = File.fn.extend = function(options) {
    if ($S.isObject(options)) {
        for (var key in options) {
            if ($S.isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if ($S.isFunction(this[key])) {
                    Logger.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
var FileObj = (function() {
    function FileObj(filePath, callback) {
        this._path = filePath;
        this._isFile = FS.isFile(this._path);
        this._isDir = FS.isDirectory(this._path);
        if (this._isFile) {
            this._extention = FS.getExtention(this._path);
            this._fileName = FS.getFileName(this._path);
        } else {
            this._extention = "";
            this._fileName = "";
        }
    }
    FileObj.prototype.getPath = function() {
        return this._path;
    };
    FileObj.prototype.isFile = function() {
        return this._isFile;
    };
    FileObj.prototype.isDirectory = function() {
        return this._isDir;
    };
    FileObj.prototype.getExtention = function() {
        return this._extention;
    };
    FileObj.prototype.getFileName = function() {
        return this._fileName;
    };
    FileObj.prototype.getFileMediaType = function(defaulMediaType) {
        if (!this.isFile()) {
            return "";
        }
        var mediaType = AppConstant.fileMediaType;
        var extention = this.getExtention();
        if (mediaType && mediaType[extention] !== AppConstant.UNDEFINED) {
            return mediaType[extention];
        }
        if ($S.isString(defaulMediaType)) {
            return defaulMediaType;
        }
        return "";
    };
    FileObj.prototype.getAll = function() {
        var response = {};
        response["path"] = this.getPath();
        response["isFile"] = this.isFile();
        response["isDir"] = this.isDirectory();
        response["extention"] = this.getExtention();
        response["fileName"] = this.getFileName();
        response["mediaType"] = this.getFileMediaType();
        return response;
    };
    return FileObj;
})();
File.extend({
    getFile: function(filePath) {
        return new FileObj(AppConstant.PUBLIC_DIR + filePath);
        // return new FileObj();
    },

});
module.exports = File;
})();
