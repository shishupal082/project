const $S = require("../static/js/stack.js");
const FS = require("./static/fsmodule.js");
const syncData = require("./static/data/syncAppFilesData.js");

var args = process.argv;

function copyFile(filename, dir) {
    FS.isDirExist(dir, function(exist) {
        if (exist) {
            // console.log(`Coping file '${filename}' to directory '${dir}'`);
            FS.copyFile(filename, dir);
        } else {
            console.log(`Destination directory does not exist: '${dir}'`);
        }
    });
}

function syncAppFiles(name) {
    if (syncData[name]) {
        var file = syncData[name].src;
        var destination = syncData[name].destinationDir;
        if (!$S.isArray(file)) {
            if ($S.isString(file)) {
                file = [file];
            }
        }
        if (!$S.isArray(destination)) {
            if ($S.isString(destination)) {
                destination = [destination];
            }
        }
        for (var i = 0; i < file.length; i++) {
            FS.isFileExist(file[i], function(exist, filename) {
                for (var j = 0; j < destination.length; j++) {
                    if (exist) {
                        if ($S.isString(destination[j])) {
                            copyFile(filename, destination[j]);
                        } else {
                            console.log(`Invalid destination directory: '${destination[j]}'`);
                        }
                    } else {
                        console.log(`Source file '${filename}' does not exist`);
                    }
                }
            });
        }
    }
}

for (var key in syncData) {
    syncAppFiles(key);
}
