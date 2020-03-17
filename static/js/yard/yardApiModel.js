/*
    - Load possibleValue, initialValue and expressions from api
        - It do not care about rendering yardHtml using yard api data
    - Set these values to model ($M)
    - loadJsonData for given api url
*/

(function(window, $M) {

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

var PossibleValues = [];
var InitialValues = {};
var AllExpressions = [];

var PossibleValuesLoadStatus = false;
var InitialValuesLoadStatus = false;
var ExpressionsLoadStatus = false;

var PossibleValuePath = [];
var InitialValuePath = [];
var ExpressionsPath = [];

var PossibleValuesByTypes = {};

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
    YardApiModel.loadJsonData(url, function(response) {
        if ($M.isObject(response)) {
            for (var key in response) {
                if ($M.isArray(response[key])) {
                    for (var i = 0; i < response[key].length; i++) {
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
            $M.log("Invalid response (possibleValue):" + response);
        }
    }, callBack);
}
function loadInitialValues(callBack) {
    var url = [];
    for (var i = 0; i < InitialValuePath.length; i++) {
        url.push(InitialValuePath[i]+"?"+RequestId);
    }
    YardApiModel.loadJsonData(url, function(response) {
        if ($M.isObject(response)) {
            Object.assign(InitialValues, response);
        } else {
            $M.log("Invalid response (initialValue):" + response);
        }
    }, callBack);
}
function loadExpressions(callBack) {
    var url = [];
    for (var i = 0; i < ExpressionsPath.length; i++) {
        url.push(ExpressionsPath[i]+"?"+RequestId);
    }
    YardApiModel.loadJsonData(url, function(response) {
        if ($M.isObject(response)) {
            AllExpressions.push(response);
        } else {
            $M.log("Invalid response (expression):" + response);
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
YardApiModel.extend({
    loadJsonData: function(urls, eachApiCallback, callBack, apiName) {
        if ($M.isArray(urls) == false || urls.length < 1) {
            if ($M.isFunction(eachApiCallback)) {
                eachApiCallback(null, apiName);
            }
            if ($M.isFunction(callBack)) {
                callBack();
            }
            return false;
        }
        var apiSendCount = urls.length, apiReceiveCount = 0;
        for (var i = 0; i < urls.length; i++) {
            var ajax = {};
            ajax.type = "json";
            ajax.dataType = "json";
            ajax.url = urls[i];
            $.ajax({url: ajax.url,
                success: function(response, textStatus) {
                    apiReceiveCount++;
                    if ($M.isFunction(eachApiCallback)) {
                        eachApiCallback(response, apiName);
                    }
                    if (apiSendCount == apiReceiveCount) {
                        if ($M.isFunction(callBack)) {
                            callBack();
                        }
                    }
                },
                error: function(xhr, textStatus, errorThrown) {
                    console.log("Error in api: " + apiName);
                    apiReceiveCount++;
                    if ($M.isFunction(eachApiCallback)) {
                        eachApiCallback(null, apiName);
                    }
                    if (apiSendCount == apiReceiveCount) {
                        if ($M.isFunction(callBack)) {
                            callBack();
                        }
                    }
                }
            });
        }
        return true;
    },
    documentLoaded: function(callBack) {
        loadPossibleValues(function() {
            PossibleValuesLoadStatus = true;
            $M().setPossibleValues(PossibleValues);
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
            }
        }
        return 1;
    }
});
window.YardApiModel = window.$YApiModel = YardApiModel;
})(window, $M);
