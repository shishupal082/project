const $S = require("../libs/stack.js");

(function() {
var CONFIGDATA = {
    "workId": [0]
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
        if (!$S.isStringV2(workId)) {
            return false;
        }
        var config = {};
        if ($S.isArray(excelConfig) && excelConfig.length === 1) {
            if ($S.isObject(excelConfig[0]) && $S.isArray(excelConfig[0]["copyCellDataIndex"])) {
                config[workId] = [];
                for (var i=0; i<excelConfig[0]["copyCellDataIndex"].length; i++) {
                    if ($S.isNumber(excelConfig[0]["copyCellDataIndex"][i]) && excelConfig[0]["copyCellDataIndex"][i] >= 0) {
                        config[workId].push(excelConfig[0]["copyCellDataIndex"][i]);
                    }
                }
            }
        }
        CONFIGDATA = config;
        return true;
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
            if ($S.isArray(temp)) {
                for (var i=0; i<temp.length; i++) {
                    if ($S.isNumber(temp[i]) && temp[i] >= 0) {
                        configData.push({"index": temp[i], "previousData": ""});
                    }
                }
            }
            return configData;
        }
        return [];
    },
    _replaceCellData: function(rowData) {
        // console.log(rowData.join("---"));
        if ($S.isArray(rowData)) {
            for (var i=0; i<rowData.length; i++) {
                rowData[i] = $S.replaceString(rowData[i], ",", "...");
                rowData[i] = $S.replaceString(rowData[i], "\n", ";");
            }
        }
        // console.log(rowData.join("---"));
        return true;
    },
    replaceSpecialCharacterEachCell: function(finalData) {
        if ($S.isArray(finalData)) {
            for (var i=0; i<finalData.length; i++) {
                if ($S.isObject(finalData[i]) && $S.isArray(finalData[i]["excelData"])) {
                    for (var j=0; j<finalData[i]["excelData"].length; j++) {
                        if ($S.isArray(finalData[i]["excelData"][j])) {
                            for (var k=0; k<finalData[i]["excelData"][j].length; k++) {
                                this._replaceCellData(finalData[i]["excelData"][j][k]);
                            }
                        }
                    }
                }
            }
        }
        return true;
    },
    format: function(finalData) {
        var previousData = "";
        var rowData = [];
        var colIndex = 0;
        if ($S.isArray(finalData)) {
            for (var i=0; i<finalData.length; i++) {
                if ($S.isObject(finalData[i]) && $S.isArray(finalData[i]["excelData"])) {
                    var configData = this.getConfigData(finalData[i]["fileMappingData"]);
                    for (var j=0; j<finalData[i]["excelData"].length; j++) {
                        if ($S.isArray(finalData[i]["excelData"][j])) {
                            for (var k=0; k<finalData[i]["excelData"][j].length; k++) {
                                rowData = finalData[i]["excelData"][j][k];
                                if ($S.isArray(rowData) && $S.isArray(configData)) {
                                    for (var l=0; l<configData.length; l++) {
                                        if ($S.isObject(configData[l]) && $S.isNumber(configData[l]["index"]) && configData[l]["index"] >= 0) {
                                            colIndex = configData[l]["index"];
                                            if (colIndex < rowData.length) {
                                                if ($S.isStringV2(rowData[colIndex])) {
                                                    configData[l]["previousData"] = rowData[colIndex];
                                                }
                                                rowData[colIndex] = configData[l]["previousData"];
                                            }
                                        }
                                    }
                                }
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
