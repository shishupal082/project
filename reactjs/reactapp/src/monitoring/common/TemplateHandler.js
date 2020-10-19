import $S from "../../interface/stack.js";
// import Config from "./Config";
import DataHandler from "./DataHandler";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";

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
    generateEntryTable: function(entryData) {
        if (!$S.isArray(entryData) || entryData.length < 1) {
            return [];
        }
        var entryTable = TemplateHandler.getTemplate("entry.table");
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
        var typeData = {}, stationData = {}, deviceData = {};
        for (var i = 0; i < summaryData.length; i++) {
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
        var availableTypes = DataHandler.getValidTypes();
        var availableStations = DataHandler.getValidStation();
        var availableDevices = DataHandler.getValidDevice();
        var ref = {"sNo": 1};
        var summaryTable = TemplateHandler.getTemplate("summary.data.table");
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
});

TemplateHandler.extend({
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
        var template = TemplateHandler.getTemplate(pageName);
        var renderField;
        if (!$S.isArray(data) || data.length < 1) {
            renderField = TemplateHandler.getTemplate("noDataFound");
        } else {
            renderField = TemplateHandler.generateEntryByDateField(data);
        }
        TemplateHelper.addItemInTextArray(template, "entrybydatefilter.filter", TemplateHandler.generateFilter(data));
        TemplateHelper.addItemInTextArray(template, "entrybydatefilter.entrybydate", renderField);
        return template;
    }
});

})($S);

export default TemplateHandler;
