const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");

const ReadConfigData = require("../common/ReadConfigData.js");
const ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");

function RemoveFilesModelObj(configData) {
    var status = "";
    var result = [];
    this.configData = configData;
    this.currentId = "";
    this.currentConfigData = {};
    this.setCurrentConfigData = function(id) {
        if (!$S.isStringV2(id)) {
            Logger.log("Invalid request workId: " + id);
            Logger.log("Failed to setCurrentConfigData for id: " + id);
            return;
        }
        this.currentId = id;
        if ($S.isArray(configData)) {
            for (var i=0; i<configData.length; i++) {
                if (id === configData[i]["id"]) {
                    if ($S.isObject(configData[i])) {
                        this.currentConfigData = configData[i];
                    }
                }
            }
        } else {
            Logger.log("Config data provided is not array.");
        }
    };
    this.getTrashPath = function() {
        var trashPath = this.currentConfigData["trash_path"];
        if ($S.isStringV2(trashPath)) {
            return trashPath;
        }
        return null;
    };
    this.isValidTrashPath = function() {
        var trashPath = this.getTrashPath();
        if ($S.isStringV2(trashPath)) {
            return FS.isDirectory(trashPath);
        }
        return false;
    };
    this.getSourceApi = function() {
        var sourceApi = this.currentConfigData["source_api"];
        if ($S.isStringV2(sourceApi)) {
            return sourceApi;
        }
        return null;
    };
    this.changeStatus = function(currentStatus, currentResult) {
        if ($S.isStringV2(currentStatus)) {
            status = currentStatus;
        } else {
            Logger.log("Model: Invalid currentStatus for set.");
        }
        if ($S.isArray(result)) {
            result = currentResult;
        }
    };
    this.getResultStatus = function() {
        return status;
    };
    this.getResult = function() {
        return result;
    };
}
module.exports = RemoveFilesModelObj;
