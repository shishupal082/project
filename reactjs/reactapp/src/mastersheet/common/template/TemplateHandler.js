import $S from "../../../interface/stack.js";
import Template from "./Template";

// import Config from "../Config";
import DataHandler from "../DataHandler";
import Mastersheet from "../Mastersheet";

import TemplateHelper from "../../../common/TemplateHelper";
import CommonConfig from "../../../common/app/common/CommonConfig";
// import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../../common/app/common/DBViewTemplateHandler";


var TemplateHandler;
(function($S){
// var DT = $S.getDT();
var loadingCount = 0;
TemplateHandler = function(arg) {
    return new TemplateHandler.fn.init(arg);
};
TemplateHandler.fn = TemplateHandler.prototype = {
    constructor: TemplateHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TemplateHandler);
DBViewTemplateHandler.UpdateTemplate("noDataFound", []);
TemplateHandler.extend({
    generateHomeRenderField: function(pageName, renderData) {
        // pageName = "home"
        var homeFields = [], i, linkTemplate;
        if ($S.isArray(renderData)) {
            for (i=0; i<renderData.length; i++) {
                if (!$S.isObject(renderData[i])) {
                    continue;
                }
                homeFields.push({"toUrl": this._getLink("projectId", renderData[i].tableUniqueId),
                        "toText": renderData[i].pName});
            }
        }
        var template = this.getHomeTemplatePartial("home");
        for (i = 0; i< homeFields.length; i++) {
            linkTemplate = this._getLinkTemplate(homeFields[i].toUrl, homeFields[i].toText);
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    }
});
TemplateHandler.extend({
    _getInvalidField: function(text) {
        var template = this.getTemplate("invalid-data");
        TemplateHelper.updateTemplateText(template, {"invalid-data.text": text});
        return template;
    },
    _getLinkTemplate: function(href, text) {
        var linkTemplate = this.getHomeTemplatePartial("link-field");
        TemplateHelper.setTemplateAttr(linkTemplate, "link-field.url", "href", href);
        TemplateHelper.updateTemplateText(linkTemplate, {"link-field.url": text});
        return linkTemplate;
    },
    _getLink: function(pageName, pid) {
        var link = "";
        var index = DataHandler.getPathParamsData("index", "0");
        if (pageName === "projectId") {
            link = CommonConfig.basepathname + "/" + index + "/pid/" + pid;
        } else {
            link = CommonConfig.basepathname + "/" + index;
            if (link === "") {
                link = "/" + index;
            }
        }
        return link;
    },
    getViewPageTemplate: function(renderData) {
        var pageField;
        var currentList3Data = DataHandler.getCurrentList3Data();
        var sortingFields = DataHandler.getData("sortingFields", []);
        var viewReloadOption = DataHandler.getAppData("enableReloadButton", false);
        if (!$S.isArray(renderData) || renderData.length === 0) {
            pageField = TemplateHandler.getTemplate("noDataFound");
        } else {
            pageField = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields, viewReloadOption);
        }
        var template = this.getTemplate("viewPage");
        TemplateHelper.addItemInTextArray(template, "viewPage.field", pageField);
        return template;
    }
});

TemplateHandler.extend({
    getTemplate: function(pageName) {
        if (Template[pageName]) {
            return $S.clone(Template[pageName]);
        }
        return $S.clone(Template["templateNotFound"]);
    },
    getHomeTemplatePartial: function(templateName) {
        var template = this.getTemplate(templateName);
        var temp;
        if (templateName === "home") {
            temp = DataHandler.getAppData("template.home");
        }
        if (templateName === "link-field") {
            temp = DataHandler.getAppData("template.home.link-field");
        }
        if ($S.isObject(temp) || $S.isArray(temp)) {
            template = temp;
        }
        return template;
    },
    getGoBackLinkTemplate: function(pageName) {
        var template = this.getTemplate("goBackLink");
        var backUrl = "";
        var pid = DataHandler.getPathParamsData("pid");
        switch(pageName) {
            case "id1Page":
                backUrl = this._getLink("projectId", pid);
            break;
            case "projectId":
            default:
                backUrl = this._getLink();
            break;
        }
        TemplateHelper.setTemplateAttr(template, "goBackLink.a", "href", backUrl);
        return template;
    },
    GetPageRenderField: function(dataLoadStatus, renderData, pageName) {
        var renderField;
        if (!dataLoadStatus) {
            renderField = this.getTemplate("loading");
            $S.log("loadingCount: " + (loadingCount++));
            return renderField;
        }
        if ($S.isObject(renderData) && renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        } else {
            switch(pageName) {
                case "home":
                    // renderField = this.generateHomeRenderField(pageName, renderData);
                    renderField = Mastersheet.getPageFromData(pageName, renderData);
                break;
                case "noMatch":
                default:
                    renderField = this.getTemplate("noMatch");
                break;
            }
        }
        var isGoBackLinkEnable = DataHandler.getAppData(pageName + ".goBackLinkEnable", false);
        var isGoBackRowEnable = DataHandler.getAppData(pageName + ".goBackRowEnable", false);
        if ($S.isBooleanTrue(isGoBackRowEnable)) {
            TemplateHelper.removeClassTemplate(renderField, pageName + ".goBackRow", "d-none");
        }
        if ($S.isBooleanTrue(isGoBackLinkEnable)) {
            var goBackLink = this.getGoBackLinkTemplate(pageName);
            TemplateHelper.updateTemplateText(renderField, {"goBackRow.goBackLink": goBackLink});
        }
        return renderField;
    }
});

})($S);

export default TemplateHandler;
