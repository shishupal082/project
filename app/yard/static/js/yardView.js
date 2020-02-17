(function(window, $YC){

var tableContent = [];
tableContent.push([]);
tableContent[0].push("");
tableContent[0].push("");
tableContent[0].push($YC.getTableHtml("left-top"));
tableContent[0].push($YC.getTableHtml("8-point-top"));
tableContent[0].push($YC.getTableHtml("s14-tpr"));
tableContent[0].push($YC.getTableHtml("l-tpr-1"));
tableContent[0].push($YC.getTableHtml("l-tpr-2"));
tableContent[0].push($YC.getTableHtml("s2-tpr"));
tableContent[0].push($YC.getTableHtml("right-top"));
tableContent.push([]);
tableContent[1].push("");
tableContent[1].push("");
tableContent[1].push("");
tableContent[1].push($YC.getTableHtml("8-point-mid"));
tableContent[1].push("");
tableContent[1].push("");
tableContent[1].push("");
tableContent[1].push($YC.getTableHtml("9-point-mid-1"));
tableContent[1].push($YC.getTableHtml("9-point-mid"));
tableContent.push([]);
tableContent[2].push($YC.getTableHtml("1-tpr"));
tableContent[2].push($YC.getTableHtml("16-tpr"));
tableContent[2].push($YC.getTableHtml("8-tpr"));
tableContent[2].push($YC.getTableHtml("8c-tpr"));
tableContent[2].push($YC.getTableHtml("s15-tpr"));
tableContent[2].push($YC.getTableHtml("m-tpr-1"));
tableContent[2].push($YC.getTableHtml("m-tpr-2"));
tableContent[2].push($YC.getTableHtml("s3-tpr"));
tableContent[2].push($YC.getTableHtml("9d-tpr"));
tableContent[2].push($YC.getTableHtml("9-tpr"));
tableContent[2].push($YC.getTableHtml("4-tpr"));
tableContent.push([]);
tableContent[3].push("");
tableContent[3].push("");
tableContent[3].push("");
tableContent[3].push("");
tableContent[3].push("");
// tableContent[3].push($YC.getTableHtml("tc"));


var View = function(selector, context) {
    return new View.fn.init(selector, context);
};
View.fn = View.prototype = {
    constructor: View,
    init: function(selector, context) {
        this.selector = selector;
        this.context = context;
        return this;
    }
};
ExtendObject(View);
View.extend({
    documentLoaded: function() {
    },
    getTableHtml: function(name) {
        return $YC.getTableHtml(name);
    },
    getYardHtml: function() {
        return $YC.getYardHtml(tableContent);
    }
});
window.YardView = window.$YV = View;

})(window, $YC);
