import $S from "../../interface/stack.js";
// import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV2 from "./DataHandlerV2";
// import DataHandlerTA from "./DataHandlerTA";

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
    generateHomeRenderField: function() {
        var homeFields = DataHandlerV2.getList2Data();
        var template = this.getTemplate("home");
        for (var i = 0; i< homeFields.length; i++) {
            var linkTemplate = TemplateHandler.getTemplate("home.link");
            TemplateHelper.setTemplateAttr(linkTemplate, "home.link.toUrl", "url", homeFields[i].toUrl);
            TemplateHelper.updateTemplateText(linkTemplate, {"home.link.toText": homeFields[i].toText});
            TemplateHelper.addItemInTextArray(template, "home.link", linkTemplate);
        }
        return template;
    }
});
TemplateHandler.extend({
    _getTdText: function(tdData) {
        if (!$S.isObject(tdData)) {
            return tdData;
        }
        var value = $S.findParam([tdData], "value", "");
        var fieldName = $S.findParam([tdData], "fieldName", "");
        var text = $S.findParam([tdData], "text", "");
        var wordBreak = $S.findParam([tdData], "wordBreak", "");
        var wordBreakTag = $S.findParam([tdData], "wordBreakTag", "");
        var temp = {};
        if ($S.isString(wordBreak) && wordBreak.length > 0) {
            if (!$S.isString(wordBreakTag) || wordBreakTag.length === 0) {
                wordBreakTag = "li";
            }
            if (!$S.isString(value)) {
                value = "";
            }
            value = value.split(";").map(function(el,i, arr) {
                return {"tag": wordBreakTag, "text": el.trim()};
            });
        }
        if ($S.isObject(text) || $S.isArray(text)) {
            temp[fieldName] = value;
            TemplateHelper.updateTemplateText(text, temp);
            return text;
        }
        return value;
    },
    _generateTr: function(trData, isSortableFieldRequired, rowIndex) {
        var renderFieldTr = this.getTemplate("dbviewField.tr");
        var i, tdField, temp, isValidTr = false, tdClassName;
        if (!$S.isArray(trData)) {
            trData = [];
        }
        if (trData.length > 0) {
            tdField = {"tag": "td.b", "text": rowIndex+1};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        for (i=0; i<trData.length; i++) {
            if ($S.isObject(trData[i]) && $S.isBooleanTrue(trData[i].hidden)) {
                continue;
            }
            isValidTr = true;
            tdClassName = $S.findParam([trData[i]], "className", "");
            temp = this._getTdText(trData[i]);
            tdField = {"tag": "td", "text": temp, "className": tdClassName};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        if (!isValidTr) {
            renderFieldTr = [];
        }
        return renderFieldTr;
    },
    _generateFirstTr: function(trData, isSortableFieldRequired) {
        var renderFieldTr = this.getTemplate("dbviewField.tr");
        var i, tdField, isSortable, sortableValue, tdText;
        var defaultClassName = "btn btn-light", className, additionalClassName;
        var isValidTr = false;
        var tdClassName = "";
        if (!$S.isArray(trData)) {
            trData = [];
        }
        sortableValue = DataHandler.getData("sortable", "");
        if (trData.length > 0) {
            tdField = {"tag": "td.b", "text": "S.No."};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        for (i=0; i<trData.length; i++) {
            if ($S.isObject(trData[i]) && $S.isBooleanTrue(trData[i].hidden)) {
                continue;
            }
            isValidTr = true;
            isSortable = $S.findParam([trData[i]], "isSortable", false);
            if ($S.isBooleanTrue(isSortable) && $S.isBooleanTrue(isSortableFieldRequired)) {
                if (sortableValue === trData[i].name) {
                    additionalClassName = " active";
                } else {
                    additionalClassName = "";
                }
                className = defaultClassName + additionalClassName;
                tdText = [{"tag": "button.b", "className": className, "name": "sortable", "value": trData[i].name, "text": AppHandler.getHeadingText(trData[i])}];
            } else {
                tdText = [{"tag": "b", "text": AppHandler.getHeadingText(trData[i])}];
            }
            tdClassName = $S.findParam([trData[i]], "className", "");
            tdField = {"tag": "td", "text": tdText, "className": tdClassName};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        if (!isValidTr) {
            renderFieldTr = [];
        }
        return renderFieldTr;
    }
});

TemplateHandler.extend({
    generateIndividualTableV2: function(renderData, isSortableFieldRequired, tableTemplateName) {
        var renderField = this.getTemplate(tableTemplateName);
        var renderFieldTr, i;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = 0; i < renderData.length; i++) {
                if (i===0) {
                    renderFieldTr = this._generateFirstTr(renderData[i], isSortableFieldRequired);
                    TemplateHelper.addItemInTextArray(renderField, "tableData.table.tr", renderFieldTr);
                }
                renderFieldTr = this._generateTr(renderData[i], isSortableFieldRequired, i);
                TemplateHelper.addItemInTextArray(renderField, "tableData.table.tr", renderFieldTr);
            }
        } else {
            renderField = null;
        }
        return renderField;
    },
    generateDbViewRenderFieldV2: function(renderData, isSortableFieldRequired, tableTemplateName) {
        var renderField = this.getTemplate("dbviewField");
        var tableView, tableField, i, tableHeading;
        var isTableAdded = false;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = 0; i < renderData.length; i++) {
                if (!$S.isObject(renderData[i])) {
                    continue;
                }
                tableView = this.getTemplate("tableView", []);
                tableHeading = renderData[i].tableHeading;
                if ($S.isString(tableHeading) && tableHeading.length > 0) {
                    TemplateHelper.updateTemplateText(tableView, {"tableHeading": renderData[i].tableHeading});
                } else {
                    TemplateHelper.addClassTemplate(tableView, "reload", "d-none");
                }
                tableField = this.generateIndividualTableV2(renderData[i].tableData, isSortableFieldRequired, tableTemplateName);
                if (tableField !== null) {
                    isTableAdded = true;
                    TemplateHelper.addItemInTextArray(tableView, "tableData", tableField);
                    TemplateHelper.addItemInTextArray(renderField, "tableView", tableView);
                }
            }
        }
        if (!isTableAdded) {
            renderField = this.getTemplate("noDataFound");
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
        if (!dataLoadStatus) {
            return this.getTemplate("loading");
        }
        var renderField;
        if (DataHandlerV2.isPageDisabled(pageName)) {
            renderField = this.getTemplate("noMatch");
        } else {
            switch(pageName) {
                case "entry":
                case "update":
                case "summary":
                    renderField = this.generateDbViewRenderFieldV2(renderData, true, "tableDataV2");
                break;
                case "ta":
                case "dbview":
                    renderField = this.generateDbViewRenderFieldV2(renderData, true, "tableData");
                break;
                case "home":
                    renderField = this.generateHomeRenderField();
                break;
                case "noMatch":
                default:
                    renderField = this.getTemplate("noMatch");
                break;
            }
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
