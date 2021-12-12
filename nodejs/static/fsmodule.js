const fs = require("fs");
const path = require("path");

(function(fs, path) {
var FS = function(config) {
    return new FS.fn.init(config);
};
FS.fn = FS.prototype = {
    constructor: FS,
    init: function(config) {
        this.config = config;
        return this;
    }
};
FS.fn.init.prototype = FS.fn;
FS.extend = FS.fn.extend = function(options) {
    if (typeof options == "object" && isNaN(options.length)) {
        for (var key in options) {
            if (typeof options[key] == "function") {
                /*If method already exist then it will be overwritten*/
                if (typeof FS[key]  == "function") {
                    console.log('Method "' + FS.name + "." + key + '" is overwritten.');
                }
                FS[key] = options[key];
            }
        }
    }
    return FS;
};

FS.extend({
    isFile: function(pathname) {
        try {
            var isFile = fs.statSync(pathname).isFile();
            return isFile;
        } catch(ex) {
            return false;
        }
    },
    isDirectory: function(pathname) {
        try {
            var isDir = fs.statSync(pathname).isDirectory();
            return isDir;
        } catch(ex) {
            return false;
        }
    },
    getFileName: function(pathname) {
        if (typeof pathname == "string") {
            return path.basename(pathname);
        }
        return "";
    },
    getExtention: function(pathname) {
        if (typeof pathname == "string") {
            return path.extname(pathname);
        }
        return "";
    },
    isFileExist: function(filePath, callBack) {
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err == null) {
                callBack(true, filePath);
            } else {
                callBack(false, filePath);
            }
        });
        return false;
    },
    copyFile: function(srcFilePath, destinationDir) {
        var filename = path.basename(srcFilePath);
        fs.copyFile(srcFilePath, destinationDir + filename, (err) => {
          if (err) {
            console.log(`Error in coping file '${srcFilePath}' to '${destinationDir}'`);
          }
        });
    },
    isDirExist: function(dirPath, callBack) {
        if (typeof dirPath != "string") {
            return callBack(false);
        }
        var dirBuf = Buffer.from(dirPath);
        fs.readdir(dirBuf, (err, files) => {
            if (err) {
                callBack(false);
            } else {
                callBack(true);
            }
        });
        return false;
    }
});

FS.extend({
    readJsonFile: function(filepath, defaultData, callback) {
        FS.isFileExist(filepath, function(status, filepath) {
            if (status) {
                var rawdata = fs.readFileSync(filepath);
                try {
                    var jsonData = JSON.parse(rawdata);
                    callback(jsonData);
                } catch(e) {
                    console.log("Error in reading file: " + filepath);
                    callback(defaultData);
                }
            } else {
                callback(defaultData);
            }
        });
    },
    readTextFile: function(filepath, defaultData, callback) {
        FS.isFileExist(filepath, function(status, filepath) {
            if (status) {
                fs.readFile(filepath, "utf8", function(err, data) {
                    if (err) throw err;
                    callback(data);
                });
            } else {
                console.log("Filepath does not exist: " + filepath);
                callback(defaultData);
            }
        });
    },
    appendTextFile: function(filepath, textData, callback) {
        fs.appendFile(filepath, "\n" + textData, "utf8", function(err) {
            if (err) throw err;
            if (typeof callback === "function") {
                callback(true, textData);
            }
        });
    },
    deleteContent: function(filepath, callback) {
        if (this.isFile(filepath)) {
            fs.writeFile(filepath, '', callback);
        } else {
            $S.callMethod(callback);
        }
    }
});

module.exports = FS;

})(fs, path);

