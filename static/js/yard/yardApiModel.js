/*
    - Load possibleValue, initialValue and expressions from api
        - It do not care about rendering yardHtml using yard api data
    - Set these values to model ($M)
*/

(function(window, $M) {
var LoggerInfo = $M.getScriptFileNameRef();
var YardApiModel = function(selector, context) {
    return new YardApiModel.fn.init(selector, context);
};

YardApiModel.fn = YardApiModel.prototype = {
    constructor: YardApiModel,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};

ExtendObject(YardApiModel);

var RequestId = $M.getRequestId();

var PartialExpressions = {};
var PossibleValues = [];
var InitialValues = {};
var AllExpressions = [];
var ExpWithoutKey = {};

var ExpressionsAdded = [];

var PartialExpressionsLoadStatus = false;
var PossibleValuesLoadStatus = false;
var InitialValuesLoadStatus = false;
var ExpressionsLoadStatus = false;

var PartialExpressionsPath = [];
var PossibleValuePath = [];
var InitialValuePath = [];
var ExpressionsPath = [];

var PossibleValuesByTypes = {};

var partialKeys = [];

function isApisLoadComplete() {
    var loadingCheck = [];
    loadingCheck.push(PartialExpressionsLoadStatus);
    loadingCheck.push(PossibleValuesLoadStatus);
    loadingCheck.push(InitialValuesLoadStatus);
    loadingCheck.push(ExpressionsLoadStatus);
    for (var i = 0; i < loadingCheck.length; i++) {
        if (loadingCheck[i] == false) {
            return false;
        }
    }
    return true;
}

function loadPartialExpressions(callBack) {
    var url = [];
    for (var i = 0; i < PartialExpressionsPath.length; i++) {
        url.push(PartialExpressionsPath[i]+"?"+RequestId);
    }
    $M.loadJsonData($, url, function(response) {
        if ($M.isObject(response)) {
            for (var key in response) {
                PartialExpressions[key] = response[key];
                partialKeys.push(key);
            }
        } else {
            $M.log("Invalid response (partialExpressions):" + response, LoggerInfo);
        }
    }, callBack);
}

function loadPossibleValues(callBack) {
    var url = [];
    for (var i = 0; i < PossibleValuePath.length; i++) {
        url.push(PossibleValuePath[i]+"?"+RequestId);
    }
    $M.loadJsonData($, url, function(response) {
        if ($M.isObject(response)) {
            for (var key in response) {
                if ($M.isArray(response[key])) {
                    for (var i = 0; i < response[key].length; i++) {
                        if (key == "addDebug") {
                            continue;
                        }
                        if ($M.isString(response[key][i])) {
                            PossibleValues.push(response[key][i]);
                        }
                    }
                    if ($M.isArray(PossibleValuesByTypes[key])) {
                        PossibleValuesByTypes[key] = PossibleValuesByTypes[key].concat(response[key]);
                    } else {
                        PossibleValuesByTypes[key] = response[key];
                    }
                }
            }
        } else {
            $M.log("Invalid response (possibleValue):" + response, LoggerInfo);
        }
    }, callBack);
}
function loadInitialValues(callBack) {
    var url = [];
    for (var i = 0; i < InitialValuePath.length; i++) {
        url.push(InitialValuePath[i]+"?"+RequestId);
    }
    $M.loadJsonData($, url, function(response) {
        if ($M.isObject(response)) {
            Object.assign(InitialValues, response);
        } else {
            $M.log("Invalid response (initialValue):" + response, LoggerInfo);
        }
    }, callBack);
}

function addExp(key, exp) {
    var partialKey, partialExp;
    for (var i = 0; i < partialKeys.length; i++) {
        partialKey = partialKeys[i];
        if (exp.search(partialKey) >= 0) {
            partialExp = $M.generateExpression(PartialExpressions[partialKey]);
            exp = exp.replace(partialKey, partialExp);
            i = 0;
        }
    }
    return $M(key).addExp(exp);
}
function loadExpressions(callBack) {
    var url = [];
    for (var i = 0; i < ExpressionsPath.length; i++) {
        url.push(ExpressionsPath[i]+"?"+RequestId);
    }
    $M.loadJsonData($, url, function(response) {
        if ($M.isObject(response)) {
            AllExpressions.push(response);
        }
    }, function() {
        var allExpressions = AllExpressions;
        for (var i = 0; i < allExpressions.length; i++) {
            exps = allExpressions[i];
            for (var key in exps) {
                if (ExpressionsAdded.indexOf(key) < 0) {
                    ExpressionsAdded.push(key);
                } else {
                    $M.log("Expressions for '" + key + "' already added.", LoggerInfo);
                }
                if ($M.isArray(exps[key])) {
                    for (var j = 0; j < exps[key].length; j++) {
                        if ($M.isObject(exps[key][j])) {
                            addExp(key, $M.generateExpression(exps[key][j]));
                            // $M(key).addExp($M.generateExpression(exps[key][j]));
                        } else {
                            addExp(key, exps[key][j]);
                            // $M(key).addExp(exps[key][j]);
                        }
                    }
                } else if ($M.isObject(exps[key])) {
                    addExp(key, $M.generateExpression(exps[key]));
                    // $M(key).addExp($M.generateExpression(exps[key]));
                }
            }
        }
        callBack();
    });
}

YardApiModel.extend({
    documentLoaded: function(callBack) {
        loadPartialExpressions(function() {
            PartialExpressionsLoadStatus = true;
            loadPossibleValues(function() {
                PossibleValuesLoadStatus = true;
                $M().setPossibleValues(PossibleValues);
                var debugItems = YardApiModel.getPossiblesValueByType("addDebug");
                for (var j = 0; j < debugItems.length; j++) {
                    $M(debugItems[j]).addDebug();
                }
                loadInitialValues(function() {
                    InitialValuesLoadStatus = true;
                    $M().initializeCurrentValues(InitialValues);
                    loadExpressions(function() {
                        ExpressionsLoadStatus = true;
                        if (isApisLoadComplete()) {
                            callBack();
                        }
                    });
                });
            });
        });
    }
});

YardApiModel.extend({
    getAllPossiblesValueByType: function() {
        return PossibleValuesByTypes;
    },
    getPossiblesValueByType: function(key) {
        if (PossibleValuesByTypes[key]) {
            return PossibleValuesByTypes[key];
        }
        return [];
    },
    setApisPath: function(paths) {
        for (var key in paths) {
            switch(key) {
                case "possible-value":
                    PossibleValuePath = PossibleValuePath.concat(paths[key]);
                break;
                case "initial-value":
                    InitialValuePath = InitialValuePath.concat(paths[key]);
                break;
                case "expressions":
                    ExpressionsPath = ExpressionsPath.concat(paths[key]);
                break;
                case "partial-expressions-value":
                    PartialExpressionsPath = PartialExpressionsPath.concat(paths[key]);
                break;
            }
        }
        return 1;
    }
});
YardApiModel.extend({
    getExpressionsStatus: function() {
        var possiblesValueByType = PossibleValuesByTypes;
        var expressions = $M.getExps().exps;
        var missingExpressionItems = {};
        var expMissingList = [];
        var foundExpressionItens = {};
        var expFoundList = [];
        var item;

        for (var type in possiblesValueByType) {
            for (var i = 0; i < possiblesValueByType[type].length; i++) {
                item = possiblesValueByType[type][i];
                if ($M.isArray(expressions[item])) {
                    if (!$M.isArray(foundExpressionItens[type])) {
                        foundExpressionItens[type] = [];
                    }
                    foundExpressionItens[type].push(item);
                    expFoundList.push(item);
                    continue;
                }
                if (!$M.isArray(missingExpressionItems[type])) {
                    missingExpressionItems[type] = [];
                }
                expMissingList.push(item);
                missingExpressionItems[type].push(item);
            }
        }
        var response = {
            missing: missingExpressionItems,
            found: foundExpressionItens,
            expMissingList: expMissingList,
            expFoundList: expFoundList,
            expWithoutKey: ExpWithoutKey
        };
        return response;
    }
});
var logData = [];

YardApiModel.extend({
    displayChangeValueData: function() {
        var changeValueData = $M.getAllChangeValueData();
        var zeroTo1 = changeValueData["0to1WithIndex"];
        var oneTo0 = changeValueData["1to0WithIndex"];
        var all = changeValueData["all"];
        $M.addElAt(logData, 0, {zeroTo1: zeroTo1, oneTo0: oneTo0, all: all});
        // console.log(zeroTo1);
        // console.log(oneTo0);
        // console.log(all);
        var displayHtml = "";
        for (var i = 0; i < logData.length; i++) {
            zeroTo1 = logData[i]["zeroTo1"];
            oneTo0 = logData[i]["oneTo0"];
            all = logData[i]["all"];
            if (zeroTo1.length != oneTo0.length) {
                $M.logV2(LoggerInfo, "Invalid data.");
                console.log(logData[i]);
                continue;
            }
            var tempData = [];
            var tableData = [];
            var dataAddedStatus;
            for (var j = 0; j < zeroTo1.length; j++) {
                dataAddedStatus = false;
                if (all.indexOf(zeroTo1[j]) >= 0) {
                    dataAddedStatus = true;
                    tableData.push('<span class="alert-success">' + zeroTo1[j] + '</span>');
                }
                if (all.indexOf(oneTo0[j]) >= 0) {
                    dataAddedStatus = true;
                    tableData.push('<span class="alert-warning">' + oneTo0[j] + '</span>');
                }
                if (!dataAddedStatus) {
                    tempData.push(zeroTo1[j]);
                    tempData.push(oneTo0[j]);
                }
            }
            if (tempData.length) {
                $M.logV2(LoggerInfo, "Keys not found in all.");
                console.log(tempData);
            }
            var table = $M.getTable([tableData], "display-log");
            table.addColIndex(1);
            displayHtml += table.getHtml();
            displayHtml += "<hr>";
        }
        $("#changeValueData").html(displayHtml);
        $("#changeValueData table").addClass("table table-bordered");
        $("span.alert-warning").parent("td").addClass("alert-warning")
        $("span.alert-success").parent("td").addClass("alert-success")
        return 1;
    }
});
window.$YApiModel = YardApiModel;
})(window, $M);
