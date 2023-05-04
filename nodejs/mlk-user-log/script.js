const $S = require("../src/libs/stack.js");
const FS = require("../src/common/fsmodule.js");
const Logger = require("../src/common/logger-v2.js");
const generateFile = require("../src/common/generateFile.js");
var arg = process.argv;
var ReadText = generateFile.getReadText();
var configFilepath = "";

var DT = $S.getDT();

var finalLogDataCSV = [];
var destinationFilepath = "";

var MLKUserLog = function(config) {
    return new MLKUserLog.fn.init(config);
};

MLKUserLog.fn = MLKUserLog.prototype = {
    constructor: MLKUserLog,
    init: function(config) {
        this.config = config;
        return this;
    }
};
MLKUserLog.fn.init.prototype = MLKUserLog.fn;
$S.extendObject(MLKUserLog);

if ($S.isArray(arg) && arg.length >= 3) {
    configFilepath = arg[2];
    var logText = "Command line argument 'configFilepath': " + configFilepath;
    console.log(logText);
} else {
    console.log("-----Command line argument 'configFilepath' required.-----");
}

function readTextFile(configJson, processedId, callback) {
    if (!$S.isArray(processedId)) {
        return $S.callMethod(callback);
    }
    if (!$S.isObject(configJson)) {
        return $S.callMethod(callback);
    }
    for (var pId in configJson) {
        if (processedId.indexOf(pId) >= 0) {
            continue;
        }
        processedId.push(pId);
        filepath = configJson[pId]["filepath"];
        if ($S.isStringV2(filepath)) {
            Logger.log("************************************************" + filepath);
            var tempObj = {};
            ReadText.read(filepath, {}, tempObj, function(textData, tempObj2) {
                var temp, result = [];
                if ($S.isArray(textData)) {
                    MLKUserLog.addFinalCsvData(textData);
                    // for(var i=0; i<textData.length; i++) {
                    //     if ($S.isStringV2(textData[i])) {
                    //         temp = textData[i].split(",");
                    //         if (temp.length === 2) {
                    //             result.push(temp[1].trim());
                    //         }
                    //     }
                    // }
                }
                readTextFile(configJson, processedId, callback);
            });
        }

        // generateFile.save(configJson[pId]["source"], configJson[pId]["destination"], function() {
        //     readTextFile(configJson, processedId, callback);
        // }, function(textData) {
        //     if ($S.isArray(textData) && textData.length === 5) {
        //         if (textData[4] === "01") {
        //             var temp = [];
        //             temp.push(textData[0]); //type
        //             temp.push(textData[1]); //filename
        //             temp.push(textData[2]); //fileExt
        //             if ($S.isString(configJson[pId]["identifier"])) {
        //                 temp.push(textData[3] + configJson[pId]["identifier"]);
        //             } else {
        //                 temp.push(textData[3]); //dir
        //             }
        //             return temp;
        //         }
        //     } else if ($S.isArray(textData) && textData.length === 7) {
        //         if (["00", "01"].indexOf(textData[5]) >= 0) {
        //             var temp = [];
        //             temp.push(textData[1]); //type
        //             temp.push(textData[2]); //filename
        //             temp.push(textData[3]); //fileExt
        //             if (textData[5] === "00") {
        //                 temp.push(textData[4]); //dir
        //             } else if (textData[5] === "01") {
        //                 if ($S.isString(configJson[pId]["identifier"])) {
        //                     temp.push(textData[4] + configJson[pId]["identifier"]);
        //                 } else {
        //                     temp.push(textData[4]);
        //                 }
        //             } else {
        //                 temp.push(textData[4]);
        //             }
        //             temp.push(textData[0]);
        //             temp.push(textData[6]);
        //             return temp;
        //         }
        //     }
        //     return textData;
        // });
        return;
    }
    return $S.callMethod(callback);
}

