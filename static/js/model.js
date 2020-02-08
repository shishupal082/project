(function(window, $S) {

var loopCount = 0, setValueCount = 0, setValueCountLimit = 400;
var possibleValues = [];
var reCheckingStatus = true;
var verifyExpression = false;
var currentValues = {};
var exps = {};
var debug = [];
var valueToBeChecked = [];
var processingCount = {};
var variableDependencies = {};
var binaryOperators = ["&&","||"];
var binaryOperatorIncludingBracket = ["(",")","&&","||"];
var binaryOperatorIncludingValue = [true,false,"&&","||"];
var MStack = $S.getStack();
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
function getVariableDependencies(name) {
    var dependentVariable = [];
    if (variableDependencies[name]) {
        dependentVariable = variableDependencies[name];
    }
    return dependentVariable;
}
function setVariableDependencies (name1, name2) {
    if ($M.isArray(variableDependencies[name1])) {
        if (variableDependencies[name1].indexOf(name2) < 0) {
            variableDependencies[name1].push(name2);
        }
    } else {
        variableDependencies[name1] = [name2];
    }
    if ($M.isArray(variableDependencies[name2])){
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
function isBoolean(value) {
    if (typeof value == "boolean") {
        return true;
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
        setValueTobeChecked(possibleValues);
        return possibleValues;
    },
    setValueTobeChecked: function(values) {
        if (isArray(values)) {
            setValueTobeChecked(values);
        }
        return valueToBeChecked;
    },
    setBinaryOperators: function(opr) {
        var operators = [];
        if (isArray(opr)) {
            for (var i = 0; i < opr.length; i++) {
                if (["&&","&","||","|","#"].indexOf(opr[i]) >= 0) {
                    operators.push(opr);
                }
            }
        }
        binaryOperatorIncludingBracket = operators.concat(["(",")"]);
        binaryOperatorIncludingValue = operators.concat([true,false]);
        binaryOperators = operators;
        return binaryOperators;
    },
    addDebug: function() {
        if (isValidKey(this.key)) {
            if (debug.indexOf(this.key) < 0) {
                debug.push(this.key);
            }
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
    setVariableDependencies: function() {
        for (var expName in exps) {
            var expressions = exps[expName];
            var tokenizedExp = [];
            for (var i = 0; i < expressions.length; i++) {
                tokenizedExp = Model.getTokenizedExp(expressions[i]);
                if (tokenizedExp.length) {
                    for (var j = 0; j < tokenizedExp.length; j++) {
                        var itemArr = tokenizedExp[j].split(":");
                        if (itemArr.length == 2) {
                            setVariableDependencies(expName, itemArr[0])
                        }
                    }
                }
            }
        }
        return variableDependencies;
    },
    updateVariableDependencies: function(name, dependencies) {
        if (isValidKey(name) && isArray(dependencies)) {
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
    getTable: function(tableContent) {
        return $S.getTable(tableContent);
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
    getVariableDependencies: function(sortedResultRequired) {
        var bst = Model.getBST();
        var response = {sortedResult: {}, count: 0, dependencies: {}};
        for (var key in variableDependencies) {
            response.count++;
            response.dependencies[key] = variableDependencies[key];
        }
        if (isBoolean(sortedResultRequired) && sortedResultRequired) {
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
                Model.addInMStack(getVariableDependencies(key));
                Model.reCheckAllValuesV2();
            }
        }
        return 0;
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
            $S.log("DEBUG: " + name);
        }
        newValue = Model.isAllExpressionsTrue(name, exp) ? 1 : 0;
        if (debug.indexOf(name) >=0) {
            $S.log(name + ", oldValue=" + oldValue + ", newValue=" + newValue);
        }
        Model.setValue(name, newValue);
        return newValue;
    },
    getTokenizedExp: function(exp) {
        var tokenizedExp = $S.tokenize(exp, binaryOperatorIncludingBracket);
        return tokenizedExp;
    },
    getPosixValue: function(posixItem) {
        /*  posixItem can be following:
                "&&","&","||","|","#"
                "key:up","key:dn"
                "~key","key"
        */
        var status = posixItem;
        if (binaryOperators.indexOf(posixItem) >= 0) {
            return status;
        }
        var itemArr = posixItem.split(":");
        if (itemArr.length == 2) {
            status = Model.is(itemArr[0], itemArr[1]);
        } else {
            itemArr = posixItem.split("~");
            if (itemArr.length == 2) {
                status = Model.is(itemArr[1], "dn");
            } else {
                status = Model.is(itemArr[0], "up");
            }
        }
        return status;
    },
    isExpressionTrue: function(name, exp) {
        var tokenizedExp = Model.getTokenizedExp(exp);
        var posix = $S.createPosixTree(tokenizedExp);
        var posixVal = [];
        if (posix.length) {
            for (var i = 0; i < posix.length; i++) {
                posixVal.push(posix[i]);
                posixVal[i] = Model.getPosixValue(posix[i]);
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
                if (binaryOperatorIncludingValue.indexOf(posixVal[i]) >= 0) {
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
Model.extend({
    isAllExpressionsTrue: function(name, exps) {
        var status = false, exp = "";
        if (isArray(exps)) {
            for (var i = 0; i < exps.length; i++) {
                exp = exps[i];
                if (isObject(exp)) {
                    exp = Model.generateExpression(exp);
                }
                if (Model.isExpressionTrue(name, exp)) {
                    status = true;
                    continue;
                } else {
                    status = false;
                    break;
                }
            }
        } else if (isObject(exps)) { 
            status = Model.isAllExpressionsTrue(name, [exps]);
        }
        return status;
    },
});
Model.$S = $S;
/*End of direct access of methods*/
window.Model = window.$M = Model;
})(window, $S);
