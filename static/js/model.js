(function(window, $S) {

var loopCount = 0, setValueCount = 0, setValueCountLimit = 400;
var possibleValues = [];
var ignoreRecheckPossibleValues = [];
var reCheckingStatus = true;
var verifyExpression = false;
var currentValues = {};
var exps = {};
var debug = [];
var valueToBeChecked = [];
var processingCount = {};
var variableDependencies = {};
var Model = function(selector, context) {
    return new Model.fn.init(selector, context);
};
function setValueTobeChecked() {
    valueToBeChecked = [];
    for (var i = 0; i < possibleValues.length; i++) {
        if (ignoreRecheckPossibleValues.indexOf(possibleValues[i]) >= 0) {
            continue;
        } else {
            valueToBeChecked.push(possibleValues[i]);
        }
    }
    return valueToBeChecked;
}
function increaseProcessingCount(name) {
    if (processingCount[name]) {
        processingCount[name]++;
    } else {
        processingCount[name] = 1;
    }
    return name;
}
var setValue = (function() {
    var isValueChanged = false;
    function set(key, value) {
        isValueChanged = false;
        if (Model.isValidKey(key) && Model.isValidValue(value)) {
            var oldValue = Model(key).get();
            currentValues[key] = value*1;
            var newValue = Model(key).get();
            if (oldValue != newValue) {
                setValueCount++;
                $S.log(setValueCount + ": set " + key + " value change from " + oldValue + " to " + newValue);
                isValueChanged = true;
            }
        }
        return isValueChanged;
    }
    set.prototype.isValueChanged = function() {
        return isValueChanged;
    };
    return set;
})();
function isFunction(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
function isArray(value) {
    if (typeof value == "undefined") {
        return false;
    }
    return (typeof value == "object" && !isNaN(value.length)) ? true : false;
}
function isValidValue(value) {
    if (isNaN(value) || [0,1].indexOf(value*1) < 0) {
        return false;
    }
    return true;
}
function isValidKey(key) {
    return possibleValues.indexOf(key) >=0 ? true : false;
}
function isBooleanTrue(value) {
    if (typeof value == "boolean") {
        return value == true;
    }
    return false;
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
        if (isObject(extCurrentValues)) {
            for (var key in extCurrentValues) {
                currentValues[key] = extCurrentValues[key];
            }
        }
        return currentValues;
    },
    setPossibleValues: function(extPossibleValues) {
        if (isArray(extPossibleValues)) {
            possibleValues = [];
            for (var i = 0; i < extPossibleValues.length; i++) {
                possibleValues.push(extPossibleValues[i]);
            }
        }
        setValueTobeChecked();
        return possibleValues;
    },
    setVariableDependencies: function(varDependencies) {
        if (isObject(varDependencies)) {
            variableDependencies = {};
            for (var key in varDependencies) {
                variableDependencies[key] = varDependencies[key];
            }
        }
        return variableDependencies;
    },
    updateVariableDependencies: function(name, dependencies) {
        if (isArray(dependencies)) {
            variableDependencies[name] = dependencies;
        }
        return variableDependencies;
    },
    setIgnoreRecheckPossibleValues: function(extIgnoreRecheckPossibleValues) {
        if (isArray(extIgnoreRecheckPossibleValues)) {
            ignoreRecheckPossibleValues = [];
            for (var i = 0; i < extIgnoreRecheckPossibleValues.length; i++) {
                ignoreRecheckPossibleValues.push(extIgnoreRecheckPossibleValues[i]);
            }
        }
        setValueTobeChecked();
        return ignoreRecheckPossibleValues;
    },
    addDebug: function() {
        if (isValidKey(this.key)) {
            debug.push(this.key);
        } else {
            $S.log("Invalid key for debug:" + this.key);
        }
        return 0;
    }
};
Model.fn.init.prototype = Model.fn;
/*
End of direct access of ID
*/
/*Direct access of methods: $M.methodName*/
Model.extend = Model.fn.extend = function(options) {
    if (isObject(options)) {
        for (var key in options) {
            if (isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if (isFunction(this[key])) {
                    $S.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
Model.extend({
    getStack: function(shareStorage) {
        return $S.getStack(shareStorage);
    },
    getLocalStorage: function() {
        return $S.getLocalStorage();
    },
    getTable: function(tableContent) {
        return $S.getTable(tableContent);
    },
    getDT: function() {
        return $S.getDT();
    },
    setLoggerDateTimeState: function(state,formats,splitter) {
        return $S.setLoggerDateTimeState(state,formats,splitter);
    },
    enableVerifyExpression: function() {
        verifyExpression = true;
        return verifyExpression;
    },
    disableVerifyExpression: function() {
        verifyExpression = false;
        return verifyExpression;
    },
    enableReChecking: function() {
        reCheckingStatus = true;
        return reCheckingStatus;
    },
    disableReChecking: function() {
        reCheckingStatus = false;
        return reCheckingStatus;
    },
    resetSetValueCount: function(newLimit) {
        setValueCount = 0;
        return 1;
    },
    changeSetValueCountLimit: function(newLimit) {
        if(isNaN(newLimit)) {
            $S.log("Invalid newLimit:" + newLimit);
            return 0;
        }
        setValueCountLimit = newLimit*1;
        return 1;
    }
});
Model.extend({
    isValidValue: function(value) {
        return isValidValue(value);
    },
    isValidKey: function(key) {
        return isValidKey(key);
    },
    isArray: function(value) {
        return isArray(value);
    },
    isObject: function(value) {
        return isObject(value);
    },
    isFunction: function(value) {
        return isFunction(value);
    },
    isMethodDefined: function(name) {
        return this.isFunction(this[name]);
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
        var response = [];
        for (var i = 0; i < possibleValues.length; i++) {
            response.push(possibleValues[i]);
        }
        return response;
    },
    getValueToBeChecked : function() {
        var response = [];
        for (var i = 0; i < valueToBeChecked.length; i++) {
            response.push(valueToBeChecked[i]);
        }
        return response;
    },
    getReCheckingStatus: function() {
        return reCheckingStatus;
    },
    getVerifyExpressionStatus: function() {
        return verifyExpression;
    },
    getProcessingCount: function() {
        var response = {total: 0, itemsCount: 0, processingCount: {}};
        for (var key in processingCount) {
            response.itemsCount++;
            response.total += processingCount[key];
            response.processingCount[key] = processingCount[key];
        }
        return response;
    },
    getVariableDependencies: function(name) {
        var response = {count: 0, dependencies: {}};
        if (name) {
            if (isArray(variableDependencies[name])) {
                response.count++;
                response.dependencies[name] = variableDependencies[name];
            }
        } else {
            for (var key in variableDependencies) {
                response.count++;
                response.dependencies[key] = variableDependencies[key];
            }
        }
        return response;
    },
    getIgnorePossibleValues : function() {
        var response = [];
        for (var i = 0; i < ignoreRecheckPossibleValues.length; i++) {
            response.push(ignoreRecheckPossibleValues[i]);
        }
        return response;
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
        if (isArray(keys) && keys.length > 0) {
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
        if (isArray(keys) && keys.length > 0) {
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
                Model.reCheckAllValues();
            }
        }
        return 0;
    }
});
Model.extend({
    reCheckAllValuesV2: function(stack) {
        if (reCheckingStatus == false) {
            return 0;
        }
        while(stack.getTop() >= 0) {
            var name = stack.pop();
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
            $S.log("DEBUG: " + name);
        }
        if (exp && exp.length) {
            for (var i = 0; i < exp.length; i++) {
                if (Model.isExpressionTrue(name, exp[i])) {
                    newValue = 1;
                    continue;
                } else {
                    newValue = 0;
                    break;
                }
            }
        }
        if (debug.indexOf(name) >=0) {
            $S.log(name + ", oldValue=" + oldValue + ", newValue=" + newValue);
        }
        Model.setValue(name, newValue);
        return newValue;
    },
    getTokenizedExp: function(exp) {
        var tokenizedExp = $S.tokenize(exp, ["(",")","&&","||"]);
        return tokenizedExp;
    },
    isExpressionTrue: function(name, exp) {
        var tokenizedExp = this.getTokenizedExp(exp);
        var posix = $S.createPosixTree(tokenizedExp);
        var posixVal = [];
        if (posix.length) {
            for (var i = 0; i < posix.length; i++) {
                var itemArr = posix[i].split(":");
                posixVal.push(posix[i]);
                if (itemArr.length == 2) {
                    posixVal[i] = Model.is(itemArr[0], itemArr[1]);
                }
            }
        }
        var result = $S.calBinary(posixVal);
        if (debug.indexOf(name) >=0) {
            console.log(exp);
            console.log(posix);
            console.log(posixVal);
            console.log(result);
        }
        /** Expression validation start **/
        if (verifyExpression) {
            var isValidExpression = true;
            for (var i = 0; i < posixVal.length; i++) {
                if ([true, false, "&&", "||"].indexOf(posixVal[i]) >= 0) {
                    continue;
                } else {
                    isValidExpression = false;
                    $S.log(name + ": invalid posixVal: " + posixVal[i]);
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
                $S.log(name + ": invalid expression: " + exp);
            }
            if (isValidExpression == false) {
                throw name + ": invalid expression:" + exp;
            }
        }
        /** Expression validation End **/
        return result;
    }
});
Model.$S = $S;
/*End of direct access of methods*/
window.Model = window.$M = Model;
})(window, $S);
