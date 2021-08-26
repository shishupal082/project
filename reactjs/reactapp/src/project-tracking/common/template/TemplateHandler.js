import $S from "../../../interface/stack.js";
import TemplateHandlerDBView from "./TemplateHandlerDBView";
import Template from "./Template";

import Config from "../Config";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
import FormHandler from "../forms/FormHandler";

import PidPage from "../pages/PidPage";
import FeedbackPage from "../pages/FeedbackPage";


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
    generateHomeRenderField: function(pageName, renderData) {
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
        if (!DataHandlerV2.isDisabled("form", "generic_form0")) {
            TemplateHelper.removeClassTemplate(template, "home.addNewProject", "d-none");
            var formTypeField = FormHandler.getGenericTemplate(pageName, "", "generic_form0");
            TemplateHelper.addItemInTextArray(template, "home.addNewProject.formTypeField", formTypeField);
        }
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
    _getLink: function(pageName, pid) {
        var link = "";
        if (pageName === "projectId") {
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
        if (!$S.isObject(renderData["pidRow"])) {
            renderData["pidRow"] = {};
        }
        var currentAppId = DataHandler.getData("currentList1Id", "");
        var template = this.getTemplate("projectId");
        var formName = DataHandlerV2.getFormNameByPageName(pageName);
        var tableName = DataHandler.getTableName("fileTable");
        if ($S.isStringV2(renderData["pidRow"]["form_type"])) {
            formName += "." + renderData["pidRow"]["form_type"];
        }
        var tableName2 = DataHandler.getTableName(formName + ".tableName", "");
        var uploadFileTableData = DataHandlerV2.getRenderTableDataV1(pageName, tableName);
        var generic1FormUploadedData = DataHandlerV2.getRenderTableDataV1(pageName, tableName2);
        generic1FormUploadedData = CommonDataHandler.applyRoleFilter(currentAppId, generic1FormUploadedData, "pageName:" + pageName + ".section.mapping");
        PidPage.updateDependentAttr(pageName, generic1FormUploadedData);
        generic1FormUploadedData = DataHandlerV2.generateFilterOptionAndApplyFilter(pageName, generic1FormUploadedData);
        var resultPatternName = DataHandlerV2.getResultPatternNameByPageName(pageName);
        var uploadFileData = this._generateFieldTable(uploadFileTableData, tableName, "resultPatternUploadedFiles");
        var generic1FormUploadedTable = PidPage.getRenderTable(pageName, tableName2, resultPatternName, generic1FormUploadedData);
        var uploadFileTemplate = FormHandler.getUploadFileTemplate(pageName);
        var addCommentTemplate = FormHandler.getAddProjectCommentTemplate(pageName);
        var genericTemplate = FormHandler.getGenericTemplate(pageName, renderData["pidRow"]["form_type"], "generic_form1");
        var addLinkTemplate = FormHandler.getAddLinkTemplate(pageName);
        if (!(($S.isArray(uploadFileTableData) && uploadFileTableData.length > 0) || ($S.isArray(generic1FormUploadedData) && generic1FormUploadedData.length > 0))) {
            if (uploadFileTemplate === null && addLinkTemplate === null && addCommentTemplate === null && genericTemplate === null) {
                return this.getTemplate("noDataFound");
            } else if (DataHandlerV2.isFilterEnabled(pageName)) {
                generic1FormUploadedTable = this.getTemplate("noDataFound");
            }
        }
        TemplateHelper.updateTemplateText(template, {"projectId.pName": renderData["pidRow"]["pName"]});
        TemplateHelper.addItemInTextArray(template, "projectId.generic1-table", generic1FormUploadedTable);
        TemplateHelper.addItemInTextArray(template, "projectId.uploaded_files", uploadFileData);
        TemplateHelper.addItemInTextArray(template, "projectId.upload_file", uploadFileTemplate);
        TemplateHelper.addItemInTextArray(template, "projectId.upload_file", addLinkTemplate);
        TemplateHelper.addItemInTextArray(template, "pageName:projectId.otherTemplate", addCommentTemplate);
        TemplateHelper.addItemInTextArray(template, "pageName:projectId.otherTemplate", genericTemplate);
        return template;
    },
    generateId1Page: function(pageName, renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (!$S.isObject(renderData["pidRow"])) {
            renderData["pidRow"] = {};
        }
        if (!$S.isObject(renderData["id1Row"])) {
            renderData["id1Row"] = {};
        }
        var template = this.getTemplate("id1Page");
        var formName = DataHandlerV2.getFormNameByPageName(pageName);
        if ($S.isStringV2(renderData["id1Row"]["form_type"])) {
            formName += "." + renderData["id1Row"]["form_type"];
        }
        var tableName = DataHandler.getTableName(formName + ".tableName", "");
        var generic2FormUploadedData = DataHandlerV2.getTableDataV4(pageName, tableName);
        var genericTemplate = null;
        if (FeedbackPage.isFormDisplayEnable(renderData["pidRow"], renderData["id1Row"], generic2FormUploadedData)) {
            genericTemplate = FormHandler.getGenericTemplate(pageName, renderData["id1Row"]["form_type"], "generic_form2");
        }
        var preDefinedPattern = FeedbackPage.getPreDefinedPattern(renderData["id1Row"]);
        if (!($S.isArray(generic2FormUploadedData) && generic2FormUploadedData.length > 0)) {
            if (genericTemplate === null && preDefinedPattern === null) {
                return this.getTemplate("noDataFound");
            }
        }
        var resultPatternName = DataHandlerV2.getResultPatternNameByPageName(pageName);
        var generic2FormUploadedTable = this._generateFieldTable(generic2FormUploadedData, tableName, resultPatternName);
        TemplateHelper.updateTemplateText(template, {"id1Page.pName": renderData["pidRow"]["pName"]});
        TemplateHelper.addItemInTextArray(template, "id1Page.preDefinedPattern", preDefinedPattern);
        TemplateHelper.addItemInTextArray(template, "id1Page.generic2-table", generic2FormUploadedTable);
        TemplateHelper.addItemInTextArray(template, "pageName:id1Page.formTemplate", genericTemplate);
        return template;
    },
    // generateProjectSupplyStatus: function(pageName, renderData) {
    //     if (!$S.isObject(renderData)) {
    //         renderData = {};
    //     }
    //     if (renderData.status === "FAILURE") {
    //         return this._getInvalidField(renderData.reason);
    //     }
    //     var template = this.getTemplate("projectSupplyStatus");
    //     var displayText = {"projectSupplyStatus.pName": renderData.pName, "projectSupplyStatus.supplyItemName": renderData.supplyItemName};
    //     var newSupplyStatus = FormHandler.getUpdateSupplyTemplate(pageName);
    //     if (!$S.isArray(newSupplyStatus)) {
    //         newSupplyStatus = [];
    //     }
    //     var projectSupplyStatus = this._generateFieldTable(renderData.supplyStatus, renderData.tableName, "pageName:" + pageName + ".resultPatternSupplyStatus");
    //     TemplateHelper.updateTemplateText(template, displayText);
    //     TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.statusTable", projectSupplyStatus);
    //     TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.addNew", newSupplyStatus);
    //     return template;
    // },
    // generateProjectSupplyItemList: function(pageName, renderData) {
    //     if (!$S.isObject(renderData)) {
    //         renderData = {};
    //     }
    //     if (renderData.status === "FAILURE") {
    //         return this._getInvalidField(renderData.reason);
    //     }
    //     var template = this.getTemplate("projectSupplyItems");
    //     var pName = renderData.pName;
    //     var newSupplyItem = FormHandler.getAddNewSupplyItemTemplate();
    //     var projectSupplyItems = this._generateFieldTable(renderData.supplyItem, renderData.tableName, "pageName:" + pageName + ".resultPatternSupplyItems");
    //     TemplateHelper.updateTemplateText(template, {"projectSupplyItems.pName": pName});
    //     TemplateHelper.addItemInTextArray(template, "projectSupplyItems.table", projectSupplyItems);
    //     TemplateHelper.addItemInTextArray(template, "projectSupplyItems.addNew", newSupplyItem);
    //     return template;
    // },
    getDisplayPageTemplate: function(renderData) {
        var pageField = TemplateHandlerDBView.getDbViewFieldsV2(renderData);
        var template = this.getTemplate("displayPage");
        TemplateHelper.addItemInTextArray(template, "displayPage.field", pageField);
        return template;
    },
    getViewPageTemplate: function(renderData) {
        var pageField = TemplateHandlerDBView.getDbViewFieldsV2(renderData);
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
    getGoBackLinkTemplate: function(pageName) {
        var template = this.getTemplate("goBackLink");
        var backUrl = "";
        var pid = DataHandler.getPathParamsData("pid");
        switch(pageName) {
            // case "projectStatusWork":
            // case "projectStatusSupply":
            // case "projectContingency":
            //     backUrl = this._getLink("projectId", pid);
            // break;
            // case "updateSupplyStatus":
            // case "updateContingencyStatus":
            // case "updateWorkStatus":
            //     backUrl = this._getLink("projectStatus", pid, linkRef);
            // break;
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
    // SetUserRealtedData: function() {
    //     var headingJson = Config.headingJson;
    //     var footerJson = Config.footerJson, i;
    //     var username = AppHandler.GetUserData("username", "");
    //     var enabledPageId = DataHandlerV2.getEnabledPageId();
    //     var enabledViewPage = DataHandlerV2.getEnabledViewPageName();
    //     if ($S.isString(username)) {
    //         TemplateHelper.setTemplateAttr(headingJson, "pageHeading.username", "text", username);
    //     }
    //     if ($S.isArray(enabledPageId)) {
    //         for(i=0; i<enabledPageId.length; i++) {
    //             TemplateHelper.removeClassTemplate(headingJson, "pageId:" + enabledPageId[i], "d-none");
    //             TemplateHelper.removeClassTemplate(footerJson, "pageId:" + enabledPageId[i], "d-none");
    //         }
    //     }
    //     if ($S.isArray(enabledViewPage)) {
    //         for(i=0; i<enabledViewPage.length; i++) {
    //             TemplateHelper.removeClassTemplate(headingJson, "viewPage:" + enabledViewPage[i], "d-none");
    //             TemplateHelper.removeClassTemplate(footerJson, "viewPage:" + enabledViewPage[i], "d-none");
    //         }
    //     }
    // },
    GetPageRenderField: function(dataLoadStatus, renderData, footerData, pageName) {
        var renderField;
        if (!dataLoadStatus) {
            renderField = this.getTemplate("loading");
            $S.log("loadingCount: " + (loadingCount++));
            return renderField;
        }
        var temp;
        var currentAppId = DataHandler.getData("currentList1Id", "");
        if ($S.isObject(renderData) && renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        } else {
            switch(pageName) {
                case "home":
                    renderField = this.generateHomeRenderField(pageName, renderData);
                break;
                case "projectId":
                    renderField = this.generateProjectDetailsPage(pageName, renderData);
                break;
                case "id1Page":
                    if ($S.isObject(renderData["id1Row"])) {
                        temp = CommonDataHandler.applyRoleFilter(currentAppId, [renderData["id1Row"]], "pageName:projectId.section.mapping");
                        if (!$S.isArray(temp) || temp.length === 0) {
                            return this.getTemplate("noDataFound");
                        }
                        PidPage.updateDependentAttr(pageName, [renderData["id1Row"]]);
                    }
                    renderField = this.generateId1Page(pageName, renderData);
                break;
                // case "projectStatusWork":
                // case "projectStatusSupply":
                // case "projectContingency":
                //     renderField = this.generateProjectSupplyItemList(pageName, renderData);
                // break;
                // case "updateSupplyStatus":
                // case "updateContingencyStatus":
                // case "updateWorkStatus":
                //     renderField = this.generateProjectSupplyStatus(pageName, renderData);
                // break;
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
        return [$S.clone(Config.headingJson), {"tag": "div.center", "text": $S.clone(Config.afterLoginLinkJson)}];
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
