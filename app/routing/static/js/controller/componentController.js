(function(window, $M) {
var pointPossibleValueLoaded = false;
var pointExpressionLoaded = false;
var currentValuesLoaded = false;
var possibleValues = [];
var allExpressions = [];
var currentValues = {};
var useMethod1ForRechecking = false;

// $M.changeSetValueCountLimit(800);
// $M.setCreatePosixTreeMethodWithFilter();
$M.enableProcessingCount();

function apiDataLoaded(callBack) {
    var loadingCheck = [];
    loadingCheck.push(pointPossibleValueLoaded);
    loadingCheck.push(pointExpressionLoaded);
    loadingCheck.push(currentValuesLoaded);
    for (var i = 0; i < loadingCheck.length; i++) {
        if (loadingCheck[i] == false) {
            return 0;
        }
    }
    $M().setPossibleValues(possibleValues);
    $M().initializeCurrentValues(currentValues);
    var exps = {};
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
    // $M("1D-E1-UCR").addDebug();
    // $M("U2-19-13-CWLR").addDebug();
    $M.generatePossibleExpression();
    if (useMethod1ForRechecking) {
        $M.reCheckAllValues();
    } else {
        $M.setVariableDependencies(); //read from exps and calculate dependent values
        $M.updateVariableDependencies("CWWNR", []);
        $M.updateVariableDependencies("OWWNR", []);
        $M.addInMStack($M.getPossibleValues());
        $M.reCheckAllValuesV2();
    }
    if (callBack) {
        callBack();
    }
    return 1;
}
$M.extend({
    documentLoaded: function(callBack) {
        allExpressions.push($M.getExpressionsFromRouteComponentModel());
        allExpressions.push($M.getPointExpressionsFromPointComponentModel());
        possibleValues = possibleValues.concat($M.getPossibleValuesFromRouteComponentModel());
        Object.assign(currentValues, $M.getCurrentValuesFromRouteComponentModel());
        $M.getCurrentValuesFromRouteComponentModelFromApi(function(res) {
            Object.assign(currentValues, res);
            currentValuesLoaded = true;
            apiDataLoaded(callBack);
        });
        $M.getPossibleValuesFromPointComponentModel(function(res) {
            possibleValues = possibleValues.concat(res);
            pointPossibleValueLoaded = true;
            apiDataLoaded(callBack);
        });
        
        $M.getExpressionsFromPointComponentModel(function(res) {
            allExpressions.push(res);
            pointExpressionLoaded = true;
            apiDataLoaded(callBack);
        });
        return 0;
    },
    generatePossibleExpression: function() {
        var possibleValues = $M.getPossibleValues();
        for (var i = 0; i < possibleValues.length; i++) {
            var name = possibleValues[i];
            if ($M.isExpDefined(name)) {
                continue;
            } else if ($M.isMethodDefined(name)) {
                $M[name](name);
            } else if ($M.isFunction($M["setValueDefaultMethod"])) {
                $M["setValueDefaultMethod"](name);
            }
        }
    },
    "setValueDefaultMethod": function(name) {
        var pointVariables = ["OWKR","CWKR","WOKR","WCKR","CWLR","OWLR",
                                "CLR","OLR","CCR","OCR","ASWR","WFR","WNR"];
        var nameArr = name.split("-");
        var pNameArr = [], pName = "", pVariable = "";
        if (nameArr.length > 2) {
            for (var i = 0; i < nameArr.length-1; i++) {
                pNameArr.push(nameArr[i]);
            }
            pName = pNameArr.join("-");
            pVariable = nameArr[nameArr.length-1];
            if (pointVariables.indexOf(pVariable) >= 0) {
                $M.setPointVariables(pName, pVariable);
            }
        }
    },
    "processingCallBack1": function(name, count) {
        console.log(name + " : " + count);
    },
    "setValueChangedCallback1": function(name, oldValue, newValue) {
        if (useMethod1ForRechecking) {
            $M.reCheckAllValues();
        } else {
            $M.addInMStack($M.getVariableDependenciesByKey(name));
            $M.reCheckAllValuesV2();
        }
    }
});
})(window, $M);
