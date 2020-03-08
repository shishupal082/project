(function($M, $YM) {
var yardComponent = {};
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

var topLoopLine = ["","","left-top", "8-point-top", "s14-tpr", "l-tpr-1", "l-tpr-2", "s2-tpr", "right-top"];
var topLoopPoint = ["","","","8-point-mid","","","","9-point-mid-1","9-point-mid"];
var mainLine = ["1-tpr", "16-tpr", "8-tpr", "8c-tpr", "s15-tpr", "m-tpr-1", "m-tpr-2", "s3-tpr", "9d-tpr", "9-tpr", "4-tpr"];
var bottomLoopLine = ["","","","","",""];
// bottomLoopLine.push("tc");
var requiredContent = [];
requiredContent.push(topLoopLine);
requiredContent.push(topLoopPoint);
requiredContent.push(mainLine);
requiredContent.push(bottomLoopLine);
YardView.extend({
    loadApiData: function(callBack) {
        var verifyFromDomino = true;
        if (verifyFromDomino) {
            $YM.enableDomino();
        }
        var apiUrl = ["static/json/yardData.json"];
        $YM.loadJsonData(apiUrl, function(response) {
            if (response) {
                for (var key in response) {
                    Object.assign(yardComponent, response[key]);
                }
            }
            tableContent = $YM.getYardTableContent(yardComponent, requiredContent);
            callBack();
        });
        return true;
    },
    getYardHtml: function() {
        var table = $M.getTable(tableContent, "yard");
        return table.getHtml();
    },
    getDisplayYardDominoBoundary: function() {
        return $YM.getDisplayYardDominoBoundary();
    },
    toggleDisplayYardDominoBoundary: function() {
        return $YM.toggleDisplayYardDominoBoundary();
    }
});

window.YardView = window.$YV = YardView;
})($M, $YM);
