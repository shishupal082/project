(function(window, $M) {

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
        pointLockExp = $M.getPointLockExpressionsFromPointComponentModel();
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
})(window, $M);
