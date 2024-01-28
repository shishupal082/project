const $S = require("../libs/stack.js");

(function() {
var CONFIGDATA = {
    "workId": {
        "copyCellDataIndex": [0],
        "appendCellDataIndex": [[0,5],[7,-1]],
        "skipRowIndex": [[0,9]],
        "cellMapping": [
            {
                "gs_index": -1,
                "defaultCellData": "defaultText",
                "mappingData": [
                    {
                        "gs_index": 6,
                        "value": "XYZ",
                        "range": ["ABC", "DEF", "GHI", "JKL", "MNOP", "QRS", "TUVW"]
                    }
                ]
            }
        ]
    }
};
var CsvDataFormate = function(config) {
    return new CsvDataFormate.fn.init(config);
};
CsvDataFormate.fn = CsvDataFormate.prototype = {
    constructor: CsvDataFormate,
    init: function(config) {
        return this;
    }
};
CsvDataFormate.fn.init.prototype = CsvDataFormate.fn;
$S.extendObject(CsvDataFormate);


CsvDataFormate.extend({
    updateConfigData: function(workId, excelConfig) {
        // if (!$S.isStringV2(workId)) {
        //     return false;
        // }
        // var config = {};
        // if ($S.isArray(excelConfig) && excelConfig.length === 1) {
        //     config[workId] = {"copyCellDataIndex": [], "cellMapping": []};
        //     if ($S.isObject(excelConfig[0])) {
        //         if ($S.isArray(excelConfig[0]["copyCellDataIndex"])) {
        //             config[workId]["copyCellDataIndex"] = excelConfig[0]["copyCellDataIndex"];
        //         }
        //         if ($S.isArray(excelConfig[0]["cellMapping"])) {
        //             config[workId]["cellMapping"] = excelConfig[0]["cellMapping"];
        //         }
        //         if ($S.isArray(excelConfig[0]["appendCellDataIndex"])) {
        //             config[workId]["appendCellDataIndex"] = excelConfig[0]["appendCellDataIndex"];
        //         }
        //         if ($S.isArray(excelConfig[0]["skipRowIndex"])) {
        //             config[workId]["skipRowIndex"] = excelConfig[0]["skipRowIndex"];
        //         }
        //     }
        //     CONFIGDATA[workId] = config[workId];
        // }
        // return true;
    }
});

CsvDataFormate.extend({
    getConfigData: function(fileMappingData) {
        var name = "";
        if ($S.isArray(fileMappingData) && fileMappingData.length >= 6) {
            name = fileMappingData[5];
        }
        var configData = [], temp;
        if ($S.isStringV2(name) && $S.isObject(CONFIGDATA) && CONFIGDATA[name]) {
            temp = $S.clone(CONFIGDATA[name]);
            if ($S.isObject(temp) && $S.isArray(temp["copyCellDataIndex"])) {
                for (var i=0; i<temp["copyCellDataIndex"].length; i++) {
                    if ($S.isNumber(temp["copyCellDataIndex"][i]) && temp["copyCellDataIndex"][i] >= 0) {
                        configData.push({"index": temp["copyCellDataIndex"][i], "previousData": ""});
                    }
                }
            }
            return configData;
        }
        return [];
    },
    getCellMappingConfig: function(fileMappingData) {
        var name = "";
        if ($S.isArray(fileMappingData) && fileMappingData.length >= 6) {
            name = fileMappingData[5];
        }
        var configData = [], excelConfigData;
        if ($S.isStringV2(name) && $S.isObject(CONFIGDATA) && CONFIGDATA[name]) {
            excelConfigData = $S.clone(CONFIGDATA[name]);
            if ($S.isObject(excelConfigData) && $S.isArray(excelConfigData["cellMapping"])) {
                configData = excelConfigData["cellMapping"];
            }
            return configData;
        }
        return [];
    },
    getSkipRowIndexConfig: function(fileMappingData) {
        var name = "";
        if ($S.isArray(fileMappingData) && fileMappingData.length >= 6) {
            name = fileMappingData[5];
        }
        var skipRowIndex = [], configData = [], excelConfigData;
        if ($S.isStringV2(name) && $S.isObject(CONFIGDATA) && CONFIGDATA[name]) {
            excelConfigData = $S.clone(CONFIGDATA[name]);
            if ($S.isObject(excelConfigData) && $S.isArray(excelConfigData["skipRowIndex"])) {
                configData = excelConfigData["skipRowIndex"];
            }
            if ($S.isArray(configData)) {
                for (var i=0; i<configData.length; i++) {
                    if ($S.isArray(configData[i]) && configData[i].length === 2 && $S.isNumber(configData[i][0]) && $S.isNumber(configData[i][1])) {
                        for (var j=configData[i][0]; j<=configData[i][1]; j++) {
                            if (skipRowIndex.indexOf(j) < 0) {
                                skipRowIndex.push(j);
                            }
                        }
                    }
                }
            }
        }
        return skipRowIndex;
    },
    getAppendCellDataConfig: function(fileMappingData) {
        var name = "";
        if ($S.isArray(fileMappingData) && fileMappingData.length >= 6) {
            name = fileMappingData[5];
        }
        var configData = [], appendCellDataConfig;
        if ($S.isStringV2(name) && $S.isObject(CONFIGDATA) && CONFIGDATA[name]) {
            appendCellDataConfig = $S.clone(CONFIGDATA[name]);
            if ($S.isObject(appendCellDataConfig) && $S.isArray(appendCellDataConfig["appendCellDataIndex"])) {
                configData = appendCellDataConfig["appendCellDataIndex"];
            }
            return configData;
        }
        return [];
    },
    _replaceCellData: function(cellData) {
        if ($S.isString(cellData)) {
            cellData = cellData.split("\r\n").join(";");
            cellData = cellData.split("\n").join(";");
            cellData = cellData.split("\r").join("");
            cellData = $S.replaceString(cellData, ",", "...");
            cellData = cellData.trim();
        }
        return cellData;
    },
    replaceSpecialCharacterEachCellV2: function(excelSheetData) {
        if ($S.isArray(excelSheetData)) {
            for (var i=0; i<excelSheetData.length; i++) {
                if ($S.isArray(excelSheetData[i])) {
                    for (var j=0; j<excelSheetData[i].length; j++) {
                        excelSheetData[i][j] = this._replaceCellData(excelSheetData[i][j]);
                    }
                }
            }
        }
        return true;
    },
    replaceSpecialCharacterEachCell: function(finalData) {
        if ($S.isArray(finalData)) {
            for (var i=0; i<finalData.length; i++) {
                if ($S.isObject(finalData[i]) && $S.isArray(finalData[i]["excelData"])) {
                    if ($S.isArray(finalData[i]["excelData"])) {
                        for (var j=0; j<finalData[i]["excelData"].length; j++) {
                            this.replaceSpecialCharacterEachCellV2(finalData[i]["excelData"][j]);
                        }
                    }
                }
            }
        }
        return true;
    },
    _copyCellDataIndex: function(rowData, copyCellDataConfig) {
        var colIndex = 0;
        if ($S.isArray(rowData) && $S.isArray(copyCellDataConfig)) {
            for (var l=0; l<copyCellDataConfig.length; l++) {
                if ($S.isObject(copyCellDataConfig[l]) && $S.isNumber(copyCellDataConfig[l]["index"]) && copyCellDataConfig[l]["index"] >= 0) {
                    colIndex = copyCellDataConfig[l]["index"];
                    if (colIndex < rowData.length) {
                        if ($S.isStringV2(rowData[colIndex])) {
                            copyCellDataConfig[l]["previousData"] = rowData[colIndex];
                        }
                        rowData[colIndex] = copyCellDataConfig[l]["previousData"];
                    }
                }
            }
        }
        return rowData;
    },
    _applyCellMapping: function(rowData, cellMappingConfig, appendCellDataConfig) {
        if (!$S.isArray(rowData)) {
            return rowData;
        }
        var i, startIndex, endIndex;
        var finalRowData = [], cellData;
        var isValidConfig = false;
        var gsIndex;
        if ($S.isArray(cellMappingConfig) && cellMappingConfig.length > 0) {
            isValidConfig = true;
            cellData = "";
            for (i=0; i<cellMappingConfig.length; i++) {
                if ($S.isObject(cellMappingConfig[i]) && $S.isNumber(cellMappingConfig[i]["gs_index"]) && cellMappingConfig[i]["gs_index"] >= -1) {
                    gsIndex = cellMappingConfig[i]["gs_index"];
                    if ($S.isStringV2(cellMappingConfig[i]["defaultCellData"])) {
                        cellData = cellMappingConfig[i]["defaultCellData"];
                    }
                    if (gsIndex >= 0 && rowData.length > gsIndex) {
                        cellData = rowData[gsIndex];
                    }
                    if ($S.isArray(cellMappingConfig[i]["mappingData"])) {
                        for (var j=0; j<cellMappingConfig[i]["mappingData"].length; j++) {
                            if ($S.isArray(cellMappingConfig[i]["mappingData"][j]["range"])) {
                                gsIndex = cellMappingConfig[i]["mappingData"][j]["gs_index"];
                                if ($S.isNumber(gsIndex) && gsIndex >= 0 && gsIndex < rowData.length) {
                                    if (cellMappingConfig[i]["mappingData"][j]["range"].indexOf(this._replaceCellData(rowData[gsIndex])) >= 0) {
                                        if ($S.isStringV2(cellMappingConfig[i]["mappingData"][j]["value"])) {
                                            cellData = cellMappingConfig[i]["mappingData"][j]["value"];
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                finalRowData.push(cellData);
            }
        }
        if ($S.isArray(appendCellDataConfig) && appendCellDataConfig.length > 0) {
            isValidConfig = true;
            for (i=0; i<appendCellDataConfig.length; i++) {
                if ($S.isArray(appendCellDataConfig[i]) && appendCellDataConfig[i].length === 2) {
                    if ($S.isNumber(appendCellDataConfig[i][0]) && appendCellDataConfig[i][0] >= 0) {
                        startIndex = appendCellDataConfig[i][0];
                        if ($S.isNumber(appendCellDataConfig[i][1]) && appendCellDataConfig[i][1] >= 0) {
                            endIndex = appendCellDataConfig[i][1];
                        } else {
                            endIndex = rowData.length - 1;
                        }
                        for (var j=startIndex; j<=endIndex; j++) {
                            if (j < rowData.length) {
                                finalRowData.push(rowData[j]);
                            }
                        }
                    }
                }
            }
        }
        if (isValidConfig) {
            return finalRowData;
        }
        return rowData;
    },
    format: function(finalData) {
        var rowData = [];
        var skipRowIndexConfig, copyCellDataConfig, cellMappingConfig;
        if ($S.isArray(finalData)) {
            for (var i=0; i<finalData.length; i++) {
                if ($S.isObject(finalData[i]) && $S.isArray(finalData[i]["excelData"])) {
                    skipRowIndexConfig = this.getSkipRowIndexConfig(finalData[i]["fileMappingData"]);
                    copyCellDataConfig = this.getConfigData(finalData[i]["fileMappingData"]);
                    cellMappingConfig = this.getCellMappingConfig(finalData[i]["fileMappingData"]);
                    appendCellDataConfig = this.getAppendCellDataConfig(finalData[i]["fileMappingData"]);
                    for (var j=0; j<finalData[i]["excelData"].length; j++) {
                        if ($S.isArray(finalData[i]["excelData"][j])) {
                            for (var k=0; k<finalData[i]["excelData"][j].length; k++) {
                                if ($S.isArray(skipRowIndexConfig) && skipRowIndexConfig.length > 0) {
                                    if (skipRowIndexConfig.indexOf(k) >= 0) {
                                        finalData[i]["excelData"][j][k] = null;
                                        continue;
                                    }
                                }
                                rowData = finalData[i]["excelData"][j][k];
                                this._copyCellDataIndex(rowData, copyCellDataConfig);
                                rowData = this._applyCellMapping(rowData, cellMappingConfig, appendCellDataConfig);
                                finalData[i]["excelData"][j][k] = rowData;
                            }
                        }
                    }
                }
            }
        }
    }
});

CsvDataFormate.extend({
});

module.exports = CsvDataFormate;
})();
