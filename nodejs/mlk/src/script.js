const $S = require("../../../static/js/stack.js");
const FS = require("../../static/fsmodule.js");
const Logger = require("../../static/logger-v2.js");
const generateFile = require("./js/generateFile.js");


var fileGenerateConfigPath = "";

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

function start(configFilepath) {
    var ReadText = generateFile.getReadText();
    var tempObj = {};
    ReadText.read(configFilepath, {}, tempObj, function(textData, tempObj2) {
        textData = $S.removeSingleLineComment(textData, "//");
        textData = $S.removeMultiLineComment(textData, "/*", "*/");
        textData = $S.removeEmpty(textData);
        console.log(textData);
        generateAllFile(textData, function() {});
    });
}


Logger("../log/").setLogDir().enableLoging(function(status) {
    if (status) {
        console.log("Logging enable.");
    } else {
        console.log("Error in log enabling.");
    }
    start("proj-2/config.csv");
    // start("proj-1/file-1.ML2", "../dist/proj-1/FAT/MURI_C1_T06_FAT.ML2");
});