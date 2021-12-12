const $S = require("../../../static/js/stack.js");
const FS = require("../../static/fsmodule.js");
const Logger = require("../../static/logger-v2.js");


(function() {
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
            $S.callMethod(callback);
            return;
        }
    },
    writeText: function(filepath, callback) {
        var self = this;
        if (FS.isFile(filepath)) {
            console.log("File exist: " + filepath);
            FS.deleteContent(filepath, function() {
                self.writeContent(filepath, function() {
                    $S.callMethod(callback);
                });
            });
        } else {
            console.log("File does not exist: " + filepath);
            $S.callMethod(callback);
        }
    }
};
ReadText.fn.init.prototype = ReadText.fn;
$S.extendObject(ReadText);
ReadText.extend({
    _parseText: function(textData, obj, callback) {
        var temp, type, filename, fileExt, dir;
        if (!$S.isObject(obj)) {
            obj = {};
        }
        if (!$S.isArray(obj.processedFile)) {
            obj.processedFile = [];
        }
        if ($S.isStringV2(textData)) {
            temp = textData.split("|||");
            if (temp.length === 4) {
                type = temp[0];
                filename = temp[1];
                fileExt = temp[2];
                dir = temp[3];
                if (obj.processedFile.indexOf(filename) >= 0) {
                    Logger.log("Filename " + filename + " read already completed.", function() {
                        $S.callMethodV1(callback, [textData]);
                    });
                } else {
                    obj.processedFile.push(filename);
                    ReadText.read(dir + filename + fileExt, obj, function(data) {
                        $S.callMethodV1(callback, data);
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
        // console.log(fileData.length + "::" + i);
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
    read: function(filepath, obj, callback) {
        var text = "------------------------------------------------\nReading text file: \t\t";
        Logger.log(text + filepath, function() {
            FS.readTextFile(filepath, [], function(fileData) {
                Logger.log("Read text file completed: \t" + filepath, function() {
                    var fileDataV2 = $S.readTextData(fileData);
                    var finalTextDataV2 = [];
                    ReadText.parseData(fileDataV2, obj, 0, finalTextDataV2, function(finalTextData) {
                        $S.callMethodV1(callback, finalTextData);
                    });
                });
            });
        });
    }
});

var generateFile = {
    "save": function(filepath, destinationPath, callback) {
        var obj = {};
        ReadText.read(filepath, obj, function(finalTextData) {
            // console.log(destinationPath);
            ReadText({"i": 0, "textData": finalTextData}).writeText(destinationPath, function(status) {
                $S.callMethod(callback);
            })
        });
    },
    getReadText: function() {
        return ReadText;
    }
};

module.exports = generateFile;

})();

