import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";

// import AppHandler from "../../common/app/common/AppHandler";

var PageHandler;

(function($S){
// var DT = $S.getDT();
PageHandler = function(arg) {
    return new PageHandler.fn.init(arg);
};
PageHandler.fn = PageHandler.prototype = {
    constructor: PageHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(PageHandler);

PageHandler.extend({
    getList2Data: function() {
        var metaData = DataHandler.getData("metaData", {});
        var disabledPages = [];
        if ($S.isObject(metaData) && $S.isArray(metaData.disabledPages)) {
            disabledPages = metaData.disabledPages;
        }
        var pages = Config.pages;
        var list2Data = [];
        for(var key in pages) {
            if (key !== "home" && disabledPages.indexOf(key) < 0) {
                list2Data.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
            }
        }
        return list2Data;
    },
    isValidList2Id: function(list2Id) {
        var metaData = DataHandler.getData("metaData", {});
        if ($S.isObject(metaData) && $S.isArray(metaData.disabledPages)) {
            return metaData.disabledPages.indexOf(list2Id) >= 0;
        }
        return false;
    }
});

})($S);

export default PageHandler;
