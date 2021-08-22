import $S from "../../interface/stack.js";
// import TemplateHandlerDBView from "./TemplateHandlerDBView";
import Template from "./Template";

import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV2 from "./DataHandlerV2";
// import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


var TemplateHandler;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
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
    _generateFieldTable: function(tableData, tableName, resultPatternName, currentList3Data) {
        var resultPattern = DataHandler.getAppData(resultPatternName);
        var sortingFields = DataHandler.getData("sortingFields", []);
        var dbViewData = {};
        dbViewData[tableName] = {"tableData": tableData};
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, null, null);
        finalTable = $S.sortResultV2(finalTable, sortingFields, "name");
        var htmlFields = DBViewTemplateHandler.GenerateDbViewRenderField(finalTable, currentList3Data, sortingFields);
        return htmlFields;
    }
});
TemplateHandler.extend({
    _getInvalidField: function(text) {
        var template = this.getTemplate("invalid-data");
        TemplateHelper.updateTemplateText(template, {"invalid-data.text": text});
        return template;
    },
    getInvalidField: function(data) {
        var text = "Invalid Page";
        if ($S.isObject(data) && $S.isStringV2(data.reason)) {
            text = data.reason;
        }
        return this._getInvalidField(text);
    },
    getLinkTemplate: function(href, text) {
        var linkTemplate = TemplateHandler.getTemplate("link-field");
        TemplateHelper.setTemplateAttr(linkTemplate, "link-field.url", "href", href);
        TemplateHelper.updateTemplateText(linkTemplate, {"link-field.url": text});
        return linkTemplate;
    },
    getLink: function(pageName, pid, status) {
        var link;
        if (pageName === "home") {
            link = CommonConfig.basepathname + "/pid/" + pid;
        } else {
            link = CommonConfig.basepathname;
            if (link === "") {
                link = "/";
            }
        }
        return link;
    },
    getViewPageTemplate: function(renderData) {
        // var pageField = TemplateHandlerDBView.getDbViewFieldsV2(renderData);
        var template = this.getTemplate("viewPage");
        // TemplateHelper.addItemInTextArray(template, "viewPage.field", pageField);
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
    getGoBackLinkTemplate: function(pageName) {
        var template = this.getTemplate("goBackLink");
        var backUrl = "";
        var pid = DataHandler.getPathParamsData("pid");
        var linkRef; // = DataHandlerV2.getLinkRef(pageName);
        switch(pageName) {
            case "projectStatusWork":
            case "projectStatusSupply":
            case "projectContingency":
                backUrl = this.getLink("projectId", pid);
            break;
            case "updateSupplyStatus":
            case "updateContingencyStatus":
            case "updateWorkStatus":
                backUrl = this.getLink("projectStatus", pid, linkRef);
            break;
            case "projectId":
            default:
                backUrl = this.getLink();
            break;
        }
        TemplateHelper.setTemplateAttr(template, "goBackLink.a", "href", backUrl);
        return template;
    },
    SetUserRealtedData: function() {
        var i;
        var afterLoginLinkJson = Config.afterLoginLinkJson;
        var footerLinkJsonAfterLogin = Config.footerLinkJsonAfterLogin;
        var enabledPageId = DataHandlerV2.getEnabledPageId();
        var enabledViewPage = DataHandlerV2.getEnabledViewPageName();
        var username = AppHandler.GetUserData("username", "");
        if ($S.isStringV2(username)) {
            TemplateHelper.updateTemplateText(afterLoginLinkJson, {"pageHeading.username": username});
        }
        if ($S.isArray(enabledPageId)) {
            for(i=0; i<enabledPageId.length; i++) {
                TemplateHelper.removeClassTemplate(afterLoginLinkJson, "pageId:" + enabledPageId[i], "d-none");
                TemplateHelper.removeClassTemplate(footerLinkJsonAfterLogin, "pageId:" + enabledPageId[i], "d-none");
            }
        }
        if ($S.isArray(enabledViewPage)) {
            for(i=0; i<enabledViewPage.length; i++) {
                TemplateHelper.removeClassTemplate(afterLoginLinkJson, "viewPage:" + enabledViewPage[i], "d-none");
                TemplateHelper.removeClassTemplate(footerLinkJsonAfterLogin, "viewPage:" + enabledViewPage[i], "d-none");
            }
        }
    },
    GetHeadingField: function(headingText) {
        return [Config.headingJson, {"tag": "div.center", "text": Config.afterLoginLinkJson}];
    }
});

TemplateHandler.extend({
    _updatePermenentTemplateText: function(templateName, formValues) {
        var template = Template[templateName];
        TemplateHelper.updateTemplateText(template, formValues);
    },
    handlePageNameChange: function(newPageName, oldPageName) {
        var pageDisplayText = DataHandler.getAppData("pageDisplayText");
        var formFieldText = DataHandler.getAppData("formFieldText");
        var key = "pageName:" + newPageName + ":badgeText";
        var key2 = "pageName:" + newPageName + ":formBadgeText";
        var temp = {};
        if ($S.isObject(pageDisplayText)) {
            temp["pageName:badgeText"] = pageDisplayText[key];
            temp["pageName:formBadgeText"] = pageDisplayText[key2];
            if ([Config.projectStatusSupply, Config.projectContingency, Config.projectStatusWork].indexOf(newPageName) >= 0) {
                this._updatePermenentTemplateText("projectSupplyItems", temp);
                this._updatePermenentTemplateText("addNewSupplyItem", temp);
            } else if ([Config.updateSupplyStatus, Config.updateContingencyStatus].indexOf(newPageName) >= 0) {
                this._updatePermenentTemplateText("projectSupplyStatus", temp);
                this._updatePermenentTemplateText("addSupplyStatus", temp);
            } else if ([Config.updateWorkStatus].indexOf(newPageName) >= 0) {
                this._updatePermenentTemplateText("projectSupplyStatus", temp);
                this._updatePermenentTemplateText("newWorkStatus", temp);
                temp = formFieldText["pageName:" + newPageName];
                this._updatePermenentTemplateText("newWorkStatus", temp);
            }
        }
    }
});

})($S);

export default TemplateHandler;
