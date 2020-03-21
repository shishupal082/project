(function($M) {

$M.extend({
    setValueChangedCallback: function(key, oldValue, newValue) {
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
});

window.S17Model = window.$S17M = S17Model;
})($M);
