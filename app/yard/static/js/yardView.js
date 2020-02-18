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
var YM = $M.getYardModel();
YardView.extend({
	documentLoaded: function() {
    },
    getYardHtml: function() {
        var yardContent = YM.getYardTableContent();
        var table = $M.getTable(yardContent, "yard");
        return table.getHtml();
    },
    getDisplayYardDominoBoundary: function() {
        return YM.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return YM.toggleDisplayYardDominoBoundary();
    }
});
YardView.extend({
});
window.YardView = window.$YV = YardView;
})($M);
