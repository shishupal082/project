(function(window) {

var possibleValues = [];

var availableGNRs = ["S1-GNR", "S2-GNR", "S3-GNR", "S4-GNR", "S13-GNR", "S14-GNR", "S15-GNR", "S16-GNR"];
var availableUNRs = ["LT-UNR", "MT-UNR", "8-UNR", "9-UNR", "4-UNR", "16-UNR"];

var availableNNRs = ["S1-MT-NNR", "S1-LT-NNR", "S2-NNR", "S3-NNR", "S4-NNR",
            "S13-MT-NNR", "S13-LT-NNR", "S14-NNR", "S15-NNR", "S16-NNR"];

var availableNRRs = ["S1-MT-NRR", "S1-LT-NRR", "S2-NRR", "S3-NRR", "S4-NRR",
            "S13-MT-NRR", "S13-LT-NRR", "S14-NRR", "S15-NRR", "S16-NRR"];

var availableASRs = ["1-ASR", "2/3-ASR", "4-ASR", "13-ASR", "14/15-ASR", "16-ASR"];
var availableTSRs = ["1/16-TSR", "2/3-TSR", "4/13-TSR", "14/15-TSR"];
//8-TPR / 9-TPR method defined for calculating all value of TPR for point 8
var availableTPRs = ["1-TPR", "16-TPR", "8-TPR",
                        "8-TPR-A","8-TPR-1","8-TPR-2","8-TPR-3","8-TPR-B",
                        "8-TPR-5",
                        "8-TPR-C", "8-TPR-7", "8-TPR-8", "8-TPR-9", "8-TPR-D",
                        "9-TPR",
                        "9-TPR-A","9-TPR-1","9-TPR-2","9-TPR-3","9-TPR-B",
                        "9-TPR-5",
                        "9-TPR-C", "9-TPR-7", "9-TPR-8", "9-TPR-9", "9-TPR-D",
                        "M-TPR", "M-TPR-1", "M-TPR-2", "M-TPR-3",
                        "L-TPR", "L-TPR-1", "L-TPR-2", "L-TPR-3", 
                        "4-TPR", "13-TPR"];

var point8Info = ["8-NWKR", "8-RWKR", "8-WNKR", "8-WRKR", "8-NWLR", "8-RWLR", "8-NLR", "8-RLR", "8-NCR", "8-RCR", "8-ASWR", "8-NWKR-request", "8-RWKR-request"];
var point9Info = ["9-NWKR", "9-RWKR", "9-WNKR", "9-WRKR", "9-NWLR", "9-RWLR", "9-NLR", "9-RLR", "9-NCR", "9-RCR", "9-ASWR", "9-NWKR-request", "9-RWKR-request"];
var miscs = [  "SMR",
                "S1-UCR", "S1-HR", "S1-DR", "S1-UGR",
                "S2-UCR", "S2-HR",
                "S3-UCR", "S3-HR", "S3-DR",
                "S4-UCR", "S4-HR",
                "S13-UCR", "S13-HR", "S13-DR", "S13-UGR",
                "S14-UCR", "S14-HR",
                "S15-UCR", "S15-HR", "S15-DR",
                "S16-UCR", "S16-HR"
                ];

possibleValues = possibleValues.concat(availableASRs);
possibleValues = possibleValues.concat(availableTSRs);
possibleValues = possibleValues.concat(availableNRRs);
possibleValues = possibleValues.concat(availableNNRs);
possibleValues = possibleValues.concat(availableTPRs);
possibleValues = possibleValues.concat(availableGNRs);
possibleValues = possibleValues.concat(availableUNRs);
possibleValues = possibleValues.concat(miscs);
possibleValues = possibleValues.concat(point8Info);
possibleValues = possibleValues.concat(point9Info);

var tprVsPointNumber = {
    "8-TPR-A": "8",
    "8-TPR-1": "8",
    "8-TPR-2": "8",
    "8-TPR-3": "8",
    "8-TPR-B": "8",
    "8-TPR-5": "8",
    "8-TPR-C": "8",
    "8-TPR-7": "8",
    "8-TPR-8": "8",
    "8-TPR-9": "8",
    "8-TPR-D": "8"
};

var currentValues = {  "SMR": 1,
                        "8-WNKR": 1,
                        "9-WNKR": 1,
                        "1-TPR": 1,
                        "16-TPR": 1,
                        "8-TPR": 1,
                        "8-TPR-A": 1,
                        "8-TPR-1": 1,
                        "8-TPR-2": 1,
                        "8-TPR-3": 1,
                        "8-TPR-B": 1,
                        "8-TPR-5": 1,
                        "8-TPR-C": 1,
                        "8-TPR-7": 1,
                        "8-TPR-8": 1,
                        "8-TPR-9": 1,
                        "8-TPR-D": 1,
                        "M-TPR": 1,
                        "M-TPR-1": 1,
                        "M-TPR-2": 1,
                        "M-TPR-3": 1,
                        "L-TPR": 1,
                        "L-TPR-1": 1,
                        "L-TPR-2": 1,
                        "L-TPR-3": 1,
                        "9A-TPR": 1,
                        "9A-TPR-1": 1,
                        "9B-TPR": 1,
                        "9B-TPR-1": 1,
                        "9-TPR": 1,
                        "4-TPR": 1,
                        "13-TPR": 1,
                        "1-ASR": 1,
                        "2/3-ASR": 1,
                        "4-ASR": 1,
                        "13-ASR": 1,
                        "14/15-ASR": 1,
                        "16-ASR": 1
                    };
var loopCount = 0, setValueCount = 0, setValue;
var Model = function(selector, context) {
    return new Model.fn.init(selector, context);
};
setValue = (function() {
    function set(key, value) {
        this._isValueChanged = false;
        if (Model.isValidKey(key) && Model.isValidValue(value)) {
            var oldValue = Model(key).get();
            currentValues[key] = value*1;
            var newValue = Model(key).get();
            if (oldValue != newValue) {
                setValueCount++;
                console.log(setValueCount + ": set " + key + " value change from " + oldValue + " to " + newValue);
                this._isValueChanged = true;
            }
        }
        return 0;
    }
    set.prototype.isValueChanged = function() {
        return this._isValueChanged;
    };
    return set;
})();
function isFunction(value) {
    return typeof value == "function" ? true : false;
}
function isObject(value) {
    return (typeof value == "object" && isNaN(value.length)) ? true : false;
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
function isArray(value) {
    return (typeof value == "object" && !isNaN(value.length)) ? true : false;
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
                    console.log("Method " + key + " is overwritten.");
                }
                this[key] = options[key];
            }
        }
    }
    return this;
};
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
    isFunction: function(value) {
        return isFunction(value);
    },
    isMethodDefined: function(name) {
        return this.isFunction(this[name]);
    }
});
Model.extend({
    getParameters : function(keys) {
        var possibleValuesObj = {
            availableASRs : availableASRs,
            availableTSRs : availableTSRs,
            availableNRRs : availableNRRs,
            availableNNRs : availableNNRs,
            availableTPRs : availableTPRs,
            availableGNRs : availableGNRs,
            availableUNRs : availableUNRs,
            miscs : miscs,
            point8Info : point8Info,
            point9Info : point9Info
        };
        if (possibleValuesObj[keys]) {
            return possibleValuesObj[keys];
        }
        return [];
    },
    getPointNumberForTpr : function(tprName) {
        if (tprName && tprVsPointNumber[tprName]) {
            return tprVsPointNumber[tprName];
        }
        return "0";
    },
    getPossibleValues : function() {
        return possibleValues;
    },
    getCurrentValues : function() {
        return currentValues;
    },
    isUp: function(key) {
        return Model(key).isUp();
    },
    isAllUp: function(keys) {
        if (isArray(keys) && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                if (Model(keys[i]).isDown()) {
                    return 0;
                }
            }
            return 1;
        }
        return 0;
    },
    getValue: function(key) {
        return Model(key).get();
    },
    setValue: function(key, value) {
        if (setValueCount > 400) {
            setValueCount++;
            console.log(setValueCount + ": Limit exceed.");
            return 0;
        }
        var set = new setValue(key, value);
        if (set.isValueChanged()) {
            Model.reCheckAllValues();
        }
        return 0;
    },
    isDown: function(key) {
        return Model(key).isDown();
    },
    isAllDown: function(keys) {
        if (isArray(keys) && keys.length > 0) {
            for (var i = 0; i < keys.length; i++) {
                if (Model(keys[i]).isUp()) {
                    return 0;
                }
            }
            return 1;
        }
        return 0;
    }
});
Model.extend({
    reCheckAllValues: function() {
        var valueToBeChecked = [];
        valueToBeChecked = possibleValues;
        for (var i = 0; i < valueToBeChecked.length; i++) {
            var name = valueToBeChecked[i];
            if (this.isMethodDefined(name)) {
                var modelNode = this(name);
                var oldValue = modelNode.get();
                this[name]();
                var newValue = modelNode.get();
                //To avoid further processing if value changed
                //Because it will already handle by setValue method
                if (oldValue != newValue) {
                    return 0;
                }
            }
        }
    }
});
/*End of direct access of methods*/
window.Model = window.$M = Model;
})(window);
