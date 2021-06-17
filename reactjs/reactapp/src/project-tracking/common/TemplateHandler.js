import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
// import DataHandlerV2 from "./DataHandlerV2";
import TemplateHandlerV2 from "./TemplateHandlerV2";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";

var TemplateHandler;
(function($S){
var DT = $S.getDT();
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
        var newProjectTemplate = this.getTemplate("home.addNewProject");
        TemplateHelper.addItemInTextArray(template, "home.addNewProject", newProjectTemplate);
        return template;
    }
});
TemplateHandler.extend({
    _generateFieldTable: function(tableData, fieldPattenrName) {
        return TemplateHandlerV2.generateTableHtml(tableData, fieldPattenrName);
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
    updateBtnStatus: function(template) {
        var status = DataHandler.getData("addentry.submitStatus", "");
        if (status === "in_progress") {
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "btn-secondary disabled");
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "btn-primary");
        } else {
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "disabled");
            TemplateHelper.removeClassTemplate(template, "addentry.submitStatus", "btn-secondary");
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "btn-primary");
        }
    },
    generateProjectDetailsPage: function(renderData) {
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
        return template;
    },
    getAddNewWorkTemplate: function() {
        var newWorkStatus = this.getTemplate("newWorkStatus");
        var requiredKeys = [Config.fieldsKey.DateKey, Config.fieldsKey.DistanceKey,
                            Config.fieldsKey.RemarksKey, Config.fieldsKey.SectionKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var formValues = {};
        for (var i=0; i<requiredKeys.length; i++) {
            formValues[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        if (!AppHandler.isValidDateStr(formValues[Config.fieldsKey.DateKey])) {
            formValues[Config.fieldsKey.DateKey] = DT.getDateTime("YYYY/-/MM/-/DD","/");
            DataHandler.setFieldsData(Config.fieldsKey.DateKey, formValues[Config.fieldsKey.DateKey]);
        }
        TemplateHelper.updateTemplateValue(newWorkStatus, formValues);
        this.updateBtnStatus(newWorkStatus);
        return newWorkStatus;
    },
    getAddNewSupplyTemplate: function() {
        var addSupplyStatus = this.getTemplate("addSupplyStatus");
        var requiredKeys = [Config.fieldsKey.DateKey, Config.fieldsKey.supplyDiscription,
                            Config.fieldsKey.RemarksKey];
        var fieldsData = DataHandler.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        var formValues = {}, formText = {};
        for (var i=0; i<requiredKeys.length; i++) {
            formValues[requiredKeys[i]] = fieldsData[requiredKeys[i]];
        }
        if (!AppHandler.isValidDateStr(formValues[Config.fieldsKey.DateKey])) {
            formValues[Config.fieldsKey.DateKey] = DT.getDateTime("YYYY/-/MM/-/DD","/");
            DataHandler.setFieldsData(Config.fieldsKey.DateKey, formValues[Config.fieldsKey.DateKey]);
        }
        TemplateHelper.updateTemplateValue(addSupplyStatus, formValues);
        var supplyDiscriptionTemplate = DataHandler.getAppData(Config.fieldsKey.supplyDiscription, []);
        if (!$S.isArray(supplyDiscriptionTemplate)) {
            supplyDiscriptionTemplate = [];
        }
        formText[Config.fieldsKey.supplyDiscription] = supplyDiscriptionTemplate;
        TemplateHelper.updateTemplateText(addSupplyStatus, formText);
        this.updateBtnStatus(addSupplyStatus);
        return addSupplyStatus;
    },
    generateProjectWorkStatus: function(renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        }
        var template = this.getTemplate("projectWorkStatus");
        var pName = renderData.pName;
        var newWorkStatus = this.getAddNewWorkTemplate();
        if (!$S.isArray(newWorkStatus)) {
            newWorkStatus = [];
        }
        var projectWorkStatus = this._generateFieldTable(renderData.workStatus, "resultPatternWorkStatus");
        TemplateHelper.updateTemplateText(template, {"projectWorkStatus.pName": pName});
        TemplateHelper.addItemInTextArray(template, "projectWorkStatus.statusTable", projectWorkStatus);
        TemplateHelper.addItemInTextArray(template, "projectWorkStatus.addNew", newWorkStatus);
        return template;
    },
    generateProjectSupplyStatus: function(renderData) {
        if (!$S.isObject(renderData)) {
            renderData = {};
        }
        if (renderData.status === "FAILURE") {
            return this._getInvalidField(renderData.reason);
        }
        var template = this.getTemplate("projectSupplyStatus");
        var pName = renderData.pName;
        var newSupplyStatus = this.getAddNewSupplyTemplate();
        if (!$S.isArray(newSupplyStatus)) {
            newSupplyStatus = [];
        }
        var projectSupplyStatus = this._generateFieldTable(renderData.supplyStatus, "resultPatternSupplyStatus");
        TemplateHelper.updateTemplateText(template, {"projectSupplyStatus.pName": pName});
        TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.statusTable", projectSupplyStatus);
        TemplateHelper.addItemInTextArray(template, "projectSupplyStatus.addNew", newSupplyStatus);
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
            case "projectStatusWork":
            case "projectStatusSupply":
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
    SetHeadingUsername: function(username) {
        var heading = this.getTemplate("heading");
        if ($S.isString(username)) {
            TemplateHelper.setTemplateAttr(heading, "pageHeading.username", "text", username);
            Template["heading"] = heading;
            return true;
        }
        return false;
    },
    GetPageRenderField: function(dataLoadStatus, renderData, footerData, pageName) {
        var renderField;
        if (!dataLoadStatus) {
            renderField = this.getTemplate("loading");
            $S.log("loadingCount: " + (loadingCount++));
            return renderField;
        }
        switch(pageName) {
            case "home":
                renderField = this.generateHomeRenderField(renderData);
            break;
            case "projectId":
                renderField = this.generateProjectDetailsPage(renderData);
            break;
            case "projectStatusWork":
                renderField = this.generateProjectWorkStatus(renderData);
            break;
            case "projectStatusSupply":
                renderField = this.generateProjectSupplyStatus(renderData);
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
        TemplateHelper.updateTemplateText(renderField, {"heading-text": headingText});
        return renderField;
    }
});

})($S);

export default TemplateHandler;
