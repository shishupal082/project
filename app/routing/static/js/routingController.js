(function(window, $M, $RM) {
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

// Can programmed
// NWLR/RWLR (with WFK) (3)
// NCR,RCR,WNKR,WRKR,NWKR,RWKR (6)
// ASWR (1)
// Can be programmed with partially (i.e. set of NRR required as input)
// NLR,RLR (2)
// WNR (1)
/**
CWKR, OWKR  --
WCKR, WOKR  --
CWLR, OWLR  --
CLR, OLR    --
CCR, OCR    --
ASWR        --
WFR         --
WNR
**/
var addExpression = {
    "CLR": function(pName, requiredInClose, requiredInOpen) {
        var val = [];
        var requiredInCloseVal = [];
        if (requiredInClose && requiredInClose.length) {
            for (var i = 0; i < requiredInClose.length; i++) {
                requiredInCloseVal.push("(~"+requiredInClose[i]+"-NNR&&"+requiredInClose[i]+"-NRR)");
            }
        }
        val.push({"op":"||", "val": requiredInCloseVal});
        if (requiredInOpen && requiredInOpen.length) {
            for (var i = 0; i < requiredInOpen.length; i++) {
                val.push("~"+requiredInOpen[i]+"-NRR");
            }
        }
        val.push("(~"+pName+"-CWKR&&~"+pName+"-OLR)");
        var e1 = {
            "op": "&&",
            "val": val
        };
        var exp = $M.generateExpression(e1);
        $M(pName+"-CLR").addExp(exp);
    },
    "OLR": function(pName, requiredInOpen, requiredInClose) {
        var val = [], requiredInOpenVal = [];
        if (requiredInOpen && requiredInOpen.length) {
            for (var i = 0; i < requiredInOpen.length; i++) {
                requiredInOpenVal.push("(~"+requiredInOpen[i]+"-NNR&&"+requiredInOpen[i]+"-NRR)");
            }
        }
        val.push({"op":"||", "val": requiredInOpenVal});
        if (requiredInClose && requiredInClose.length) {
            for (var i = 0; i < requiredInClose.length; i++) {
                val.push("~"+requiredInClose[i]+"-NRR");
            }
        }
        val.push("(~"+pName+"-OWKR&&~"+pName+"-CLR)");
        var e1 = {
            "op": "&&",
            "val": val
        };
        var exp = $M.generateExpression(e1);
        $M(pName+"-OLR").addExp(exp);
    }
};
function setValueFromPointName(pName) {
    var options = {
        "U1-12-25": {
            requiredInClose: ["1D-E2-U1-25","1D-E2-U2-25"],
            requiredInOpen: ["1D-E2-U1-26","1D-E2-U2-26"]
        },
        "U1-12-26": {
            requiredInClose: ["1D-E2-U1-26","1D-E2-U2-26"],
            requiredInOpen: ["1D-E2-U1-25","1D-E2-U2-25"]
        },
        "U2-19-13" : {
            requiredInClose: ["1D-E1-U1"],
            requiredInOpen: ["1D-E1-U2"]
        },
        "U2-19-14" : {
            requiredInClose: ["1D-E1-U2"],
            requiredInOpen: ["1D-E1-U1"]
        },
        "U2-25-13": {
            requiredInClose: ["1D-E2-U1-25"],
            requiredInOpen: ["1D-E2-U2-25", "1D-E1-U1"]
        },
        "U2-26-13": {
            requiredInClose: ["1D-E2-U1-26"],
            requiredInOpen: ["1D-E2-U2-26", "1D-E1-U1"]
        },
        "U2-25-14": {
            requiredInClose: ["1D-E2-U2-25"],
            requiredInOpen: ["1D-E2-U1-25", "1D-E1-U2"]
        },
        "U2-26-14": {
            requiredInClose: ["1D-E2-U2-26"],
            requiredInOpen: ["1D-E2-U1-25", "1D-E1-U2"]
        }
    };
    if (options[pName]) {
        addExpression["CLR"](pName, options[pName].requiredInClose, options[pName].requiredInOpen);
        addExpression["OLR"](pName, options[pName].requiredInOpen, options[pName].requiredInClose);
    }
}



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
        allExpressions.push($RM.getExpressionsLocal());
        allExpressions.push($RM.getPointExpressions());
        possibleValues = possibleValues.concat($RM.getPossibleValuesLocal());
        Object.assign(currentValues, $RM.getCurrentValuesLocal());
        $RM.getCurrentValues(function(res) {
            Object.assign(currentValues, res);
            currentValuesLoaded = true;
            apiDataLoaded(callBack);
        });
        $RM.getPossibleValues(function(res) {
            possibleValues = possibleValues.concat(res);
            pointPossibleValueLoaded = true;
            apiDataLoaded(callBack);
        });
        
        $RM.getExpressions(function(res) {
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
                if (["CLR"].indexOf(pVariable) >= 0) {
                    setValueFromPointName(pName);
                }
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

var pointLockExp = {};
var tableContent = [];

var Controller = function(selector, context) {
    return new Controller.fn.init(selector, context);
};
/*
Direct access by id: $C("id").get()
*/

function isFunction(value) {
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
}
Controller.fn = Controller.prototype = {
    constructor: Controller,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.signalNum = selector;
        }
        if (selector === "string" && context === "signal") {
            this.signalNum = selector;
        }
        return this;
    }
};
Controller.fn.init.prototype = Controller.fn;
/*
End of direct access of ID
*/
/*Direct access of methods: $C.methodName*/
Controller.extend = Controller.fn.extend = function(options) {
    if (isObject(options)) {
        for (var key in options) {
            if (isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if (isFunction(this[key])) {
                    console.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
Controller.extend({
    getPossibleValues: function() {
        return $M.getPossibleValues();
    },
    setValues: function(name, value) {
        $M.setValue(name, value);
        return $M(name).get();
    },
    getTableHtml: function(name, tableAttr) {
        var tableContent = $M.getTableContent(name);
        var table = $M.getTable(tableContent);
        return table.getHtml(tableAttr);
    },
    documentLoaded: function(callBack) {
        pointLockExp = $RM.getPointLockExpressions();
        $M.documentLoaded(function() {
            var allExp = $M.getExps();
            Object.assign(pointLockExp, allExp.exps);
            if (callBack) {
                callBack();
            }
            
        });
        return 0;
    }
});
Controller.extend({
    getSignalClass: function(name, aspect) {
        var signalClass = {};
        signalClass["red"] = "badge signal-red alert-danger";
        signalClass["yellow"] = "badge signal-yellow alert-warning";
        signalClass["top-yellow"] = "badge signal-yellow alert-warning";
        signalClass["green"] = "badge signal-green alert-success";
        var possibleAspect = ["red", "yellow", "green"];
        if ($M.isUp(name) && possibleAspect.indexOf(aspect) >=0) {
            return signalClass[aspect];
        } else {
            return "badge signal-" + aspect;
        }
    },
    getRouteDisplayHtml: function(name) {
        var routeItem = $M.getRouteDisplayFromYardComponentModel(name);
        var result = '<table><tr>';
        for (var i = 0; i < routeItem.length; i++) {
            result += '<td><div><button '+routeItem[i].attr+' class="evt btn e-u">';
            result += routeItem[i].name;
            result += '</button></div>';
            if (routeItem[i].routeReleaseBtn) {
                result += '<div><button id="'+routeItem[i].name+'-NRR" '+routeItem[i].routeReleaseBtn.attr+' class="evt btn nrr">Release route</button></div>';
            } else {
                result += '<div>&nbsp;</div>';
            }
            result += '</td>';
        }
        return result + '</tr></table>';
    },
    isCrossingEnable: function(name) {
        var exps = {
            "1D-2-8": ["(U2-19-14-CWKR&&(U2-25-13-CWKR||U2-26-13-CWKR))"]
        };
        var statue = false;
        if (exps[name]) {
            if ($M.isExpressionTrue(exps[name][0])) {
                statue = true;
            }
        }
        return statue;
    },
    getTprClass: function(tprName) {
        var exp, isLock = false, exps = [];
        if (pointLockExp[tprName]) {
            exp = pointLockExp[tprName];
            isLock = $M.isAllExpressionsTrue(exp);
        }
        return isLock ? "btn-warning": "";
    },
    getHrClass: function(exp, name) {
        if ($M.isExpressionTrue(exp)) {
            return "btn-success";
        }
        return "";
    }
});
Controller.$M = $M;
/*End of direct access of methods*/
window.Controller = window.$VC = Controller;
})(window, $M, $RM);
