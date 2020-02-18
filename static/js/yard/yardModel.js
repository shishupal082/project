(function($M) {
var YardModel = function(selector, context) {
    return new YardModel.fn.init(selector, context);
};
YardModel.fn = YardModel.prototype = {
    constructor: YardModel,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(YardModel);
var lsKey = "displayYardDominoBoundary";
var LS = $M.getLocalStorage();
YardModel.extend({
	getTableHtml: function(yardData, name) {
		var tableData = [];
		if (yardData && yardData[name]) {
			tableData = yardData[name];
		}
		var table = $M.getTable(tableData, name);
		return table.getHtml();
	},
	enableDomino: function () {
		var domino = new Domino();
		domino.enableValidate();
		YardModel.extend({
			getTableHtml: function(yardData, name) {
				var tableData = [];
				if (yardData && yardData[name]) {
					tableData = yardData[name];
				}
				/* Checking data intigrity.*/
				var d = new Domino(name);
				for (var i = 0; i < tableData.length; i++) {
					d.setRowData(i, tableData[i]);
				}
				tableData = d.getData();
				/* Checking data intigrity End.*/
				var table = $M.getTable(tableData, name);
				return table.getHtml();
			}
		});
	},
	getDisplayYardDominoBoundary: function() {
		var lsValue = LS.get(lsKey);
		var response = false;
		if (lsValue.status && lsValue.value == "true") {
			response = true;
		}
		return response;
	},
	toggleDisplayYardDominoBoundary: function() {
		if (this.getDisplayYardDominoBoundary()) {
			LS.set(lsKey, false);
		} else {
			LS.set(lsKey, true);
		}
		return this.getDisplayYardDominoBoundary();
	}
});
window.YardModel = window.$YM = YardModel;
})($M);
