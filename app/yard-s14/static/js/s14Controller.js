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
var InitialValues = {};
var AllExpressions = [];

var PossibleValuesLoadStatus = false;
var InitialValuesLoadStatus = false;
var ExpressionsLoadStatus = false;

var PossibleValuePath = [];
var InitialValuePath = [];
var ExpressionsPath = [];

var TprNames = [];
var SignalNames = [];
var PointIndicationNames = [];

function isApisLoadComplete() {
    var loadingCheck = [];
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

function loadPossibleValues(callBack) {
    var url = [];
    for (var i = 0; i < PossibleValuePath.length; i++) {
        url.push(PossibleValuePath[i]+"?"+RequestId);
    }
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
                    switch(key) {
                        case "tpr":
                            TprNames = TprNames.concat(response[key]);
                        break;
                        case "signal":
                            SignalNames = SignalNames.concat(response[key]);
                        break;
                        case "pointIndication":
                            PointIndicationNames = PointIndicationNames.concat(response[key]);
                        break;
                    }
                }
            }
        }
    }, callBack);
}
function loadInitialValues(callBack) {
    var url = [];
    for (var i = 0; i < InitialValuePath.length; i++) {
        url.push(InitialValuePath[i]+"?"+RequestId);
    }
    $YM.loadJsonData(url, function(response) {
        if ($M.isObject(response)) {
            Object.assign(InitialValues, response);
        }
    }, callBack);
}
function loadExpressions(callBack) {
    var url = [];
    for (var i = 0; i < ExpressionsPath.length; i++) {
        url.push(ExpressionsPath[i]+"?"+RequestId);
    }
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
Controller.extend({
    documentLoaded: function(callBack) {
        loadPossibleValues(function() {
            PossibleValuesLoadStatus = true;
            $M().setPossibleValues(PossibleValues);
            loadExpressions(function() {
                ExpressionsLoadStatus = true;
                if (isApisLoadComplete()) {
                    callBack();
                }
            });
        });
        loadInitialValues(function() {
            InitialValuesLoadStatus = true;
            $M().initializeCurrentValues(InitialValues);
            if (isApisLoadComplete()) {
                callBack();
            }
        });
    }
});

Controller.extend({
    getTprNames: function() {
        return TprNames;
    },
    getSignalNames: function() {
        return SignalNames;
    },
    getPointIndicationNames: function() {
        return PointIndicationNames;
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
            }
        }
        return 1;
    }
});
/*End of direct access of methods*/
window.Controller = window.$C = Controller;
})(window, $M, $YM);
