(function($M) {
var YardView = function(selector, context) {
    return new YardView.fn.init(selector, context);
};
YardView.fn = YardView.prototype = {
    constructor: YardView,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardView);
YardView.extend({
	documentLoaded: function() {
    },
    getYardHtml: function() {
        var YM = $M.getYardModel();
        var yardContent = YM.getYardTableContent();
        var table = $M.getTable(yardContent, "yard");
        return table.getHtml();
    }
});
YardView.extend({
});
window.YardView = window.$YV = YardView;
})($M);
