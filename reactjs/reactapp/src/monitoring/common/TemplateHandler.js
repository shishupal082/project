import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";

var TemplateHandler;
(function($S){

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
    getTemplate: function(pageName) {
        if (Template[pageName]) {
            return $S.clone(Template[pageName]);
        }
        return $S.clone(Template["noDataFound"]);
    }
});

TemplateHandler.extend({
    setEntryTableHeadingJson: function() {
        var metaData = DataHandler.getData("metaData");
        if ($S.isArray(metaData.entryTableHeadingTr)) {
            if ($S.isArray(Template["entry.table.headingTr"])) {
                Template["entry.table.headingTr"] = metaData.entryTableHeadingTr;
            }
        }
    }
});


TemplateHandler.extend({
    generateEntryTable: function(entryData) {
        if (!$S.isArray(entryData) || entryData.length < 1) {
            return [];
        }
        var entryTable = TemplateHandler.getTemplate("entry.table");
        var entryTableHeadingTr = TemplateHandler.getTemplate("entry.table.headingTr");
        TemplateHelper.setTemplateAttr(entryTable, "entry.table.headingTr", "text", entryTableHeadingTr);
        var sNo = 1;
        for(var i=entryData.length-1; i>=0; i--) {
            entryData[i]["s.no."] = sNo++;
            var rowTemplate = TemplateHandler.getTemplate("entry.table.tr");
            TemplateHelper.updateTemplateText(rowTemplate, entryData[i]);
            TemplateHelper.addItemInTextArray(entryTable, "entry.table.tr", rowTemplate);
        }
        return entryTable;
    },
    _generateSummaryFieldTr: function(availableData, summaryFieldData, getDisplayTextMethod, ref) {
        var trTemplate = [];
        var tr, trData;
        for (var i = 0; i < availableData.length; i++) {
            if (summaryFieldData[availableData[i]]) {
                tr = TemplateHandler.getTemplate("summary.data.table.tr");
                trData = {"summary.data.table.tr.s.no.": (ref.sNo)++};
                trData["summary.data.table.tr.variable"] = getDisplayTextMethod(availableData[i]);
                trData["summary.data.table.tr.count"] = summaryFieldData[availableData[i]].length;
                TemplateHelper.updateTemplateText(tr, trData);
                trTemplate.push(tr);
            }
        }
        return trTemplate;
    },
    generateSummaryTables: function(summaryData) {
        var typeData = {}, stationData = {}, deviceData = {}, userData = {};
        for (var i = 0; i < summaryData.length; i++) {
            if (userData[summaryData[i].username]) {
                userData[summaryData[i].username].push(summaryData[i]);
            } else {
                userData[summaryData[i].username] = [summaryData[i]];
            }
            if (typeData[summaryData[i].type]) {
                typeData[summaryData[i].type].push(summaryData[i]);
            } else {
                typeData[summaryData[i].type] = [summaryData[i]];
            }
            if (stationData[summaryData[i].station]) {
                stationData[summaryData[i].station].push(summaryData[i]);
            } else {
                stationData[summaryData[i].station] = [summaryData[i]];
            }
            if (deviceData[summaryData[i].device]) {
                deviceData[summaryData[i].device].push(summaryData[i]);
            } else {
                deviceData[summaryData[i].device] = [summaryData[i]];
            }
        }
        var availableUsers = DataHandler.getValidUsers();
        var availableTypes = DataHandler.getValidTypes();
        var availableStations = DataHandler.getValidStation();
        var availableDevices = DataHandler.getValidDevice();
        var ref = {"sNo": 1};
        var summaryTable = TemplateHandler.getTemplate("summary.data.table");
        TemplateHelper.addItemInTextArray(summaryTable, "summary.data.table.tr", TemplateHandler._generateSummaryFieldTr(availableUsers, userData, DataHandler.getDisplayUsername, ref));
        TemplateHelper.addItemInTextArray(summaryTable, "summary.data.table.tr", TemplateHandler._generateSummaryFieldTr(availableStations, stationData, DataHandler.getDisplayStation, ref));
        TemplateHelper.addItemInTextArray(summaryTable, "summary.data.table.tr", TemplateHandler._generateSummaryFieldTr(availableTypes, typeData, DataHandler.getDisplayType, ref));
        TemplateHelper.addItemInTextArray(summaryTable, "summary.data.table.tr", TemplateHandler._generateSummaryFieldTr(availableDevices, deviceData, DataHandler.getDisplayDevice, ref));
        return summaryTable;
    },
    generateEntryByDateField: function(data) {
        if (!$S.isArray(data) || data.length < 1) {
            return [];
        }
        var renderField = [];
        for (var i = data.length-1; i >=0 ; i--) {
            var template = TemplateHandler.getTemplate("entrybydate");
            TemplateHelper.setTemplateAttr(template, "date", "text", data[i].dateHeading);
            TemplateHelper.addItemInTextArray(template, "entrybydate.entry.table", TemplateHandler.generateEntryTable(data[i].items));
            renderField.push(template);
        }
        return renderField;
    },
    updateUploadTemplateData: function(template) {
        if (!$S.isArray(template)) {
            return;
        }
        var subject = DataHandler.getData("addentry.subject", "");
        var heading = DataHandler.getData("addentry.heading", "");
        var comment = DataHandler.getData("addentry.textarea", "");
        var percentageComplete = DataHandler.getData("addentry.fileUploadPercentage", "");
        // var filename = "";
        // var file = DataHandler.getData("addentry.file", "", true);

        // if ($S.isObject(file) && $S.isString(file.name)) {
        //     filename = file.name;
        // }
        if ($S.isNumeric(percentageComplete)) {
            percentageComplete += "% Completed";
        }
        var dataSetValue = {};
        dataSetValue["addentry.subject"] = subject;
        dataSetValue["addentry.textarea"] = comment;
        dataSetValue["addentry.heading"] = heading;
        // dataSetValue["addentry.file"] = filename;
        TemplateHelper.updateTemplateValue(template, dataSetValue);
        var dataSetText = {};
        var fileUploadInstruction = Config.getPageData("uploadFileInstruction", "");
        var commentInstruction = Config.getPageData("uploadTextInstruction", "");
        dataSetText["addentry.textarea.message"] = commentInstruction;
        dataSetText["addentry.uploadfile.message"] = fileUploadInstruction;
        dataSetText["addentry.complete-status"] = percentageComplete;
        TemplateHelper.updateTemplateText(template, dataSetText);

        var availableStations = DataHandler.getAvailableStation();
        var availableDevices = DataHandler.getAvailableDevice();
        var i;
        for (i = 0; i < availableStations.length; i++) {
            TemplateHelper.addItemInTextArray(template, "addentry.subject", {
                "text": availableStations[i].name,
                "value": availableStations[i].id
            });
        }
        for (i = 0; i < availableDevices.length; i++) {
            TemplateHelper.addItemInTextArray(template, "addentry.heading", {
                "text": availableDevices[i].name,
                "value": availableDevices[i].id
            });
        }
        var formSubmitStatus = DataHandler.getData("addentry.submitStatus", "");
        var submitBtnName = "addentry.submit";
        if (formSubmitStatus === "in_progress") {
            TemplateHelper.removeClassTemplate(template, submitBtnName, "btn-primary");
            TemplateHelper.addClassTemplate(template, submitBtnName, "btn-link disabled");
        } else {
            TemplateHelper.addClassTemplate(template, submitBtnName, "btn-primary");
            TemplateHelper.removeClassTemplate(template, submitBtnName, "btn-link disabled");
        }
    },
    /*
    generateFilter: function(data) {
        var template = TemplateHandler.getTemplate("entrybydatefilter.filter");
        var selectedStation, selectedType, selectedDevice;
        selectedStation = DataHandler.getData("selectedStation", "");
        selectedType = DataHandler.getData("selectedType", "");
        selectedDevice = DataHandler.getData("selectedDevice", "");
        var values = {"selectedStation": selectedStation, "selectedType": selectedType, "selectedDevice": selectedDevice};
        TemplateHelper.updateTemplateValue(template, values);
        var availableStations, availableTypes, availableDevices, temp, i;
        availableStations = DataHandler.getAvailableStation();
        availableTypes = DataHandler.getAvailableTypes();
        availableDevices = DataHandler.getAvailableDevice();
        for (i = 0; i < availableStations.length; i++) {
            temp = {"value": availableStations[i].id, "text": availableStations[i].name, "tag": "option"};
            TemplateHelper.addItemInTextArray(template, "selectedStation", temp);
        }
        for (i = 0; i < availableTypes.length; i++) {
            temp = {"value": availableTypes[i].id, "text": availableTypes[i].name, "tag": "option"};
            TemplateHelper.addItemInTextArray(template, "selectedType", temp);
        }
        for (i = 0; i < availableDevices.length; i++) {
            temp = {"value": availableDevices[i].id, "text": availableDevices[i].name, "tag": "option"};
            TemplateHelper.addItemInTextArray(template, "selectedDevice", temp);
        }
        return template;
    }
    */
});

