(function(window, $S, $VC){
var View = function(selector, context) {
    return new View.fn.init(selector, context);
};
View.fn = View.prototype = {
    constructor: View,
    init: function(selector, context) {
        if (typeof selector === "string") {
            this.selector = selector;
        }
        return this;
    }
};
View.fn.init.prototype = View.fn;
View.extend = View.fn.extend = function(options) {
    if ($S.isObject(options)) {
        for (var key in options) {
            if ($S.isFunction(options[key])) {
                /*If method already exist then it will be overwritten*/
                if ($S.isFunction(this[key])) {
                    console.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
View.extend({
    documentLoaded: function(callBack) {
        $VC.documentLoaded(callBack);
    },
    setValues: function(name, value) {
        return $VC.setValues(name, value);
    },
    isCrossingEnable: function(name) {
        return $VC.isCrossingEnable(name);
    }
});
View.extend({
    getRouteDisplayHtml: function(name) {
        return $VC.getRouteDisplayHtml(name);
    },
    getTableHtml: function(name, tableAttr) {
        return $VC.getTableHtml(name, tableAttr);
    },
    getPossibleValues: function() {
        return $VC.getPossibleValues();
    },
    getTprClass: function(name) {
        var red = $VC.getTprClass(name);
        return red;
    },
    getHrClass: function(exp, name) {
        return $VC.getHrClass(exp, name);
    }
});

window.View = window.$V = View;
})(window, $S, $VC);
