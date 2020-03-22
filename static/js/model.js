(function(window, $S) {

var loopCount = 0, setValueCount = 0, setValueCountLimit = 400;
var possibleValues = [];
var reCheckingStatus = true;
var verifyExpression = true;
var isProcessingCountEnable = false;
var changeValueLogStatus = true;
var changeValueDataLoggingEnable = false;
var changeValueData = {
    "0to1": [],
    "1to0": [],
    "0to1WithIndex": [],
    "1to0WithIndex": [],
    "all": []
};
var currentValues = {};
var exps = {};
var debug = [];
var valueToBeChecked = [];
var processingCount = {};
var variableDependencies = {};
var binaryOperators = ["&&","||","~"];
var binaryOperatorIncludingBracket = ["(",")"].concat(binaryOperators);
var binaryOperatorIncludingValue = [true,false].concat(binaryOperators);
var overwrittenMethodLogExluded = ["createPosixTree"];
var MStack = $S.getStack();

var EvaluatingExpressionKey = "";

var Model = function(selector, context) {
    return new Model.fn.init(selector, context);
};
function setValueTobeChecked(values) {
    valueToBeChecked = [];
    for (var i = 0; i < values.length; i++) {
        if (valueToBeChecked.indexOf(values[i]) >= 0) {
            continue;
        } else {
            valueToBeChecked.push(values[i]);
        }
    }
    return true;
}
function increaseProcessingCount(name) {
    if (isProcessingCountEnable == false) {
        return name;
    }
    if (processingCount[name]) {
        processingCount[name]++;
    } else {
        processingCount[name] = 1;
    }
    if (Model.isFunction(Model["processingCallBack"])) {
        Model["processingCallBack"](name, processingCount[name]);
    }
    return name;
}
function setVariableDependencies (name1, name2) {
    if (Model.isArray(variableDependencies[name1])) {
        if (variableDependencies[name1].indexOf(name2) < 0) {
            variableDependencies[name1].push(name2);
        }
    } else {
        variableDependencies[name1] = [name2];
    }
    if (Model.isArray(variableDependencies[name2])){
        if (variableDependencies[name2].indexOf(name1) < 0) {
            variableDependencies[name2].push(name1);
        }
    } else {
        variableDependencies[name2] = [name1];
    }
    return variableDependencies;
}
var setValue = (function() {
    var isValueChanged = false;
    function set(key, value) {
        isValueChanged = false;
        var keyEquivalent;
        if (Model.isValidKey(key) && Model.isValidValue(value)) {
            var oldValue = Model(key).get();
            currentValues[key] = value*1;
            var newValue = Model(key).get();
            if (oldValue != newValue) {
                setValueCount++;
                keyEquivalent = "";
                for (var i = 0; i < key.length; i++) {
                    keyEquivalent += "-";
                }
                if (changeValueDataLoggingEnable) {
                    changeValueData["all"].push(key);
                    if (oldValue == 0) {
                        changeValueData["0to1"].push(key);
                        changeValueData["0to1WithIndex"].push(key);
                        changeValueData["1to0WithIndex"].push(keyEquivalent);
                    }
                    if (oldValue == 1) {
                        changeValueData["1to0"].push(key);
                        changeValueData["1to0WithIndex"].push(key);
                        changeValueData["0to1WithIndex"].push(keyEquivalent);
                    }
                }
                if (changeValueLogStatus) {
                    $S.log(setValueCount + ": set " + key + " value change from " + oldValue + " to " + newValue);
                }
                isValueChanged = true;
            }
        } else {
            $S.log("Invalid key for set: " + key);
        }
        return isValueChanged;
    }
    set.prototype.isValueChanged = function() {
        return isValueChanged;
    };
    return set;
})();
function isValidValue(value) {
    if (isNaN(value) || [0,1].indexOf(value*1) < 0) {
        return false;
    }
    return true;
}
function isValidKey(key) {
    return possibleValues.indexOf(key) >= 0 ? true : false;
}
/*
Direct access by id: $M("id").get()
*/
Model.fn = Model.prototype = {
    constructor: Model,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.key = selector;
        }
        return this;
    },
    get: function() {
        if (isValidKey(this.key)) {
            return currentValues[this.key] ? currentValues[this.key] : 0;
        }
        $S.log("Invalid key for get: " + this.key);
        return 0;
    },
    isUp: function(value) {
        return this.get() == 1;
    },
    isDown: function(value) {
        return this.get() == 0;
    },
    addExp: function(exp) {
        if (isValidKey(this.key)) {
            if (exps[this.key] && exps[this.key].length) {
                if (exps[this.key].indexOf(exp) < 0) {
                    exps[this.key].push(exp);
                } else {
                    // $S.log("Trying to add duplicate expression for key:" + this.key + ", expression:"+exp);
                }
            } else {
                exps[this.key] = [exp];
            }
        } else {
            $S.log("Invalid expression key:" + this.key);
        }
        return 0;
    },
    initializeCurrentValues: function(extCurrentValues) {
        if (Model.isObject(extCurrentValues)) {
            for (var key in extCurrentValues) {
                if (isValidKey(key)) {
                    currentValues[key] = extCurrentValues[key];
                } else {
                    $S.log("Invalid initializeCurrentValues key: " + key);
                }
            }
        }
        return currentValues;
    },
    setPossibleValues: function(extPossibleValues) {
        if (Model.isArray(extPossibleValues)) {
            possibleValues = [];
            for (var i = 0; i < extPossibleValues.length; i++) {
                if (possibleValues.indexOf(extPossibleValues[i]) >= 0) {
                    throw "Duplicate entry in possibleValues: " + extPossibleValues[i];
                }
                if ($S.isString(extPossibleValues[i]) && extPossibleValues[i].length > 0) {
                    possibleValues.push(extPossibleValues[i]);
                }
            }
            setValueTobeChecked(possibleValues);
        }
        return 1;
    },
    setValueTobeChecked: function(values) {
        if (Model.isArray(values)) {
            setValueTobeChecked(values);
            return 1;
        }
        return 0;
    },
    setBinaryOperators: function(opr) {
        var operators = [];
        if (Model.isArray(opr)) {
            for (var i = 0; i < opr.length; i++) {
                if (["&&","&","*","||","|","#","+","~"].indexOf(opr[i]) >= 0) {
                    operators.push(opr[i]);
                }
            }
        }
        binaryOperators = operators;
        binaryOperatorIncludingBracket = ["(",")"].concat(binaryOperators);
        binaryOperatorIncludingValue = [true,false].concat(binaryOperators);
        return 1;
    },
    addDebug: function() {
        if (isValidKey(this.key)) {
            if (debug.indexOf(this.key) < 0) {
                debug.push(this.key);
                return 1;
            }
        } else {
            $S.log("Invalid key for debug:" + this.key);
        }
        return 0;
    }
};
ExtendObject(Model);
/*
End of direct access of ID
*/
/*Direct access of methods: $M.methodName*/
Model.extend({
    setVariableDependencies: function() {
        for (var expName in exps) {
            var expressions = exps[expName];
            var tokenizedExp = [];
            for (var i = 0; i < expressions.length; i++) {
                tokenizedExp = Model.getTokenizedExp(expressions[i]);
                if (tokenizedExp.length) {
                    for (var j = 0; j < tokenizedExp.length; j++) {
                        if (binaryOperatorIncludingBracket.indexOf(tokenizedExp[j]) < 0) {
                            setVariableDependencies(expName, tokenizedExp[j]);
                        }
                    }
                }
            }
        }
        return variableDependencies;
    },
    updateVariableDependencies: function(name, dependencies) {
        if (isValidKey(name) && Model.isArray(dependencies)) {
            variableDependencies[name] = dependencies;
        }
        return variableDependencies;
    },
    addInMStack: function (values) {
        var allValues = MStack.getAll();
        for (var  i = values.length-1; i >= 0; i--) {
            if (allValues.indexOf(values[i]) <0) {
                MStack.push(values[i]);
            }
        }
        return MStack.getAll();
    }
});
Model.extend({
    getStack: function(shareStorage) {
        return $S.getStack(shareStorage);
    },
    getLocalStorage: function() {
        return $S.getLocalStorage();
    },
    getTable: function(tableContent, tableId) {
        return $S.getTable(tableContent, tableId);
    },
    getDT: function() {
        return $S.getDT();
    },
    getBT: function(data) {
        return $S.getBT(data);
    },
    getBST: function(data) {
        return $S.getBST(data);
    },
    getUniqueNumber: function(minVal, maxVal) {
        return $S.getUniqueNumber();
    },
    getUniqueNumber: function() {
        return $S.getUniqueNumber();
    },
    getRequestId: function() {
        return $S.getRequestId();
    },
    setLoggerDateTimeState: function(state,formats,splitter) {
        return $S.setLoggerDateTimeState(state,formats,splitter);
    },
    log: function(logText) {
        return $S.log(logText);
    },
    enableChangeValueDataLogging: function() {
        changeValueDataLoggingEnable = true;
        return 1;
    },
    disableChangeValueDataLogging: function() {
        changeValueDataLoggingEnable = false;
        return 0;
    },
    enableChangeLogValueStatus: function() {
        changeValueLogStatus = true;
        return 1;
    },
    disableChangeLogValueStatus: function() {
        changeValueLogStatus = false;
        return 0;
    },
    enableVerifyExpression: function() {
        verifyExpression = true;
        return 1;
    },
    disableVerifyExpression: function() {
        verifyExpression = false;
        return 0;
    },
    enableReChecking: function() {
        reCheckingStatus = true;
        return 1;
    },
    disableReChecking: function() {
        reCheckingStatus = false;
        return 0;
    },
    enableProcessingCount: function() {
        isProcessingCountEnable = true;
        return 1;
    },
    disableProcessingCount: function() {
        isProcessingCountEnable = false;
        return 0;
    },
    getSetValueCount: function() {
        return setValueCount;
    },
    resetSetValueCount: function(newLimit) {
        setValueCount = 0;
        return 1;
    },
    changeSetValueCountLimit: function(newLimit) {
        if(Model.isNumber(newLimit)) {
            setValueCountLimit = newLimit*1;
            return 1;
        }
        $S.log("Invalid newLimit:" + newLimit);
        return 0;
    }
});
Model.extend({
    isValidValue: function(value) {
        return isValidValue(value);
    },
    isValidKey: function(key) {
        return isValidKey(key);
    },
    isString: function(value) {
        return $S.isString(value);
    },
    isArray: function(value) {
        return $S.isArray(value);
    },
    isObject: function(value) {
        return $S.isObject(value);
    },
    isNumber: function(value) {
        return $S.isNumber(value);
    },
    isFunction: function(value) {
        return $S.isFunction(value);
    },
    isMethodDefined: function(name) {
        return Model.isFunction(this[name]);
    },
    isExpDefined: function(name) {
        if (exps[name] && exps[name].length) {
            return true;
        }
        return false;
    },
    getExps: function() {
        var expsResponse = {};
        var count = 0;
        for (var key in exps) {
            expsResponse[key] = exps[key];
            count++;
        }
        return {exps: expsResponse, count: count};
    },
    getPossibleValues : function() {
        return $S.clone(possibleValues);
    },
    getValueToBeChecked : function() {
        return $S.clone(valueToBeChecked);;
    },
    getReCheckingStatus: function() {
        return reCheckingStatus;
    },
    getProcessingCountStatus: function() {
        return isProcessingCountEnable;
    },
    getVerifyExpressionStatus: function() {
        return verifyExpression;
    },
    getProcessingCount: function() {
        var bst = Model.getBST();
        var response = {sortedResult: {}, total: 0, itemsCount: 0, processingCount: {}};
        for (var key in processingCount) {
            response.itemsCount++;
            response.total += processingCount[key];
            response.processingCount[key] = processingCount[key];
            var currentNode = bst.insertData(bst, processingCount[key]);
            currentNode.item = {count: processingCount[key], name: key};
        }
        var bstArr = bst.getInOrder(bst, []);
        var result = {};
        for (var i = bstArr.length-1; i >= 0; i--) {
            if (bstArr[i].item) {
                result[bstArr[i].item.name] = bstArr[i].item.count;
            }
        }
        response.sortedResult = result;
        return response;
    },
    getAllChangeValueData: function (changeValueKey) {
        return changeValueData;
    },
    getChangeValueData: function (changeValueKey) {
        var response = [];
        if (Model.isArray(changeValueData[changeValueKey])) {
            response = changeValueData[changeValueKey];
        }
        return response;
    },
    resetChangeValueData: function () {
        for (var key in changeValueData) {
            changeValueData[key] = [];
        }
        return 0;
    },
    getVariableDependencies: function(sortedResultRequired) {
        var bst = Model.getBST();
        var response = {sortedResult: {}, count: 0, dependencies: {}};
        for (var key in variableDependencies) {
            response.count++;
            response.dependencies[key] = variableDependencies[key];
        }
        if ($S.isBoolean(sortedResultRequired) && sortedResultRequired) {
            for (var key in response.dependencies) {
                var currentNode = bst.insertData(bst, response.dependencies[key].length);
                currentNode.item = {count: response.dependencies[key].length, name: key};
            }
            var bstArr = bst.getInOrder(bst, []);
            var result = {};
            for (var i = bstArr.length-1; i >= 0; i--) {
                if (bstArr[i].item) {
                    result[bstArr[i].item.name] = bstArr[i].item.count;
                }
            }
            response.sortedResult = result;
        }
        return response;
    },
    getVariableDependenciesByKey: function(name) {
        var dependentVariable = [];
        if (variableDependencies[name]) {
            dependentVariable = variableDependencies[name];
        }
        return dependentVariable;
    },
    getCurrentValues : function() {
        var currentValuesResponse = {};
        var count = 0;
        for (var key in currentValues) {
            currentValuesResponse[key] = currentValues[key];
            count++;
        }
        return {currentValues: currentValuesResponse, count: count};
    }
});
Model.extend({
    is: function(key, type) {
        if (type == "up") {
            return Model(key).isUp();
        } else if (type == "dn") {
            return Model(key).isDown();
        }
        return false;
    },
    isUp: function(key) {
        return Model(key).isUp();
    },
    isAllUp: function(keys) {
        if (Model.isArray(keys) && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                if (Model(keys[i]).isDown()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    isDown: function(key) {
        return Model(key).isDown();
    },
    isAllDown: function(keys) {
        if (Model.isArray(keys) && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                if (Model(keys[i]).isUp()) {
                    return false;
                }
            }
            return true;
        }
        return false;
    },
    getValue: function(key) {
        return Model(key).get();
    },
    setValue: function(key, newValue) {
        if (setValueCount >= setValueCountLimit) {
            setValueCount++;
            var logText = setValueCount + ": Limit exceed, key:" + key + ", value:" + newValue;
            $S.log(logText);
            throw logText;
            return 0;
        }
        var oldValue = Model(key).get();
        var set = new setValue(key, newValue);
        if (set.isValueChanged()) {
            if (Model.isFunction(Model["setValueChangedCallback"])) {
                Model["setValueChangedCallback"](key, oldValue, newValue);
            } else {
                Model.addInMStack(Model.getVariableDependenciesByKey(key));
                Model.reCheckAllValuesV2();
            }
        }
        return 0;
    },
    toggleValue: function(key) {
        var newValue = 1;
        if (Model(key).isUp()) {
            newValue = 0;
        }
        return Model.setValue(key, newValue);
    }
});
Model.extend({
/*
possibleValues = [1,2,3,4,5,6,7,8,9,10];
variableDependencies = {
    1: [2,3,4]
    2: [1,3]
    3: [1,2,5,6]
    4: [1]
    5: [3]
    6: [3]
};
exps : {
    1: []
    2: []
    3: []
    4: []
    5: []
    6: []
};
*/
    reCheckAllValuesV2: function() {
        if (reCheckingStatus == false) {
            return 0;
        }
        while(MStack.getTop() >= 0) {
            var name = MStack.pop();
            increaseProcessingCount(name);
            if (Model.isExpDefined(name)) {
                Model.setValueWithExpression(name);
            }
        }
        return 1;
    },
    reCheckAllValues: function() {
        if (reCheckingStatus == false) {
            return 0;
        }
        for (var i = 0; i < valueToBeChecked.length; i++) {
            var name = valueToBeChecked[i];
            increaseProcessingCount(name);
            var modelNode = Model(name);
            var oldValue = modelNode.get();
            var newValue = 0;
            if (Model.isExpDefined(name)) {
                Model.setValueWithExpression(name);
            } else if (Model.isMethodDefined(name)) {
                Model[name](name);
            } else if (Model.isFunction(Model["setValueDefaultMethod"])) {
                Model["setValueDefaultMethod"](name);
            }
            newValue = modelNode.get();
            // To avoid further processing if value changed
            // Because it will already handle by setValue method
            if (oldValue != newValue) {
                break;
            }
        }
        return 1;
    },
    generateExpression: function(items) {
        var itemsWithExp = $S.generateExpression(items);
        return itemsWithExp ? itemsWithExp["exp"] : "";
    },
    setValueWithExpression: function(name) {
        var exp = exps[name];
        var oldValue = Model(name).get();
        var newValue = 0;
        if (debug.indexOf(name) >=0) {
            EvaluatingExpressionKey = name;
            $S.log("DEBUG: " + name);
        }
        newValue = Model.isAllExpressionsTrue(exp) ? 1 : 0;
        if (debug.indexOf(name) >=0) {
            $S.log(name + ", oldValue=" + oldValue + ", newValue=" + newValue);
            EvaluatingExpressionKey = "";
        }
        Model.setValue(name, newValue);
        return newValue;
    },
    getTokenizedExp: function(exp) {
        var tokenizedExp = $S.tokenize(exp, binaryOperatorIncludingBracket);
        return tokenizedExp;
    },
    isExpressionTrue: function(exp) {
        var tokenizedExp = Model.getTokenizedExp(exp);
        var posix = Model["createPosixTree"](tokenizedExp);
        var posixVal = [], posixValue;
        if (posix.length) {
            for (var i = 0; i < posix.length; i++) {
                posixValue = posix[i];
                /*  posixValue can be following:
                        "key","~",
                        "&&","&",
                        "||","|","#",
                        "*","+"
                */
                if (binaryOperators.indexOf(posixValue) < 0) {
                    posixValue = Model.isUp(posixValue);
                }
                posixVal.push(posixValue);
            }
        }
        var result = $S.calBinary(posixVal);
        if (debug.indexOf(EvaluatingExpressionKey) >=0) {
            console.log(exp);
            console.log(posix);
            console.log(posixVal);
            console.log(result);
        }
        /** Expression validation start **/
        if (verifyExpression) {
            var isValidExpression = true;
            for (var i = 0; i < posixVal.length; i++) {
                if (binaryOperatorIncludingValue.indexOf(posixVal[i]) >= 0) {
                    continue;
                } else {
                    isValidExpression = false;
                    $S.log(EvaluatingExpressionKey + ": invalid posixVal: " + posixVal[i]);
                }
            }
            var tokenizedExpLength = 0;
            for (var i = 0; i < tokenizedExp.length; i++) {
                if (["(",")"].indexOf(tokenizedExp[i]) >= 0) {
                    continue;
                }
                tokenizedExpLength++;
            }
            if (tokenizedExpLength != posixVal.length) {
                isValidExpression = false;
                $S.log(EvaluatingExpressionKey + ": invalid expression: " + exp);
            }
            if (isValidExpression == false) {
                throw EvaluatingExpressionKey + ": invalid expression:" + exp;
            }
        }
        /** Expression validation End **/
        return result;
    }
});
Model.extend({
    isAllExpressionsTrue: function(exps) {
        var status = false, exp = "";
        if (Model.isArray(exps)) {
            for (var i = 0; i < exps.length; i++) {
                exp = exps[i];
                if (Model.isObject(exp)) {
                    exp = Model.generateExpression(exp);
                }
                if (Model.isExpressionTrue(exp)) {
                    status = true;
                    continue;
                } else {
                    status = false;
                    break;
                }
            }
        } else if (Model.isObject(exps)) { 
            status = Model.isAllExpressionsTrue([exps]);
        }
        return status;
    },
    "createPosixTree": $S.createPostOrderTree,
    setCreatePosixTreeMethodWithFilter: function() {
        $S.setSkipValuesFromPosixResult([""]);
        Model.extend({"createPosixTree": $S.createPosixTree});
    }
});
Model.$S = $S;
/*End of direct access of methods*/
window.Model = window.$M = Model;
})(window, $S);
