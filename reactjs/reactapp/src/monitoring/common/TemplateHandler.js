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
        for(var i=0; i<entryData.length; i++) {
            entryData[i]["s.no."] = i+1;
            var rowTemplate = TemplateHandler.getTemplate("entry.table.tr");
            TemplateHelper.updateTemplateText(rowTemplate, entryData[i]);
            TemplateHelper.addItemInTextArray(entryTable, "entry.table.tr", rowTemplate);
        }
        return entryTable;
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
        var data = DataHandler.getData("csvData", []);
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
        var renderField = [];
        for (var i = data.length-1; i >=0 ; i--) {
            var template = TemplateHandler.getTemplate(pageName);
            TemplateHelper.setTemplateAttr(template, "date", "text", data[i].dateHeading);
            TemplateHelper.addItemInTextArray(template, "entrybydate.entry.table", TemplateHandler.generateEntryTable(data[i].items));
            renderField.push(template);
        }
        return renderField;
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
        var data = DataHandler.getData("csvData", []);
        if (!$S.isArray(data)) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = TemplateHandler.getTemplate(pageName);
        // for(var i=0; i<data.length; i++) {
        //     data[i]["s.no."] = i+1;
        //     var rowTemplate = TemplateHandler.getTemplate("entry.data");
        //     TemplateHelper.updateTemplateText(rowTemplate, data[i]);
        //     TemplateHelper.addItemInTextArray(renderField, "entry.data", rowTemplate);
        // }
        return renderField;
    }
});

})($S);

export default TemplateHandler;
