(function($M) {
var YardController = function(selector, context) {
    return new YardController.fn.init(selector, context);
};
YardController.fn = YardController.prototype = {
    constructor: YardController,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardController);
YardController.extend({
	documentLoaded: function() {
    },
	getYardModel: function() {
        var YM = $M.getYardModel();
    	return YM;
    },
    getTableHtml: function(name) {
        var YM = $M.getYardModel();
        return YM.getTableHtml(name);
    },
    getYardHtml: function(yardContent) {
        var table = $M.getTable(yardContent, "yard");
        return table.getHtml();
    }
});
YardController.extend({
});
window.YardController = window.$YC = YardController;
})($M);
