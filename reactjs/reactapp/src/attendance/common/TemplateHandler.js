import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV3 from "./DataHandlerV3";
// import DataHandlerTA from "./DataHandlerTA";
// import DataHandlerAddFieldReport from "./DataHandlerAddFieldReport";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";

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
    _getLinkTemplateV2: function(toUrl, toText, templateName) {
        var linkTemplate = TemplateHandler.getTemplate(templateName);
        TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "href", toUrl);
        TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": toText});
        return linkTemplate;
    },
    generateHomeRenderField: function() {
        var homeFields = DataHandlerV3.getList2Data();
        var template = this.getTemplate("home");
        var validPages = Config.validPages;
        var linkTemplate, toUrl;
        if (homeFields.length === 0) {
            return this.getTemplate("pageDisabled");
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
    generateProjectHomeRenderField: function() {
        var appControlData = DataHandler.getData("appControlData", []);
        var template = this.getTemplate("home");
        var linkTemplate, toUrl;
        if (appControlData.length === 0) {
            return this.getTemplate("noDataFound");
        }
        for (var i = 0; i< appControlData.length; i++) {
            toUrl = DataHandler.getPageUrl(appControlData[i].id);
            linkTemplate = this._getLinkTemplateV2(toUrl, appControlData[i].name, "home.link");
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    }
});
TemplateHandler.extend({
    generateDbViewRenderFieldV5: function(renderData) {
        var renderField = this.getTemplate("addFieldReport");
        var currentAppData = DataHandler.getCurrentAppData({});
        var metaData = DataHandler.getMetaData({});
        var additionalDataRequired = $S.findParam([currentAppData, metaData], "addFieldReport.additionalDataRequired", []);
        var stations = $S.findParam([currentAppData, metaData], "addFieldReport.stations", []);
        var devices = $S.findParam([currentAppData, metaData], "addFieldReport.devices", []);
        var userIdsObj = $S.findParam([currentAppData, metaData], "addFieldReport.userIds", {});
        var currentDateTime, userIds = [];
        var temp = {}, temp2;
        if (!$S.isArray(additionalDataRequired)) {
            additionalDataRequired = [];
        }
        if (!$S.isArray(stations)) {
            stations = [];
        }
        if (!$S.isArray(devices)) {
            devices = [];
        }
        if (!$S.isObject(userIdsObj)) {
            userIdsObj = {};
        }
        for(temp2 in userIdsObj) {
            if ($S.isArray(userIdsObj[temp2])) {
                userIds = userIds.concat(userIdsObj[temp2]);
            }
        }
        userIds = userIds.sort();
        for (var i = 0; i < additionalDataRequired.length; i++) {
            TemplateHelper.removeClassTemplate(renderField, additionalDataRequired[i], "d-none");
        }
        var key = "addFieldReport.dateTime.field", value;
        if (additionalDataRequired.indexOf("addFieldReport.dateTime") >= 0) {
            value = DataHandler.getFieldsData(key, "");
            temp = {};
            if (!$S.isString(value) || value.trim().length === 0) {
                currentDateTime = DT.getDateTime("YYYY/-/MM/-/DD/ /hh/:/mm","/");
                temp[key] = currentDateTime;
                DataHandler.setFieldsData(key, currentDateTime);
            } else {
                temp[key] = value;
            }
            TemplateHelper.updateTemplateValue(renderField, temp);
        }
        temp = [{"text": "Select User...", "value": ""}];
        temp2 = [];
        key = "addFieldReport.userId.field";
        for(i=0; i<userIds.length; i++) {
            if ($S.isString(userIds[i]) && userIds[i].length > 0) {
                if (temp2.indexOf(userIds[i]) >= 0) {
                    continue;
                }
                temp2.push(userIds[i]);
                temp.push({"text": userIds[i], "value": userIds[i]});
            }
        }
        temp2 = {};
        temp2[key] = temp;
        if (additionalDataRequired.indexOf("addFieldReport.userId") >= 0) {
            TemplateHelper.updateTemplateText(renderField, temp2);
            temp2 = {};
            temp2[key] = DataHandler.getFieldsData(key, "");
            TemplateHelper.updateTemplateValue(renderField, temp2);
        }
        $S.addElAt(stations, 0, {"text": "Select station...", "value": ""});
        $S.addElAt(devices, 0, {"text": "Select device...", "value": ""});
        key = "addFieldReport.station";
        value = DataHandler.getFieldsData(key, "");
        temp2 = {};
        temp = {};
        temp2[key] = value;
        temp[key] = stations;
        TemplateHelper.updateTemplateText(renderField, temp);
        TemplateHelper.updateTemplateValue(renderField, temp2);

        key = "addFieldReport.device";
        value = DataHandler.getFieldsData(key, "");
        temp2 = {};
        temp = {};
        temp[key] = devices;
        temp2[key] = value;
        TemplateHelper.updateTemplateText(renderField, temp);
        TemplateHelper.updateTemplateValue(renderField, temp2);


        key = "addFieldReport.comment";
        value = DataHandler.getFieldsData(key, "");
        temp2 = {};
        temp2[key] = value;
        TemplateHelper.updateTemplateValue(renderField, temp2);
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var submitBtnName = "addFieldReport.submit";
        if (formSubmitStatus === "in_progress") {
            TemplateHelper.removeClassTemplate(renderField, submitBtnName, "btn-primary");
            TemplateHelper.addClassTemplate(renderField, submitBtnName, "btn-link disabled");
        } else {
            TemplateHelper.addClassTemplate(renderField, submitBtnName, "btn-primary");
            TemplateHelper.removeClassTemplate(renderField, submitBtnName, "btn-link disabled");
        }
        return renderField;
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
        var sortingFields = DataHandler.getData("sortingFields", []);
        var pageName1 = DataHandler.getData("pageName", "");
        if (pageName1 === Config.home) {
            renderField = this.generateHomeRenderField();
        } else if (pageName1 === Config.projectHome) {
            renderField = this.generateProjectHomeRenderField();
        } else if (pageName1 === Config.otherPages && DataHandlerV3.isPageDisabled(pageName)) {
            renderField = this.getTemplate("noMatch");
        } else {
            switch(pageName) {
                case "entry":
                case "update":
                case "summary":
                    renderField = DBViewTemplateHandler.generateDbViewRenderFieldV2(renderData, true, "tableDataV2", sortingFields);
                break;
                case "ta":
                    renderField = DBViewTemplateHandler.generateDbViewRenderFieldV2(renderData, true, "tableData", sortingFields);
                break;
                case "dbview":
                case "custom_dbview":
                case "dbview_summary":
                    renderField = renderData;
                break;
                case "add_field_report":
                    renderField = this.generateDbViewRenderFieldV5(renderData);
                break;
                case "noMatch":
                default:
                    renderField = this.getTemplate("noMatch");
                break;
            }
        }
        var metaData = DataHandler.getMetaData({});
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
