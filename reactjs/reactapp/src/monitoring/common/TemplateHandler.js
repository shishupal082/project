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
    getPageRenderField: function(pageName) {
        return TemplateHandler.getTemplate(pageName);
    },
    "entry": function(pageName) {
        var data = DataHandler.getData("csvData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = TemplateHandler.getTemplate(pageName);
        var firstRow = TemplateHandler.getTemplate("entry.data.firstRow");
        TemplateHelper.addItemInTextArray(renderField, "entry.data.firstRow", firstRow);
        for(var i=0; i<data.length; i++) {
            data[i]["s.no."] = i+1;
            var rowTemplate = TemplateHandler.getTemplate("entry.data");
            TemplateHelper.updateTemplateText(rowTemplate, data[i]);
            TemplateHelper.addItemInTextArray(renderField, "entry.data", rowTemplate);
        }
        return renderField;
    },
    "entrybydate": function(pageName) {
        var data = DataHandler.getData("renderData", []);
        if (!$S.isArray(data) || data.length < 1) {
            return TemplateHandler.getTemplate("noDataFound");
        }
        var renderField = [], sNo=0;
        for (var i = data.length-1; i >=0 ; i--) {
            var template = TemplateHandler.getTemplate(pageName);
            TemplateHelper.setTemplateAttr(template, "date", "text", data[i].dateHeading);
            if (data[i].items) {
                var rowTemplate = TemplateHandler.getTemplate("entry.data.firstRow");
                TemplateHelper.addItemInTextArray(template, "entrybydate.data", rowTemplate);
                sNo = 1;
                for (var j = data[i]["items"].length-1; j >= 0; j--) {
                    data[i]["items"][j]["s.no."] = sNo++;
                    rowTemplate = TemplateHandler.getTemplate("entry.data");
                    TemplateHelper.updateTemplateText(rowTemplate, data[i]["items"][j]);
                    TemplateHelper.addItemInTextArray(template, "entrybydate.data", rowTemplate);
                }
            }
            renderField.push(template);
        }


        // for(var i=0; i<data.length; i++) {
        //     data[i]["s.no."] = i+1;
        //     var rowTemplate = TemplateHandler.getTemplate("entry.data");
        //     TemplateHelper.updateTemplateText(rowTemplate, data[i]);
        //     TemplateHelper.addItemInTextArray(renderField, "entry.data", rowTemplate);
        // }
        return renderField;
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
