(function($M) {

var latestValueChanged0to1 = [];
var latestValueChanged1to0 = [];
$M.extend({
    setValueChangedCallback: function(key, oldValue, newValue) {
        if (oldValue == 0) {
            latestValueChanged0to1.push(key);
        }
        if (oldValue == 1) {
            latestValueChanged1to0.push(key);
        }
        $M.reCheckAllValues();
        return 0;
    }
});

var S17Model = function(selector, context) {
    return new S17Model.fn.init(selector, context);
};
S17Model.fn = S17Model.prototype = {
    constructor: S17Model,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};

ExtendObject(S17Model);

S17Model.extend({
    getLatestChange: function() {
        return {zeroTo1: latestValueChanged0to1, oneTo0: latestValueChanged1to0};
    },
    resetLatestChange: function() {
        latestValueChanged0to1 = [];
        latestValueChanged1to0 = [];
        return 0;
    }
});

window.S17Model = window.$S17M = S17Model;
})($M);