function readAllFile(csvConfigData, callback) {
    var configJson = {}, temp;
    var fileCount = 0;
    var processedIds = [];
    for (var i=0; i<csvConfigData.length; i++) {
        if ($S.isStringV2(csvConfigData[i])) {
            temp = csvConfigData[i].split(",");
            for (var j=0; j<temp.length; j++) {
                temp[j] = temp[j].trim();
            }
            if (temp.length >= 2 && temp[0] !== "") {
                if (configJson[temp[0]]) {
                    Logger.log("Duplicate project id: " + temp[0], function() {
                        $S.callMethod(callback);
                    });
                    return;
                }
                if (temp.length === 2) {
                    if (temp[0] === "destinationFilepath") {
                        destinationFilepath = temp[1];
                    } else {
                        configJson[temp[0]] = {"filepath": temp[1]};
                        fileCount++;
                    }
                }
            } else {
                console.log("Invalid csv config data.");
                console.log(csvConfigData);
                $S.callMethod(callback);
                return;
            }
        }
    }
    readTextFile(configJson, processedIds, function() {
        var temp = [];
        var dateTime, id, log;
        if (processedIds.length === fileCount) {
            for (var i=0; i<finalLogDataCSV.length; i++) {
                if ($S.isArray(finalLogDataCSV[i])) {
                    for (var j=0; j<finalLogDataCSV[i].length; j++) {
                        if ($S.isObject(finalLogDataCSV[i][j])) {
                            id = $S.isStringV2(finalLogDataCSV[i][j]["id"]) ? finalLogDataCSV[i][j]["id"] : "";
                            dateTime = $S.isStringV2(finalLogDataCSV[i][j]["date_time"]) ? finalLogDataCSV[i][j]["date_time"] : "";
                            log = $S.isStringV2(finalLogDataCSV[i][j]["data"]) ? finalLogDataCSV[i][j]["data"] : "";
                            temp.push(dateTime+","+id+","+log);
                        }
                    }
                }
            }
            generateFile.saveText(temp, destinationFilepath, function() {
                console.log("Completed");
            });
        }
    });
}

MLKUserLog.extend({
    addFinalCsvData: function(fileTextData) {
        var csvData = [];
        var temp, lineText, isStarted;
        // console.log(fileTextData);
        if ($S.isArray(fileTextData)) {
            temp = {"dataItems": []};
            isStarted = false;
            for (var i = 0; i<fileTextData.length; i++) {
                lineText = fileTextData[i];
                if (isStarted) {
                    if (temp["id"]) {
                        if ($S.searchItems(["^([0-9]{2}/){2}[0-9]{2}"], [lineText], true).length > 0) {
                            temp["date_time"] = lineText.trim();
                            for (var j=0; j<temp["dataItems"].length; j++) {
                                temp["data"] = temp["dataItems"][j];
                                csvData.push(temp);
                            }
                            temp = {};
                        } else if ($S.isStringV2(lineText)) {
                            temp["dataItems"].push(lineText.trim());
                        }
                    } else if ($S.isStringStartWith(lineText, "[")) {
                        temp["id"] = lineText.trim();
                        temp["dataItems"] = [];
                    }

                } else {
                    if ($S.isStringStartWith(lineText, "[")) {
                        isStarted = true;
                        temp["id"] = lineText.trim();
                        temp["dataItems"] = [];
                    }
                }
            }
        }
        finalLogDataCSV.push(csvData);
        return;
    },
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
                finalResult.push(MLKUserLog._readValue(mllFilePath, textData[2]));
            }
            MLKUserLog._readCrc(mllFileQue, finalResult, callback);
        });
    },
    generateCrcTable: function(mllFilePath) {
        var mllFileQue = $S.getQue(16);
        if ($S.isArray(mllFilePath)) {
            for (var i=0; i<mllFilePath.length; i++) {
                mllFileQue.Enque(mllFilePath[i]);
            }
        }
        var textData = "//entryTime,filename,CRC,checksum,filepath";
        var entryTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm/:/ss", "/");
        this._readCrc(mllFileQue, [], function(finalResult) {
            if ($S.isArray(finalResult)) {
                for (var i=0; i<finalResult.length; i++) {
                    textData += "\n" + entryTime + "," + finalResult[i]["filename"] + "," + finalResult[i]["CRC"] + "," + finalResult[i]["checksum"] + "," + finalResult[i]["filepath"];
                }
            }
        });
    }
});

function start() {
    var tempObj = {};
    ReadText.read(configFilepath, {}, tempObj, function(configData, tempObj2) {
        configData = $S.removeSingleLineComment(configData, "//");
        configData = $S.removeMultiLineComment(configData, "/*", "*/");
        configData = $S.removeEmpty(configData);
        // console.log("ConfigData: ---");
        // console.log(configData);
        readAllFile(configData, function() {
            
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
