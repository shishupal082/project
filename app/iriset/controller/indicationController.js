(function(window, $M) {

// tprName+pointPosition

var defaultTprClass = {
    "8-TPR-A-8-NWKR": "", "8-TPR-A-8-RWKR": "",
    "8-TPR-1-8-NWKR": "btn-warning", "8-TPR-1-8-RWKR": "",
    "8-TPR-2-8-NWKR": "btn-warning", "8-TPR-2-8-RWKR": "",
    "8-TPR-3-8-NWKR": "btn-warning", "8-TPR-3-8-RWKR": "btn-warning",
    "8-TPR-B-8-NWKR": "", "8-TPR-B-8-RWKR": "",
    "8-TPR-4-8-NWKR": "", "8-TPR-4-8-RWKR": "",
    "8-TPR-5-8-NWKR": "", "8-TPR-5-8-RWKR": "btn-warning",
    "8-TPR-6-8-NWKR": "", "8-TPR-6-8-RWKR": "",
    "8-TPR-C-8-NWKR": "", "8-TPR-C-8-RWKR": "",
    "8-TPR-7-8-NWKR": "btn-warning", "8-TPR-7-8-RWKR": "btn-warning",
    "8-TPR-8-8-NWKR": "btn-warning", "8-TPR-8-8-RWKR": "",
    "8-TPR-9-8-NWKR": "btn-warning", "8-TPR-9-8-RWKR": "",
    "8-TPR-D-8-NWKR": "", "8-TPR-D-8-RWKR": ""
};


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
            this.key = selector;
        }
        return this;
    },
    getTprClass: function() {
        if (this.key && defaultTprClass[this.key]) {
            return defaultTprClass[this.key];
        }
        return "";
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
    isMethodDefined: function(name) {
        return this.isFunction(this[name]);
    },
    getDefaultTprClass: function(tprName, pointPosition) {
        var data = {};
        if (data[tprName + pointPosition]) {
            return data[tprName + pointPosition];
        }
        return "";
    }
});
/*End of direct access of methods*/
window.Controller = window.$IC = Controller;
})(window, $M);
