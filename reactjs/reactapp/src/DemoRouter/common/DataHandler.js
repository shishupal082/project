import $S from "../../interface/stack.js";
import Template from "./Template";

import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
var DataHandler;

(function($S){
var CurrentData = $S.getDataObj();
var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");
keys.push("pageName");

CurrentData.setKeys(keys);

DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};
DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandler);

DataHandler.extend({
    setData: function(key, value, isDirect) {
        return CurrentData.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CurrentData.getData(key, defaultValue, isDirect);
    }
});
DataHandler.extend({
    getPages: function() {
        var pages = {"home": "home", "page1": "page1", "page2": "page2", "page3": "page3", "page4": "page4", "noMatch": "noMatch"};
        return pages;
    },
    getPageUrl: function() {
        var pageUrl = {"home": "/", "page1": "/page-1", "page2": "/page-2", "page3": "/page-3", "page4": "/page-4"};
        return pageUrl;
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        $S.log("DataHandler:AppDidMount");
        this.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, pageName) {
        $S.log("DataHandler:PageComponentDidMount");
        var oldPageName = DataHandler.getData("pageName", "");
        if (oldPageName !== pageName) {
            this.setData("pageName", pageName);
            this.handleDataLoadComplete(appStateCallback, appDataCallback);
        }
    }
});
DataHandler.extend({
    getRenderData: function() {
        var pageName = this.getData("pageName", "");
        var renderData, pageUrl, key;
        switch(pageName) {
            case "home":
                pageUrl = this.getPageUrl();
                renderData = [];
                for (key in pageUrl) {
                    if (key !== "home") {
                        renderData.push({"href": pageUrl[key], "toText": $S.capitalize(key)});
                    }
                }
            break;
            default:
                renderData = [];
            break;
        }
        return renderData;
    },
    getRenderTemplate: function(renderData) {
        var pageName = this.getData("pageName", "");
        var renderFieldRow = [], i, linkTemplate;
        switch(pageName) {
            case "home":
                for (i=0; i<renderData.length; i++) {
                    linkTemplate = AppHandler.getTemplate(Template, "home.link");
                    TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "href", renderData[i].href);
                    TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": renderData[i].toText});
                    renderFieldRow.push(linkTemplate);
                }

            break;
            case "page1":
            case "page2":
            case "page3":
            case "page4":
            break;
            default:
                renderFieldRow = Template["noMatch"];
            break;
        }
        return renderFieldRow;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var renderData = this.getRenderData();
        var renderFieldRow = this.getRenderTemplate(renderData);
        appDataCallback("renderFieldRow", renderFieldRow);
        appDataCallback("appHeading", Template["heading"]);
        appDataCallback("firstTimeDataLoadStatus", "completed");
        appStateCallback();
    }
});

})($S);

export default DataHandler;
