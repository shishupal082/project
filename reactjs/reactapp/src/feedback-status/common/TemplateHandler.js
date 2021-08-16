import $S from "../../interface/stack.js";
// import TemplateHandlerDBView from "./TemplateHandlerDBView";
import Template from "./Template";

import Config from "./Config";
import DataHandler from "./DataHandler";
// import DataHandlerV2 from "../DataHandlerV2";
// import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


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
    generateProjectDetailsPage: function(pageName, renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        }
        var template = this.getTemplate("projectId");
        var pName = renderData.pName, i;
        var pid = DataHandler.getPathParamsData("pid");
        TemplateHelper.updateTemplateText(template, {"projectId.pName": pName});
        var projectSubLink = this.getTemplate("projectSubLink", []);
        var linkTemplate, href, linkText;
        if ($S.isArray(projectSubLink)) {
            for(i=0; i<projectSubLink.length; i++) {
                // if (DataHandlerV2.isDisabled("pageName", projectSubLink[i].enablePageName)) {
                //     continue;
                // }
                linkText = DataHandler.getAppData("pageName:" + projectSubLink[i].enablePageName + ":projectSubLinkText");
                if (!$S.isStringV2(linkText)) {
                    linkText = projectSubLink[i].text;
                }
                href = this.getLink("projectStatus", pid, projectSubLink[i].href);
                linkTemplate = this.getLinkTemplate(href, linkText);
                TemplateHelper.addItemInTextArray(template, "projectId.sub-link", linkTemplate);
            }
        }
        // var uploadFileData = TemplateHandler._generateFieldTable(renderData.uploadedFileData, renderData.tableName, "resultPatternUploadedFiles");
        // var uploadFileTemplate = FormHandler.getUploadFileTemplate(pageName);
        // var addCommentTemplate = FormHandler.getAddProjectCommentTemplate(pageName);
        // var addLinkTemplate = FormHandler.getAddLinkTemplate(pageName);
        // TemplateHelper.addItemInTextArray(template, "projectId.uploaded_files", uploadFileData);
        // TemplateHelper.addItemInTextArray(template, "projectId.upload_file", uploadFileTemplate);
        // TemplateHelper.addItemInTextArray(template, "projectId.upload_file", addLinkTemplate);
        // TemplateHelper.addItemInTextArray(template, "pageName:projectId.addCommentTemplate", addCommentTemplate);
        return template;
    },
    generateProjectSupplyStatus: function(pageName, renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        }
        var template = this.getTemplate("projectSupplyStatus");
        var displayText = {"projectSupplyStatus.pName": renderData.pName, "projectSupplyStatus.supplyItemName": renderData.supplyItemName};
        var newSupplyStatus;// = FormHandler.getUpdateSupplyTemplate(pageName);
        if (!$S.isArray(newSupplyStatus)) {
            newSupplyStatus = [];
        }
        var projectSupplyStatus = this._generateFieldTable(renderData.supplyStatus, renderData.tableName, "pageName:" + pageName + ".resultPatternSupplyStatus");
        TemplateHelper.updateTemplateText(template, displayText);
        TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.statusTable", projectSupplyStatus);
        TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.addNew", newSupplyStatus);
        return template;
    },
    generateProjectSupplyItemList: function(pageName, renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        }
        var template = this.getTemplate("projectSupplyItems");
        var pName = renderData.pName;
        var newSupplyItem;// = FormHandler.getAddNewSupplyItemTemplate();
        var projectSupplyItems = this._generateFieldTable(renderData.supplyItem, renderData.tableName, "pageName:" + pageName + ".resultPatternSupplyItems");
        TemplateHelper.updateTemplateText(template, {"projectSupplyItems.pName": pName});
        TemplateHelper.addItemInTextArray(template, "projectSupplyItems.table", projectSupplyItems);
        TemplateHelper.addItemInTextArray(template, "projectSupplyItems.addNew", newSupplyItem);
        return template;
    },
    getDisplayPageTemplate: function(renderData) {
        // var pageField = TemplateHandlerDBView.getDbViewFieldsV2(renderData);
        var template = this.getTemplate("displayPage");
        // TemplateHelper.addItemInTextArray(template, "displayPage.field", pageField);
        return template;
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
        var headingJson = Config.headingJson;
        var footerJson = Config.footerJson, i;
        var username = AppHandler.GetUserData("username", "");
        var enabledPageId;// = DataHandlerV2.getEnabledPageId();
        var enabledViewPage;// = DataHandlerV2.getEnabledViewPageName();
        if ($S.isString(username)) {
            TemplateHelper.setTemplateAttr(headingJson, "pageHeading.username", "text", username);
        }
        if ($S.isArray(enabledPageId)) {
            for(i=0; i<enabledPageId.length; i++) {
                TemplateHelper.removeClassTemplate(headingJson, "pageId:" + enabledPageId[i], "d-none");
                TemplateHelper.removeClassTemplate(footerJson, "pageId:" + enabledPageId[i], "d-none");
            }
        }
        if ($S.isArray(enabledViewPage)) {
            for(i=0; i<enabledViewPage.length; i++) {
                TemplateHelper.removeClassTemplate(headingJson, "viewPage:" + enabledViewPage[i], "d-none");
                TemplateHelper.removeClassTemplate(footerJson, "viewPage:" + enabledViewPage[i], "d-none");
            }
        }
    },
    GetPageRenderField: function(dataLoadStatus, renderData, footerData, pageName) {
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
                case "projectId":
                    renderField = this.generateProjectDetailsPage(pageName, renderData);
                break;
                case "projectStatusWork":
                case "projectStatusSupply":
                case "projectContingency":
                    renderField = this.generateProjectSupplyItemList(pageName, renderData);
                break;
                case "updateSupplyStatus":
                case "updateContingencyStatus":
                case "updateWorkStatus":
                    renderField = this.generateProjectSupplyStatus(pageName, renderData);
                break;
                case "displayPage":
                    renderField = this.getDisplayPageTemplate(renderData);
                break;
                case "viewPage":
                    renderField = this.getViewPageTemplate(renderData);
                break;
                case "noMatch":
                default:
                    renderField = this.getTemplate("noMatch");
                break;
            }
        }
        // var metaData = DataHandler.getData("metaData", {});
        // var footerFieldHtml = AppHandler.GenerateFooterHtml(metaData, footerData);
        var footerField = this.getTemplate("footerField2");
        var goBackLink = this.getGoBackLinkTemplate(pageName);
        if ($S.isArray(renderField)) {
            TemplateHelper.addItemInTextArray(footerField, "footer", $S.clone(Config.footerJson));
            renderField.push(footerField);
        }
        // TemplateHelper.updateTemplateText(footerField, {"footerLink": footerFieldHtml});
        TemplateHelper.updateTemplateText(renderField, {"goBackLink": goBackLink});
        // TemplateHelper.addItemInTextArray(renderField, "footer", $S.clone(Config.footerJson));
        return renderField;
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
