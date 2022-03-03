const $S = require("../../src/libs/stack.js");
const FS = require("../../src/common/fsmodule.js");
const Logger = require("../../src/common/logger-v2.js");
const generateFile = require("../../src/common/generateFile.js");
var arg = process.argv;
var ReadText = generateFile.getReadText();
var configFilepath = "";
var crcConfigFilepath = "proj-3.1/config_crc.csv";
var finalTablePath = "proj-3.1/final_crc_table.csv";

var DT = $S.getDT();

var generateChecksumCRCTable = false;
if ($S.isArray(arg) && arg.length >= 3) {
    configFilepath = arg[2];
    if (arg.length >= 4) {
        generateChecksumCRCTable = arg[3] === "true";
    }
    console.log("Command line argument 'configFilepath': " + configFilepath + ", 'generateChecksumCRCTable': " + generateChecksumCRCTable);
} else {
    console.log("-----Command line argument 'configFilepath' required.-----");
}

function generateTextFile(configJson, generatedId, callback) {
    if (!$S.isArray(generatedId)) {
        return $S.callMethod(callback);
    }
    if (!$S.isObject(configJson)) {
        return $S.callMethod(callback);
    }
    for (var projectId in configJson) {
        if (generatedId.indexOf(projectId) >= 0) {
            continue;
        }
        generatedId.push(projectId);
        Logger.log("************************************************", function() {
            generateFile.save(configJson[projectId]["source"], configJson[projectId]["destination"], function() {
                generateTextFile(configJson, generatedId, callback);
            }, function(textData) {
                if ($S.isArray(textData) && textData.length === 5) {
                    if (textData[4] === "01") {
                        var temp = [];
                        temp.push(textData[0]); //type
                        temp.push(textData[1]); //filename
                        temp.push(textData[2]); //fileExt
                        if ($S.isString(configJson[projectId]["identifier"])) {
                            temp.push(textData[3] + configJson[projectId]["identifier"]);
                        } else {
                            temp.push(textData[3]); //dir
                        }
                        return temp;
                    }
                } else if ($S.isArray(textData) && textData.length === 7) {
                    if (["00", "01"].indexOf(textData[5]) >= 0) {
                        var temp = [];
                        temp.push(textData[1]); //type
                        temp.push(textData[2]); //filename
                        temp.push(textData[3]); //fileExt
                        if (textData[5] === "00") {
                            temp.push(textData[4]); //dir
                        } else if (textData[5] === "01") {
                            if ($S.isString(configJson[projectId]["identifier"])) {
                                temp.push(textData[4] + configJson[projectId]["identifier"]);
                            } else {
                                temp.push(textData[4]);
                            }
                        } else {
                            temp.push(textData[4]);
                        }
                        temp.push(textData[0]);
                        temp.push(textData[6]);
                        return temp;
                    }
                }
                return textData;
            });
        });
        return;
    }
    return $S.callMethod(callback);
}

function generateAllFile(csvConfigData, callback) {
    var configJson = {}, temp;
    for (var i=0; i<csvConfigData.length; i++) {
        if ($S.isStringV2(csvConfigData[i])) {
            temp = csvConfigData[i].split(",");
            for (var j=0; j<temp.length; j++) {
                temp[j] = temp[j].trim();
            }
            if (temp.length >= 3 && temp[0] !== "") {
                if (configJson[temp[0]]) {
                    Logger.log("Duplicate project id: " + temp[0], function() {
                        $S.callMethod(callback);
                    });
                    return;
                }
                if (temp.length === 3) {
                    configJson[temp[0]] = {"source": temp[1], "destination": temp[2]};
                } else if (temp.length === 4) {
                    configJson[temp[0]] = {"source": temp[1], "destination": temp[2], "identifier": temp[3]};
                }
            } else {
                console.log("Invalid csv config data.");
                console.log(csvConfigData);
                $S.callMethod(callback);
                return;
            }
        }
    }
    generateTextFile(configJson, [], callback);
}

var CRC = function(config) {
    return new UDP.fn.init(config);
};

