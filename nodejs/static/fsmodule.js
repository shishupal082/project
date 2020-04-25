const fs = require("fs");
const path = require("path");

(function(fs) {
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
        fs.opendir(dirPath, (err, r2, r3) => {
            if (err == null) {
                callBack(true);
            } else {
                callBack(false);
            }
        });
        return false;
    }
});

module.exports = FS;

})(fs);

