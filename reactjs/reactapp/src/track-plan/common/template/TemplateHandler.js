import $S from "../../../interface/stack.js";
import Template from "./Template";

import Config from "../Config";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import TrackPlan from "../TrackPlan";


import TemplateHelper from "../../../common/TemplateHelper";
// import AppHandler from "../../../common/app/common/AppHandler";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";
import CommonConfig from "../../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";
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
    _getLinkTemplateV2: function(toUrl, toText, templateName) {
        var linkTemplate = TemplateHandler.getTemplate(templateName);
        TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "href", toUrl);
        TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": toText});
        return linkTemplate;
    },
    generateProjectHomeRenderField: function(pageName) {
        // pageName = "origin"
        var appControlData = CommonDataHandler.getData("appControlData", []);
        var template = this.getTemplate("home");
        var linkTemplate, toUrl;
        if (appControlData.length === 0) {
            return this.getTemplate("noDataFound");
        }
        for (var i = 0; i< appControlData.length; i++) {
            toUrl = DataHandler.getLinkByIndex(appControlData[i].id);
            linkTemplate = this._getLinkTemplateV2(toUrl, appControlData[i].name, "home.link");
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    },
    generateHomeRenderField: function() {
        var homeFields = DataHandlerV2.getList2Data();
        var template = this.getTemplate("home");
        var validPages = Config.validPages;
        var linkTemplate, toUrl;
        if (homeFields.length === 0) {
            return this.getTemplate("noDataFound");
        }
        for (var i = 0; i< homeFields.length; i++) {
            toUrl = "";
            if (validPages.indexOf(homeFields[i].pageName) >= 0) {
                toUrl = DataHandler.getPageUrlByPageName(homeFields[i].pageName);
                linkTemplate = this._getLinkTemplateV2(toUrl, homeFields[i].toText, "home.link");
            } else if ($S.isStringV2(homeFields[i].toUrl)) {
                toUrl = homeFields[i].toUrl;
                linkTemplate = this._getLinkTemplateV2(toUrl, homeFields[i].toText, "home.a");
            }
            if ($S.isStringV2(toUrl)) {
                TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
            }
        }
        return template;
    },
    // generateHomeRenderField: function(pageName) {
    //     // pageName = "home"
    //     var homeFields = [], i, linkTemplate;
    //     if ($S.isArray(renderData)) {
    //         for (i=0; i<renderData.length; i++) {
    //             if (!$S.isObject(renderData[i])) {
    //                 continue;
    //             }
    //             homeFields.push({"toUrl": this._getLink("projectId", renderData[i].tableUniqueId),
    //                     "toText": renderData[i].pName});
    //         }
    //     }
    //     var template = this.getTemplate("home");
    //     for (i = 0; i< homeFields.length; i++) {
    //         linkTemplate = this._getLinkTemplate(homeFields[i].toUrl, homeFields[i].toText);
    //         TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
    //     }
    //     return template;
    // }
});
TemplateHandler.extend({
    _generateFieldTable: function(tableData, tableName, resultPatternName, currentList3Data) {
        var resultPattern = DataHandler.getAppData(resultPatternName);
        var sortingFields = DataHandler.getData("sortingFields", []);
        var viewReloadOption = DataHandler.getAppData("enableReloadButton", false);
        var dbViewData = {};
        dbViewData[tableName] = {"tableData": tableData};
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, null, null);
        finalTable = $S.sortResultV2(finalTable, sortingFields, "name");
        var htmlFields = DBViewTemplateHandler.GenerateDbViewRenderField(finalTable, currentList3Data, sortingFields, viewReloadOption);
        return htmlFields;
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
                case "origin":
                    renderField = this.generateProjectHomeRenderField(pageName);
                break;
                case "home":
                    renderField = this.generateHomeRenderField(pageName, renderData);
                break;
                case "track-plan":
                    renderField = TrackPlan.generateTrackPlanPage(pageName, renderData);
                break;
                case Config.edit_image:
                    renderField = TrackPlan.generateTrackPlanEditPage(pageName, renderData);
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
    },
    GetHeadingField: function(headingText) {
        TemplateHelper.updateTemplateText(Config.headingJson, {"heading-text": headingText});
        return [$S.clone(Config.headingJson), {"tag": "div.center", "text": $S.clone(Config.afterLoginLinkJson)}];
    }
});

})($S);

export default TemplateHandler;
