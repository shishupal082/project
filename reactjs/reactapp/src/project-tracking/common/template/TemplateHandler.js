import $S from "../../../interface/stack.js";
import TemplateHandlerDBView from "./TemplateHandlerDBView";
import Template from "./Template";

import Config from "../Config";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../../common/TemplateHelper";
import AppHandler from "../../../common/app/common/AppHandler";
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
    generateHomeRenderField: function(renderData) {
        var homeFields = [], i, linkTemplate;
        if ($S.isArray(renderData)) {
            for (i=0; i<renderData.length; i++) {
                if (!$S.isObject(renderData[i])) {
                    continue;
                }
                homeFields.push({"toUrl": this._getLink("projectId", renderData[i].pid),
                        "toText": renderData[i].pName});
            }
        }
        var template = this.getTemplate("home");
        for (i = 0; i< homeFields.length; i++) {
            linkTemplate = this._getLinkTemplate(homeFields[i].toUrl, homeFields[i].toText);
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        var newProjectTemplate = FormHandler.getAddNewProjectTemplate();
        TemplateHelper.addItemInTextArray(template, "home.addNewProject", newProjectTemplate);
        return template;
    }
});
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
    _getLinkTemplate: function(href, text) {
        var linkTemplate = TemplateHandler.getTemplate("link-field");
        TemplateHelper.setTemplateAttr(linkTemplate, "link-field.url", "href", href);
        TemplateHelper.updateTemplateText(linkTemplate, {"link-field.url": text});
        return linkTemplate;
    },
    _getLink: function(pageName, pid, status) {
        var link;
        if (pageName === "projectStatus") {
            link = Config.basepathname + "/pid/" + pid + "/" + status;
        } else if (pageName === "projectId") {
            link = Config.basepathname + "/pid/" + pid;
        } else {
            link = Config.basepathname;
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
        var projectSubLink = DataHandler.getAppData("projectSubLink", []);
        var linkTemplate, href;
        if ($S.isArray(projectSubLink)) {
            for(i=0; i<projectSubLink.length; i++) {
                href = this._getLink("projectStatus", pid, projectSubLink[i].href);
                linkTemplate = this._getLinkTemplate(href, projectSubLink[i].text);
                TemplateHelper.addItemInTextArray(template, "projectId.sub-link", linkTemplate);
            }
        }
        var uploadFileData = TemplateHandler._generateFieldTable(renderData.uploadedFileData, renderData.tableName, "resultPatternUploadedFiles");
        var uploadFileTemplate = FormHandler.getUploadFileTemplate(pageName);
        var addCommentTemplate = FormHandler.getAddProjectCommentTemplate(pageName);
        TemplateHelper.addItemInTextArray(template, "projectId.uploaded_files", uploadFileData);
        TemplateHelper.addItemInTextArray(template, "projectId.upload_file", uploadFileTemplate);
        TemplateHelper.addItemInTextArray(template, "pageName:projectId.addCommentTemplate", addCommentTemplate);
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
        var newSupplyStatus = FormHandler.getUpdateSupplyTemplate(pageName);
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
        var newSupplyItem = FormHandler.getAddNewSupplyItemTemplate();
        var projectSupplyItems = this._generateFieldTable(renderData.supplyItem, renderData.tableName, "pageName:" + pageName + ".resultPatternSupplyItems");
        TemplateHelper.updateTemplateText(template, {"projectSupplyItems.pName": pName});
        TemplateHelper.addItemInTextArray(template, "projectSupplyItems.table", projectSupplyItems);
        TemplateHelper.addItemInTextArray(template, "projectSupplyItems.addNew", newSupplyItem);
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
        var linkRef = DataHandlerV2._getLinkRef(pageName)
        switch(pageName) {
            case "projectStatusWork":
            case "projectStatusSupply":
            case "projectContingency":
                backUrl = this._getLink("projectId", pid);
            break;
            case "updateSupplyStatus":
            case "updateContingencyStatus":
            case "updateWorkStatus":
                backUrl = this._getLink("projectStatus", pid, linkRef);
            break;
            case "projectId":
            default:
                backUrl = this._getLink();
            break;
        }
        TemplateHelper.setTemplateAttr(template, "goBackLink.a", "href", backUrl);
        return template;
    },
    SetUserRealtedData: function() {
        var headingJson = Config.headingJson;
        var username = AppHandler.GetUserData("username", "");
        var enabledPageId = DataHandlerV2.getEnabledPageId();
        if ($S.isString(username)) {
            TemplateHelper.setTemplateAttr(headingJson, "pageHeading.username", "text", username);
        }
        if ($S.isArray(enabledPageId)) {
            for(var i=0; i<enabledPageId.length; i++) {
                TemplateHelper.removeClassTemplate(headingJson, "pageId:" + enabledPageId[i], "d-none");
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
        }
        switch(pageName) {
            case "home":
                renderField = this.generateHomeRenderField(renderData);
            break;
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
                renderField = TemplateHandlerDBView.getDbViewFieldsV2(renderData);
            break;
            case "noMatch":
            default:
                renderField = this.getTemplate("noMatch");
            break;
        }
        var metaData = DataHandler.getData("metaData", {});
        var footerFieldHtml = AppHandler.GenerateFooterHtml(metaData, footerData);
        var footerField = this.getTemplate("footerField");
        var goBackLink = this.getGoBackLinkTemplate(pageName);

        TemplateHelper.updateTemplateText(footerField, {"footerLink": footerFieldHtml});
        TemplateHelper.updateTemplateText(renderField, {"goBackLink": goBackLink});
        TemplateHelper.addItemInTextArray(renderField, "footer", footerField);
        return renderField;
    },
    GetHeadingField: function(headingText) {
        var renderField = this.getTemplate("heading");
        TemplateHelper.updateTemplateText(renderField, {"heading-text": headingText, "heading-link": $S.clone(Config.headingJson)});
        return renderField;
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
