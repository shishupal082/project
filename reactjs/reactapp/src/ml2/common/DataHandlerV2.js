import $S from "../../interface/stack.js";
import $M from "../../interface/model.js";
import $ML2 from "../../interface/ML2.js";
import DataHandler from "./DataHandler";


// import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerV2;

(function($S){
// var DT = $S.getDT();
$M().setBinaryOperators(["*","+"]);
DataHandlerV2 = function(arg) {
    return new DataHandlerV2.fn.init(arg);
};
DataHandlerV2.fn = DataHandlerV2.prototype = {
    constructor: DataHandlerV2,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerV2);


DataHandlerV2.extend({
    updateModel: function() {
        var expression = {};
        var duplicateExpression = {};
        var duplicateExpressionCount = 0;
        var possibleKeys = [];
        var i, j;
        var data = $ML2.getData("expression", []);
        var key, exp;
        for (i = 0; i<data.length; i++) {
            for( j=0; j<data[i].length; j++) {
                if (data[i][j].length !== 2) {
                    $S.log("Invalid expression: update" + data[i][j].join(":"));
                    continue;
                }
                key = data[i][j][0];
                exp = data[i][j][1];
                if ($S.isDefined(expression[key])) {
                    if ($S.isDefined(duplicateExpression[key])) {
                        duplicateExpression[key] = duplicateExpression[key]+1;
                    } else {
                        duplicateExpression[key] = 2;
                        duplicateExpressionCount = duplicateExpressionCount+1;
                    }
                } else {
                    possibleKeys.push(key);
                    expression[key] = exp;
                }
            }
        }
        $S.log("duplicateExpressionCount: " + duplicateExpressionCount);
        console.log(duplicateExpression);
        possibleKeys = possibleKeys.sort();
        $M().setPossibleValues(possibleKeys);
        for(var k in expression) {
            $M(k).addExp(expression[k].split(" ").join(""));
        }
        $M.setVariableDependencies();
    },
    HandleRawDataLoad: function(response, callback) {
        DataHandler.setData("evaluating", "in-progress");
        setTimeout(function() {
            $ML2(response);
            DataHandlerV2.updateModel();
            DataHandler.setData("evaluating", "completed");
            $S.callMethod(callback);
        }, 1);
    },
    setRenderData: function(callback) {
        DataHandler.setData("evaluating", "in-progress");
        DataHandler.setData("renderData", []);
        setTimeout(function() {
            DataHandler.setData("evaluating", "completed");
            var renderData = DataHandlerV2.getRenderData(DataHandler.getData("list2Id", ""));
            DataHandler.setData("renderData", renderData);
            $S.callMethod(callback);
        }, 1);
    },
    ClearRawDataLoad: function(response) {
        $ML2([]);
    },
    _generateDependent: function(arr, currentData) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            result.push({"tag": "div", "text": arr[i]});
        }
        if ($S.isObject(currentData) && $S.isString(currentData.resultType)) {
            if (currentData.resultType === "join" && $S.isString(currentData.joinBy)) {
                result = arr.join(currentData.joinBy);
            }
        }
        return result;
    },
    _getFinalMonitorKey: function(selectedMonitorKey) {
        if (!$S.isArray(selectedMonitorKey)) {
            return selectedMonitorKey;
        }
        var monitorKeyMapping = DataHandler.getAppData("monitorKeyMapping", {});
        if (!$S.isObject(monitorKeyMapping)) {
            return selectedMonitorKey;
        }
        var finalData = [];
        for(var i=0; i<selectedMonitorKey.length; i++) {
            if (!$S.isStringV2(selectedMonitorKey[i])) {
                continue;
            }
            if (!$S.isArray(monitorKeyMapping[selectedMonitorKey[i]])) {
                finalData.push(selectedMonitorKey[i]);
                continue;
            }
            finalData = finalData.concat(monitorKeyMapping[selectedMonitorKey[i]]);
        }
        return finalData;
    },
    getReourceUtilities: function() {
        var possibleKeys = $M.getPossibleValues();
        var displayData = {};
        var tableData = [], temp, i;
        var selectedFilterData = DataHandler.getCurrentMetaData("filter1", "value");
        if (!$S.isObject(selectedFilterData)) {
            selectedFilterData = {};
        }
        var searchByPattern = $S.isBooleanTrue(selectedFilterData["searchByPattern"]) ? true : false;
        var monitorKey = selectedFilterData["values"];
        var resultPattern = selectedFilterData["resultPattern"];
        monitorKey = this._getFinalMonitorKey(monitorKey);
        resultPattern = this._getFinalMonitorKey(resultPattern);
        var finalMonitorKey = $S.searchItems(monitorKey, possibleKeys, searchByPattern);
        for (i = 0; i < finalMonitorKey.length; i++) {
            temp = $M.getVariableDependenciesByKey(finalMonitorKey[i]);
            displayData[finalMonitorKey[i]] = temp;
            temp = $S.searchItems(resultPattern, temp, true);
            tableData.push([i+1, finalMonitorKey[i], this._generateDependent(temp, selectedFilterData)]);
        }
        console.log(tableData);
        var filter2 = DataHandler.getData("filter2", "");
        if (filter2 !== "vertical") {
            tableData = $S.convertRowToColumn(tableData);
        }
        return tableData;
    },
    getRenderData: function(name) {
        var list2Id = name;
        if (list2Id === "resourceUtilities") {
            return this.getReourceUtilities();
        }
        var ml2DataKeys = ["apiResponse", "ml2FileRawData", "ml2FileData", "commentData", "assignStatement", "expression"];
        var renderData = [];
        if (ml2DataKeys.indexOf(list2Id) >= 0) {
            renderData = $ML2.getData(list2Id);
        } else if (["expressionV2"].indexOf(list2Id) >= 0) {
            renderData = $ML2.getData("expression");
        } else if (list2Id === "customeBlockData") {
            var currentData = DataHandler.getCurrentList2Data();
            renderData = $ML2.getBlockData(currentData.requiredBlockPattern);
            renderData = renderData.filter(function(el, i) {
                if ($S.isArray(el)) {
                    return el.length > 0;
                }
                return false;
            });
        }
        var temp, i, j;
        if (list2Id === "assignStatement") {
            for(i = 0; i<renderData.length; i++) {
                temp = [];
                temp.push(i+1);
                temp = temp.concat(renderData[i]);
                renderData[i] = temp;
            }
        } else if (list2Id === "expression") {
            for(i = 0; i<renderData.length; i++) {
                temp = [];
                temp.push(i+1);
                for(j=0; j<renderData[i].length; j++) {
                    temp.push(renderData[i][j].join("="));
                }
                renderData[i] = temp;
            }
        } else if (list2Id === "expressionV2") {
            temp = [];
            for(i = 0; i<renderData.length; i++) {
                for(j=0; j<renderData[i].length; j++) {
                    temp.push(renderData[i][j].join("="));
                }
            }
            renderData = [temp];
        }
        var filter2 = DataHandler.getData("filter2", "");
        if (filter2 !== "vertical") {
            renderData = $S.convertRowToColumn(renderData);
        }
        return renderData;
    },
});

})($S);

export default DataHandlerV2;
