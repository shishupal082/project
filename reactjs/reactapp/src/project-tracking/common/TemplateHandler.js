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
                homeFields.push({"toUrl": this._getLink("projectId", renderData[i].pId),
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
    _getLink: function(pageName, pId, status) {
        var link;
        if (pageName === "projectStatus") {
            link = Config.basepathname + "/pid/" + pId + "/" + status;
        } else if (pageName === "projectId") {
            link = Config.basepathname + "/pid/" + pId;
        }
        return link;
    },
    updateBtnStatus: function(template) {
        var status = DataHandler.getData("addentry.submitStatus", "");
        if (status === "in_progress") {
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "disabled");
            TemplateHelper.addClassTemplate(template, "addentry.submitStatus", "btn-secondary");
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
        var pId = DataHandler.getPathParamsData("pid");
        TemplateHelper.updateTemplateText(template, {"projectId.pName": pName});
        var projectSubLink = DataHandler.getAppData("projectSubLink", []);
        var linkTemplate, href;
        if ($S.isArray(projectSubLink)) {
            for(i=0; i<projectSubLink.length; i++) {
                href = this._getLink("projectStatus", pId, projectSubLink[i].href);
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
        TemplateHelper.addItemInTextArray(template, "projectWorkStatus.status", projectWorkStatus);
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
        var template = this.getTemplate("projectId");
        var pName = renderData.pName;
        // var pId = DataHandler.getPathParamsData("pid");
        TemplateHelper.updateTemplateText(template, {"projectId.pName": pName});
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
        TemplateHelper.updateTemplateText(footerField, {"footerLink": footerFieldHtml});
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