TemplateHandler.extend({
    getAppHedingTemplate: function(pageName) {
        var template = TemplateHandler.getTemplate("pageHeading");
        var sectionName = DataHandler.getData("sectionName", "");
        var templateData = {
            "pageHeading.text": sectionName,
            "pageHeading.username": AppHandler.GetUserData("username", "")
        };
        TemplateHelper.updateTemplateText(template, templateData);
        return template;
    },
    getPageRenderField: function(pageName) {
        return TemplateHandler.getTemplate(pageName);
    },
    "home": function(pageName) {
        var homeFields = DataHandler.getData("homeFields", []);
        var template = TemplateHandler.getTemplate(pageName);
        for (var i = 0; i< homeFields.length; i++) {
            var linkTemplate = TemplateHandler.getTemplate("home.link");
            TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "url", homeFields[i].toUrl);
            TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": homeFields[i].toText});
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    },
    "entry": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        return TemplateHandler.generateEntryTable(data);
    },
    "entrybydate": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        return TemplateHandler.generateEntryByDateField(data);
    },
    "entrybytype": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = [];
        for (var i = 0; i<data.length; i++) {
            var template = TemplateHandler.getTemplate("entrybyFieldName");
            TemplateHelper.updateTemplateText(template, {"entrybyFieldName.fieldName": data[i].fieldNameDisplay});
            for (var j = data[i]["data"].length-1; j>=0; j--) {
                var template2 = TemplateHandler.getTemplate("entrybyFieldName.items");
                TemplateHelper.updateTemplateText(template2, {"entrybyFieldName.items.date": data[i]["data"][j].dateHeading});
                TemplateHelper.addItemInTextArray(template2, "entrybyFieldName.items.entry.table", TemplateHandler.generateEntryTable(data[i]["data"][j]["items"]));
                TemplateHelper.addItemInTextArray(template, "entrybyFieldName.items", template2);
            }
            renderField.push(template);
        }
        return renderField;
    },
    "entrybystation": function(pageName) {
        return TemplateHandler["entrybytype"](pageName);
    },
    "entrybydevice": function(pageName) {
        return TemplateHandler["entrybytype"](pageName);
    },
    "summary": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = TemplateHandler.getTemplate(pageName);
        for(var i=data.length-1; i>=0; i--) {
            var dataTemplate = TemplateHandler.getTemplate("summary.data");
            TemplateHelper.updateTemplateText(dataTemplate, {"summary.data.dateHeading": data[i].dateHeading});
            TemplateHelper.addItemInTextArray(dataTemplate, "summary.data.table", TemplateHandler.generateSummaryTables(data[i].items));
            TemplateHelper.addItemInTextArray(renderField, "summary.data", dataTemplate);
        }
        return renderField;
    },
    "entrybydatefilter": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        var renderField;
        if (!$S.isArray(data) || data.length < 1) {
            renderField = TemplateHandler.getTemplate("noDataFound");
        } else {
            renderField = TemplateHandler.generateEntryByDateField(data);
        }
        /*
        var template = TemplateHandler.getTemplate(pageName);
        TemplateHelper.addItemInTextArray(template, "entrybydatefilter.filter", TemplateHandler.generateFilter(data));
        TemplateHelper.addItemInTextArray(template, "entrybydatefilter.entrybydate", renderField);
        return template;
        */
        return renderField;
    },
    "addentry": function(pageName) {
        var template = TemplateHandler.getTemplate("addentry");
        var templateData = {};
        templateData["addentry.form-heading"] = "Add Entry";
        TemplateHelper.updateTemplateText(template, templateData);
        TemplateHelper.addClassTemplate(template, "addentry.uploadfile-field", "d-none");
        TemplateHelper.removeClassTemplate(template, "addentry.addentry-field", "d-none");
        this.updateUploadTemplateData(template);
        return template;
    },
    "uploadfile": function(pageName) {
        var template = TemplateHandler.getTemplate("addentry");
        var templateData = {};
        templateData["addentry.form-heading"] = "Upload File";
        TemplateHelper.updateTemplateText(template, templateData);
        TemplateHelper.removeClassTemplate(template, "addentry.uploadfile-field", "d-none");
        TemplateHelper.addClassTemplate(template, "addentry.addentry-field", "d-none");
        this.updateUploadTemplateData(template);
        return template;
    }
});

})($S);

export default TemplateHandler;
