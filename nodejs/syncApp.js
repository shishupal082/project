const $S = require("../static/js/stack.js");
const FS = require("./static/fsmodule.js");

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

var syncData = {
    "jquery": {
        "src": "../static/libs/jquery-2.1.3.js",
        "destinationDir": [
            {
                "dir": "../java/yard/src/main/resources/assets/static/libs/",
                "clear": true
            }
        ]
        
    },
    "bootstrap": {
        "src": "../static/libs/bootstrap-v3.1.1.css",
        "destinationDir": [
            {
                "dir": "../java/yard/src/main/resources/assets/static/libs/",
                "clear": true
            }
        ]
    },
    "stack": {
        "src": "../static/js/stack.js",
        "destinationDir": [
            {
                "dir": "../java/yard/src/main/resources/assets/static/js/",
                "clear": true
            }
        ]
    },
    "model": {
        "src": "../static/js/model.js",
        "destinationDir": [
            {
                "dir": "../java/yard/src/main/resources/assets/static/js/",
                "clear": true
            }
        ]
    },
    "yardApiModel": {
        "src": "../static/js/yard/yardApiModel.js",
        "destinationDir": [
            {
                "dir": "../java/yard/src/main/resources/assets/static/js/",
                "clear": true
            }
        ]
    }
};

var syncData = {
    "jquery": {
        "src": "../static/libs/jquery-2.1.3.js",
        "destinationDir": "../java/yard/src/main/resources/assets/static/libs/"
    },
    "bootstrap": {
        "src": "../static/libs/bootstrap-v3.1.1.css",
        "destinationDir": "../java/yard/src/main/resources/assets/static/libs/"
    },
    "yardCss": {
        "src": "../app/yard1/static/css/style.css",
        "destinationDir": "../java/yard/src/main/resources/assets/s17/css/"
    },
    "stack": {
        "src": [
            "../static/js/stack.js",
            "../static/js/model.js",
            "../static/js/yard/yardApiModel.js"
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/static/js/"
    },
    "s17Script_js": {
        "src": [
            "../app/yard-s17/static/js/s17Script.js",
            "../app/yard-s17/static/js/s17View.js"
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/s17/js/"
    },
    "yard1_js": {
        "src": [
            "../app/yard1/static/js/yard1Script.js",
            "../app/yard1/static/js/yard1PointModel.js",
            "../app/yard1/static/js/yard1Controller.js",
            "../app/yard1/static/js/yard1ComponentModel.js",
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/yard1/js/"
    },
    "s17Script_json": {
        "src": [
            "../app/yard-s17/static/json/async-data.json",
            "../app/yard-s17/static/json/partial-exp.json",
            "../app/yard-s17/static/json/possible-values.json",
            "../app/yard-s17/static/json/possible-values-sequence.json",
            "../app/yard-s17/static/json/possible-values-group.json",
            "../app/yard-s17/static/json/initial-value.json",
            "../app/yard-s17/static/json/expressions-evt.json",
            "../app/yard-s17/static/json/expressions-common.json",
            "../app/yard-s17/static/json/expressions-sequence-1.json",
            "../app/yard-s17/static/json/expressions-sequence-2.json",
            "../app/yard-s17/static/json/expressions-ov.json",
            "../app/yard-s17/static/json/expressions-sub-routes.json",
            "../app/yard-s17/static/json/expressions-points-common.json",
            "../app/yard-s17/static/json/expressions-point-4.json",
            "../app/yard-s17/static/json/expressions-point-5.json",
            "../app/yard-s17/static/json/expressions-point-6.json",
            "../app/yard-s17/static/json/expressions-timer.json",
            "../app/yard-s17/static/json/expressions-glow.json"
        ],
        "destinationDir": "../java/yard/src/main/resources/assets/s17/json/"
    },
    "yard1_json": {
        "src": "../app/yard1/static/json/yard.json",
        "destinationDir": "../java/yard/src/main/resources/assets/yard1/json/"
    }
};

function syncAppFiles(name) {
    if (syncData[name]) {
        var file = syncData[name].src;
        var destination = syncData[name].destinationDir;
        if (!$S.isArray(file)) {
            if ($S.isString(file)) {
                file = [file];
            }
        }
        for (var i = 0; i < file.length; i++) {
            FS.isFileExist(file[i], function(exist, filename) {
                if (exist) {
                    if ($S.isString(destination)) {
                        copyFile(filename, destination);
                    } else {
                        console.log(`Invalid destination directory: '${destination}'`);
                    }
                } else {
                    console.log(`Source file '${filename}' does not exist`);
                }
            });
        }
    }
}

for (var key in syncData) {
    syncAppFiles(key);
}

if (args.length > 2) {
    for (var i = 2; i < args.length; i++) {
        // console.log(args[i]);
    }
}

