(function(window, $M, $YM) {

var Controller = function(selector, context) {
    return new Controller.fn.init(selector, context);
};

Controller.fn = Controller.prototype = {
    constructor: Controller,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};

ExtendObject(Controller);

var RequestId = $M.getRequestId();

var PossibleValues = [];
var AllExpressions = [];
var CurrentValues = {};

var PossibleValuesLoadStatus = false;
var ExpressionsLoadStatus = false;
var CurrentValuesLoadStatus = false;

function isApisLoadComplete() {
    var loadingCheck = [];
    loadingCheck.push(PossibleValuesLoadStatus);
    loadingCheck.push(CurrentValuesLoadStatus);
    loadingCheck.push(ExpressionsLoadStatus);
    for (var i = 0; i < loadingCheck.length; i++) {
        if (loadingCheck[i] == false) {
            return false;
        }
    }
    return true;
}

Controller.extend({
    loadPossibleValues: function(callBack) {
        var url = ["/app/yard-s14/static/json/items.json?"+RequestId];
        $YM.loadJsonData(url, function(response) {
            if ($M.isObject(response)) {
                for (var key in response) {
                    if ($M.isArray(response[key])) {
                        for (var i = 0; i < response[key].length; i++) {
                            if ($M.isString(response[key][i])) {
                                if (PossibleValues.indexOf(response[key][i]) >= 0) {
                                    throw "Duplicate entry PossibleValues: " + response[key][i];
                                } else {
                                    PossibleValues.push(response[key][i]);
                                }
                            }
                        }
                    }
                }
            }
        }, callBack);
    },
    loadCurrentValues: function(callBack) {
        var url = ["/app/yard-s14/static/json/currentValues.json?"+RequestId];
        $YM.loadJsonData(url, function(response) {
            if ($M.isObject(response)) {
                Object.assign(CurrentValues, response);
            }
        }, callBack);
    },
    loadExpressions: function(callBack) {
        var url = ["/app/yard-s14/static/json/expressions.json?"+RequestId];
        $YM.loadJsonData(url, function(response) {
            if ($M.isObject(response)) {
                AllExpressions.push(response);
            }
        }, function() {
            var allExpressions = AllExpressions;
            for (var i = 0; i < allExpressions.length; i++) {
                exps = allExpressions[i];
                for (var key in exps) {
                    if ($M.isArray(exps[key])) {
                        for (var j = 0; j < exps[key].length; j++) {
                            if ($M.isObject(exps[key][j])) {
                                $M(key).addExp($M.generateExpression(exps[key][j]));
                            } else {
                                $M(key).addExp(exps[key][j]);
                            }
                        }
                    } else if ($M.isObject(exps[key])) {
                        $M(key).addExp($M.generateExpression(exps[key]));
                    }
                }
            }
            callBack();
        });
    }
});
Controller.extend({
    documentLoaded: function(callBack) {
        Controller.loadPossibleValues(function() {
            PossibleValuesLoadStatus = true;
            $M().setPossibleValues(PossibleValues);
            if (isApisLoadComplete()) {
                callBack();
            }
        });
        Controller.loadCurrentValues(function() {
            CurrentValuesLoadStatus = true;
            $M().initializeCurrentValues(CurrentValues);
            if (isApisLoadComplete()) {
                callBack();
            }
        });
        Controller.loadExpressions(function() {
            ExpressionsLoadStatus = true;
            if (isApisLoadComplete()) {
                callBack();
            }
        });
    }
});

/*End of direct access of methods*/
window.Controller = window.$C = Controller;
})(window, $M, $YM);
