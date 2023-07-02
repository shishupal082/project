const $S = require("../libs/stack.js");
const FS = require("../common/fsmodule.js");
const Logger = require("../common/logger-v2.js");
const generateFile = require("../common/generateFile.js");
const CsvDataFormate = require("../common/CsvDataFormate.js");
const ConvertGoogleSheetsToCsv = require("../google-sheets/ConvertGoogleSheetsToCsv.js");
const Excel = require("./read_excel.js");

(function() {
var ConfigData = {};
var ConvertExcelToCsv = function(config) {
    return new UDP.fn.init(config);
};

ConvertExcelToCsv.fn = ConvertExcelToCsv.prototype = {
    constructor: ConvertExcelToCsv,
    init: function(config) {
        this.config = config;
        return this;
    }
};
ConvertExcelToCsv.fn.init.prototype = ConvertExcelToCsv.fn;

$S.extendObject(ConvertExcelToCsv);
ConvertExcelToCsv.extend({
    setConfigData: function(excelConfigData) {
        ConfigData = excelConfigData;
    }
});
ConvertExcelToCsv.extend({
    getExcelConfig: function(request) {
        var excelConfig = [];
        if (!$S.isObject(request)) {
            return excelConfig;
        }
        var workId = request["workId"];
        if (!$S.isStringV2(workId)) {
            return excelConfig;
        }
        if ($S.isArrayV2(ConfigData[workId])) {
            excelConfig = $S.clone(ConfigData[workId]);
        } else {
            Logger.log("Invalid workId: " + workId);
        }
        return excelConfig;
    },
    generateFile: function(finalData, callback) {
        var excelConfig = [];
        if ($S.isArray(finalData) && finalData.length === 1) {
            if ($S.isObject(finalData[0])) {
                excelConfig = finalData[0]["excelConfig"];
            }
        }
        if (!$S.isArray(excelConfig)) {
            Logger.log("Invalid excelConfig.", callback);
            $S.callMethod(callback);
            return;
        }
        if (excelConfig.length < 1) {
            Logger.log("excelConfig not found.", callback);
            $S.callMethod(callback);
            return;
        }
        var self = this;
        var data, source, destination, sheetName;
        for (var i=0; i<excelConfig.length; i++) {
            if ($S.isObject(excelConfig[i]) && excelConfig[i]["isVisited"] !== "true") {
                source = excelConfig[i]["source"];
                destination = excelConfig[i]["destination"];
                sheetName = excelConfig[i]["sheetName"];
                excelConfig[i]["isVisited"] = "true";
                if ($S.isStringV2(source)) {
                    data = Excel.readFile(source, sheetName);
                    if ($S.isArray(finalData) && finalData.length === 1) {
                        if ($S.isObject(finalData[0])) {
                            finalData[0]["excelData"] = data;
                        }
                    }
                    CsvDataFormate.format(finalData);
                    ConvertGoogleSheetsToCsv.saveCSVData(finalData);
                    return;
                }
            }
        }
        return $S.callMethodV1(callback, "SUCCESS");
    },
    convert: function(request, callback) {
        Logger.logV2(request);
        var workId = "", destination = "", sheetName = "";
        var excelConfig = ConvertExcelToCsv.getExcelConfig(request);
        if ($S.isObject(request) && $S.isStringV2(request["workId"])) {
            workId = request["workId"];
        }
        CsvDataFormate.updateConfigData(workId, excelConfig);
        if ($S.isArray(excelConfig) && excelConfig.length === 1) {
            if ($S.isStringV2(excelConfig[0]["destination"])) {
                destination = excelConfig[0]["destination"];
            }
            if ($S.isStringV2(excelConfig[0]["sheetName"])) {
                sheetName = excelConfig[0]["sheetName"];
            }
        }
        var fileMappingData = ["","","",sheetName,destination,workId];
        var finalData = [{
            "fileMappingData": fileMappingData,
            "excelConfigSpreadsheets": {
              "spreadsheetId": "",
              "sheetName": ""
            },
            "excelConfig": excelConfig,
            "excelData": []
        }];
        ConvertExcelToCsv.generateFile(finalData, function(status) {
            $S.callMethodV1(callback, status);
        });
    }
});

module.exports = ConvertExcelToCsv;

})();
