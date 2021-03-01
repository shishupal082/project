import $S from "../../interface/stack.js";
import $M from "../../interface/model.js";
import $ML2 from "../../interface/ML2.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


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
    _generateDependent: function(arr) {
        var result = [];
        for (var i = 0; i < arr.length; i++) {
            result.push({"tag": "div", "text": arr[i]});
        }
        return result;
    },
    _searchItems: function(searchingPattern, allData, searchByPattern) {
        if (!$S.isArray(searchingPattern) || !$S.isArray(allData)) {
            return [];
        }
        var result = [];
        var i, j, temp1, temp2;
        for(i=0; i<searchingPattern.length; i++) {
            temp1 = searchingPattern[i];
            if (searchByPattern) {
                temp1 = Config.patternMatching[searchingPattern[i]];
                if (temp1) {
                    for(j=0; j<allData.length; j++) {
                        temp2 = allData[j];
                        if (temp2.search(temp1) >= 0) {
                            result.push(temp2);
                        }
                    }
                }
            } else if (allData.indexOf(temp1) >= 0) {
                result.push(temp1);
            }
        }
        return result;
    },
    getReourceUtilities: function() {
        var possibleKeys = $M.getPossibleValues();
        var displayData = {};
        var tableData = [], temp, i;
        var currentData = DataHandler.getCurrentMetaData("filter1", "value");
        var monitorKey = $S.isArray(currentData["values"]) ? currentData["values"] : [];
        var searchByPattern = $S.isBooleanTrue(currentData["searchByPattern"]) ? true : false;
        var resultHorizontal = $S.isBooleanTrue(currentData["resultHorizontal"]) ? true : false;
        var finalMonitorKey = this._searchItems(monitorKey, possibleKeys, searchByPattern);

        for (i = 0; i < finalMonitorKey.length; i++) {
            temp = $M.getVariableDependenciesByKey(finalMonitorKey[i]);
            displayData[finalMonitorKey[i]] = temp;
            tableData.push([i+1, finalMonitorKey[i], this._generateDependent(temp)]);
        }
        console.log(tableData);
        if (resultHorizontal) {
            tableData = $S.convertRowToColumn(tableData);
        }
        return tableData;
    },
    getRenderData: function(name) {
        var list2Id = name;
        if (list2Id === "resourceUtilities") {
            return this.getReourceUtilities();
        }
        var renderData = $ML2.getData(list2Id);
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
        }
        return renderData;
    },
});

})($S);

export default DataHandlerV2;