CRC.fn = CRC.prototype = {
    constructor: CRC,
    init: function(config) {
        this.config = config;
        return this;
    }
};
CRC.fn.init.prototype = CRC.fn;
$S.extendObject(CRC);
CRC.extend({
    readCrcConfigFile: function(configPath, callback) {
        var tempObj = {};
        ReadText.read(configPath, {}, tempObj, function(textData, tempObj2) {
            textData = $S.removeSingleLineComment(textData, "//");
            textData = $S.removeMultiLineComment(textData, "/*", "*/");
            textData = $S.removeEmpty(textData);
            var temp, result = [];
            if ($S.isArray(textData)) {
                for(var i=0; i<textData.length; i++) {
                    if ($S.isStringV2(textData[i])) {
                        temp = textData[i].split(",");
                        if (temp.length === 2) {
                            result.push(temp[1].trim());
                        }
                    }
                }
            }
            $S.callMethodV1(callback, result);
        });
    },
    _readValue: function(mllFilePath, crcCheckSumTextLine) {
        var result = {"filepath": mllFilePath, "filename": "", "CRC": "", "checksum": ""};
        result["filename"] = FS.getFileName(mllFilePath);
        var temp = [], temp2;
        if ($S.isStringV2(crcCheckSumTextLine)) {
            temp = crcCheckSumTextLine.split("  ");
            if (temp.length === 3) {
                temp2 = temp[0].split("=");
                if (temp2.length === 2) {
                    result["CRC"] = temp2[1].trim();
                }
                temp2 = temp[1].split("=");
                if (temp2.length === 2) {
                    result["checksum"] = temp2[1].trim();
                }
            }
        }
        return result;
    },
    _readCrc: function(mllFileQue, finalResult, callback) {
        if (mllFileQue.getSize() < 1) {
            $S.callMethodV1(callback, finalResult);
            return;
        }
        if (!$S.isArray(finalResult)) {
            finalResult = [];
        }
        var mllFilePath = mllFileQue.Deque();
        ReadText.read(mllFilePath, {}, mllFileQue, function(textData, mllFileQue) {
            textData = $S.removeSingleLineComment(textData, "//");
            textData = $S.removeMultiLineComment(textData, "/*", "*/");
            textData = $S.removeEmpty(textData);
            if ($S.isArray(textData) && textData.length > 3) {
                finalResult.push(CRC._readValue(mllFilePath, textData[2]));
            }
            CRC._readCrc(mllFileQue, finalResult, callback);
        });
    },
    generateCrcTable: function(mllFilePath) {
        var mllFileQue = $S.getQue(16);
        if ($S.isArray(mllFilePath)) {
            for (var i=0; i<mllFilePath.length; i++) {
                mllFileQue.Enque(mllFilePath[i]);
            }
        }
        var textData = "//filename,CRC,checksum,filepath";
        var entryTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/");
        this._readCrc(mllFileQue, [], function(finalResult) {
            if ($S.isArray(finalResult)) {
                for (var i=0; i<finalResult.length; i++) {
                    textData += "\n" + entryTime + "," + finalResult[i]["filename"] + "," + finalResult[i]["CRC"] + "," + finalResult[i]["checksum"] + "," + finalResult[i]["filepath"];
                }
            }
            FS.deleteContent(finalTablePath, function() {
                FS.appendTextFile(finalTablePath, textData);
                Logger.log("CRC table generated.");
            });
        });
    }
});

function generateChecksumCRCTableData() {
    CRC.readCrcConfigFile(crcConfigFilepath, function(mllFilePath) {
        CRC.generateCrcTable(mllFilePath);
    });
}

function start() {
    var tempObj = {};
    ReadText.read(configFilepath, {}, tempObj, function(textData, tempObj2) {
        textData = $S.removeSingleLineComment(textData, "//");
        textData = $S.removeMultiLineComment(textData, "/*", "*/");
        textData = $S.removeEmpty(textData);
        console.log(textData);
        generateAllFile(textData, function() {
            if (generateChecksumCRCTable) {
                generateChecksumCRCTableData();
            }
        });
    });
}


Logger("C:/java/mlk_log/").setLogDir().enableLoging(function(status) {
    if (status) {
        console.log("Logging enable.");
    } else {
        console.log("Error in log enabling.");
    }
    start();
});
