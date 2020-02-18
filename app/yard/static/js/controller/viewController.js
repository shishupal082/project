(function(window, $M) {

var tprLockExpression = {};

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
    toggleValues: function(name) {
        $M.toggleValue(name);
        return $M(name).get();
    },
    documentLoaded: function() {
        $M.documentLoaded();
        tprLockExpression = $M.getTprLockExpressionFromComponentModel();
        $M.reCheckAllValues();
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
        var returnSignalClass = "";
        if (possibleAspect.indexOf(aspect) >= 0) {
            if ($M.isUp(name)) {
                returnSignalClass = signalClass[aspect];
            } else {
                returnSignalClass = "badge signal-" + aspect;
            }
        } else {
            returnSignalClass = "badge signal-" + aspect;
        }
        return "signal " + returnSignalClass;
    },
    getTableHtml: function(tableId) {
        var tableContent = $M.getYardFromYardModel();
        var table = $M.getTable(tableContent, tableId);
        return table.getHtml();
    },
    getTprClass: function(tprName) {
        var exp, isLock = false;
        if ($M.isDown(tprName)) {
            return "btn-danger";
        }
        if (tprLockExpression[tprName]) {
            exp = tprLockExpression[tprName];
            if ($M.isObject(exp)) {
                exp = [$M.generateExpression(exp)];
            }
            if (exp && exp.length) {
                for (var i = 0; i < exp.length; i++) {
                    if ($M.isObject(exp[i])) {
                        exps[i] = $M.generateExpression(exps[i]);
                    }
                    if ($M.isExpressionTrue(name, exp[i])) {
                        isLock = true;
                        continue;
                    } else {
                        isLock = false;
                        break;
                    }
                }
            }
        }
        return isLock ? "btn-warning": "";
    },
    getIndicationClass: function(name) {
        if ($M(name).isUp()) {
            return "btn-warning";
        }
        return "";
    }
});

/*End of direct access of methods*/
window.Controller = window.$VC = Controller;
})(window, $M);