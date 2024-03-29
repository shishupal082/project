const $S = require("../libs/stack.js");
const FS = require("./fsmodule.js");
const File = require("./apis/file.js");
const Logger = require("./logger-v2.js");


(function() {
var DT = $S.getDT();
var ReadText = function(config) {
    return new ReadText.fn.init(config);
};
ReadText.fn = ReadText.prototype = {
    constructor: ReadText,
    init: function(config) {
        this.config = config;
        return this;
    },
    writeContent: function(filepath, callback) {
        var self = this;
        if (!$S.isObject(this.config)) {
            $S.callMethod(callback);
            return;
        }
        var i = this.config.i;
        var textData = this.config.textData;
        if (!$S.isNumber(i) || !$S.isArray(textData)) {
            $S.callMethod(callback);
            return;
        }
        if (i >= textData.length) {
            $S.callMethod(callback);
            return;
        }
        if (FS.isFile(filepath)) {
            FS.appendTextFile(filepath, textData[i], function(status, textData) {
                self.config.i = self.config.i + 1;
                self.writeContent(filepath, callback);
            });
        } else {
            $S.callMethodV1(callback, false);
            return;
        }
    },
    deleteText: function(filepath, callback) {
        var self = this;
        if (FS.isFile(filepath)) {
            FS.deleteContent(filepath, callback);
        } else {
            Logger.log("File does not exist: " + filepath);
            $S.callMethodV1(callback, false);
        }
    },
    writeText: function(filepath, callback) {
        /**
         * If file exist,
         * It will remove old content and add new text.
         * Othewise,
         * Do nothing.
         * */
        var self = this;
        if (FS.isFile(filepath)) {
            // Logger.log("File exist: " + filepath);
            FS.deleteContent(filepath, function() {
                self.writeContent(filepath, function(status) {
                    $S.callMethodV1(callback, status);
                });
            });
        } else {
            Logger.log("File does not exist: " + filepath);
            $S.callMethod(callback);
        }
    },
    writeTextV2: function(filepath, callback) {
        /**
         * It will create file if not exist then writeText.
         * If file exist then delete old content and write new text.
         * */
        var self = this;
        if (!FS.isFile(filepath)) {
            FS.appendTextFile(filepath, "", function() {
                self.writeText(filepath, callback);
            });
        } else {
            this.writeText(filepath, callback);
        }
    },
    writeTextV3: function(filepath, callback) {
        /**
         * It will create file if not exist then addText in file.
         * If file exist then add new text in file.
         * */
        var self = this;
        if (!FS.isFile(filepath)) {
            FS.appendTextFile(filepath, "", function() {
                self.writeContent(filepath, function(status) {
                    $S.callMethodV1(callback, status);
                });
            });
        } else {
            self.writeContent(filepath, function(status) {
                $S.callMethodV1(callback, status);
            });
        }
    }
};
ReadText.fn.init.prototype = ReadText.fn;
$S.extendObject(ReadText);
ReadText.extend({
    _parseText: function(textData, obj, callback) {
        var temp, type, filename, fileExt, dir, preText, postText;
        if (!$S.isObject(obj)) {
            obj = {};
        }
        if (!$S.isArray(obj.processedFile)) {
            obj.processedFile = [];
        }
        if ($S.isStringV2(textData)) {
            temp = textData.split("|||");
            for (var j=0; j<temp.length; j++) {
                temp[j] = temp[j].trim();
            }
            if (temp.length === 5 && $S.isFunction(obj.getFilePath)) {
                temp = obj.getFilePath(temp);
            } else if (temp.length === 7 && $S.isFunction(obj.getFilePath)) {
                temp = obj.getFilePath(temp);
            }
            if ($S.isArray(temp) && temp.length === 4) {
                type = temp[0];
                filename = temp[1];
                fileExt = temp[2];
                dir = temp[3];
                // It can end up in infinite loop when same filename is included in reading
                if (obj.processedFile.indexOf(filename) && false) {
                    Logger.log("Filename " + filename + " read already completed.");
                    $S.callMethodV1(callback, [textData]);
                } else {
                    obj.processedFile.push(filename);
                    ReadText.read(dir + filename + fileExt, obj, {}, function(data, tempObj) {
                        $S.callMethodV1(callback, data);
                    });
                }
            } else if($S.isArray(temp) && temp.length === 6){
                type = temp[0];
                filename = temp[1];
                fileExt = temp[2];
                dir = temp[3];
                preText = temp[4];
                postText = temp[5];
                // It can end up in infinite loop when same filename is included in reading
                if (obj.processedFile.indexOf(filename) && false) {
                    Logger.log("Filename " + filename + " read already completed.");
                    $S.callMethodV1(callback, [textData]);
                } else {
                    obj.processedFile.push(filename);
                    ReadText.read(dir + filename + fileExt, obj, {"preText": preText, "postText": postText}, function(data, tempObj) {
                        if ($S.isArray(data) && data.length === 1) {
                            $S.callMethodV1(callback, [tempObj["preText"] + data[0] + tempObj["postText"]]);
                        } else {
                            $S.callMethodV1(callback, data);
                        }
                    });
                }
            } else {
                $S.callMethodV1(callback, [textData]);
            }
        } else {
            $S.callMethodV1(callback, [textData]);
        }
    },
    parseData: function(fileData, obj, i, finalTextDataV2, callback) {
        if (!$S.isNumber(i) || !$S.isArray(fileData)) {
            $S.callMethodV1(callback, finalTextDataV2);
            return;
        }
        // Logger.log(fileData.length + "::" + i);
        if (i >= fileData.length || i < 0) {
            $S.callMethodV1(callback, finalTextDataV2);
            return;
        }
        if (!$S.isArray(finalTextDataV2)) {
            finalTextDataV2 = [];
        }
        this._parseText(fileData[i], obj, function(textData) {
            finalTextDataV2 = finalTextDataV2.concat(textData);
            setImmediate(function() {
                ReadText.parseData(fileData, obj, i+1, finalTextDataV2, callback);
            });
        });
    },
    read: function(filepath, obj, tempObj, callback) {
        Logger.log("------------------------------------------------");
        Logger.log("Reading text file: \t\t" + filepath);
        FS.readTextFile(filepath, [], function(fileData) {
            Logger.log("Read text file completed: \t" + filepath);
            var fileDataV2 = $S.readTextData(fileData);
            var finalTextDataV2 = [];
            ReadText.parseData(fileDataV2, obj, 0, finalTextDataV2, function(finalTextData) {
                $S.callMethodV2(callback, finalTextData, tempObj);
            });
        });
    }
});

var generateFile = {
    "save": function(filepath, destinationPath, callback, getFilePath) {
        var obj = {getFilePath: getFilePath};
        ReadText.read(filepath, obj, {}, function(finalTextData, tempObj) {
            ReadText({"i": 0, "textData": finalTextData}).writeText(destinationPath, function(status) {
                $S.callMethod(callback);
            });
        });
    },
    deleteText: function(destinationPath, callback) {
        ReadText({"i": 0}).deleteText(destinationPath, function(status) {
            $S.callMethodV1(callback, status);
        });
    },
    saveText: function(textDataArr, destinationPath, callback) {
        ReadText({"i": 0, "textData": textDataArr}).writeText(destinationPath, function(status) {
            $S.callMethodV1(callback, status);
        });
    },
    saveTextV2: function(textDataArr, destinationPath, callback) {
        ReadText({"i": 0, "textData": textDataArr}).writeTextV2(destinationPath, function(status) {
            $S.callMethodV1(callback, status);
        });
    },
    saveTextV3: function(textDataArr, destinationPath, callback) {
        ReadText({"i": 0, "textData": textDataArr}).writeTextV3(destinationPath, function(status) {
            $S.callMethodV1(callback, status);
        });
    },
    copyFileWithTimeStamp: function(srcFilepath, callback) {
        var dateTime = DT.getDateTime("YYYY/-/MM/-/DD/-/hh/-/mm/-/ss", "/");
        var fileObj = File.getFileV2(srcFilepath).getAll();
        var destinationFilepath = fileObj["fileDir"] + fileObj["fileNameWithoutDir"] + "-" + dateTime + fileObj["extention"];
        FS.copyFileV2(srcFilepath, destinationFilepath, function(status) {
            $S.callMethodV1(callback, status);
        });
    },
    getReadText: function() {
        return ReadText;
    }
};

module.exports = generateFile;

})();

