import $S from "../../interface/stack.js";
import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";


import Template from "./Template";
import DataHandler from "./DataHandler";

var TemplateHandlerV2;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
TemplateHandlerV2 = function(arg) {
    return new TemplateHandlerV2.fn.init(arg);
};
TemplateHandlerV2.fn = TemplateHandlerV2.prototype = {
    constructor: TemplateHandlerV2,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(TemplateHandlerV2);

TemplateHandlerV2.extend({
    getTemplate: function(name) {
        return AppHandler.getTemplate(Template, name);
    },
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
    _generateTr: function(trData, rowIndex) {
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
    _generateFirstTr: function(trData) {
        var renderFieldTr = this.getTemplate("dbviewField.tr");
        var i, tdField, isSortable, sortingFields, tdText, isFound;
        var defaultClassName = "btn", className, additionalClassName;
        var isValidTr = false;
        var tdClassName = "";
        if (!$S.isArray(trData)) {
            trData = [];
        }
        sortingFields = DataHandler.getData("sortingFields", []);
        if (trData.length > 0) {
            tdField = {"tag": "td.b", "text": "S.No."};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        if (!$S.isArray(sortingFields)) {
            sortingFields = [];
        }
        for (i=0; i<trData.length; i++) {
            if ($S.isObject(trData[i]) && $S.isBooleanTrue(trData[i].hidden)) {
                continue;
            }
            isValidTr = true;
            isSortable = $S.findParam([trData[i]], "isSortable", false);
            if ($S.isBooleanTrue(isSortable)) {
                isFound = $S.searchItems([trData[i].name], sortingFields, false, false, "i",
                    function(searchingPattern, el, i, arr, searchByPattern, isRevert, modifier) {
                        if (!$S.isObject(el)) {
                            return false;
                        }
                        if (searchingPattern.indexOf(el.name) >= 0) {
                            return true;
                        }
                        return false;
                    }
                );
                if (isFound.length > 0 && $S.isObject(isFound[0])) {
                    if (isFound[0].value === "descending") {
                        additionalClassName = " btn-primary";
                    } else {
                        additionalClassName = " btn-secondary";
                    }
                } else {
                    additionalClassName = " btn-light";
                }
                className = defaultClassName + additionalClassName;
                tdText = [{"tag": "button.b", "className": className, "name": "sortable", "value": trData[i].name, "text": AppHandler.getHeadingText(trData[i])}];
            } else {
                tdText = [{"tag": "b", "text": trData[i].heading}];
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


TemplateHandlerV2.extend({
    generateFinalTable: function(dbData, resultPattern) {
        var i, j, t1, t1Name;
        var finalTable = [], temp, tableName;
        if (!$S.isObject(dbData)) {
            dbData = [];
        }
        if (!$S.isArray(resultPattern)) {
            resultPattern = [];
        }
        for(tableName in dbData) {
            t1 = dbData[tableName];
            if ($S.isArray(t1)) {
                for(i=0; i<t1.length; i++) {
                    temp = $S.clone(resultPattern);
                    for (j=0; j<temp.length; j++) {
                        t1Name = temp[j].tableName;
                        if (tableName === t1Name) {
                            temp[j].value = t1[i][temp[j].name];
                        }
                    }
                    finalTable.push(temp);
                }
            }
        }
        return finalTable;
    },
    generateTableHtml: function(renderData, patternName) {
        var resultPattern = DataHandler.getAppData(patternName);
        var dbData = {};
        if ($S.isArray(renderData) && renderData.length > 0) {
            dbData[renderData[0].table_name] = renderData;
        }
        var finalTable = this.generateFinalTable(dbData, resultPattern);
        if (!$S.isArray(resultPattern) || resultPattern.length === 0) {
            return [];
        }
        var renderField = this.getTemplate("tableDataV2");
        var renderFieldTr, i;
        if ($S.isArray(finalTable) && finalTable.length > 0) {
            for (i = 0; i < finalTable.length; i++) {
                if (i===0) {
                    renderFieldTr = this._generateFirstTr(finalTable[i]);
                    TemplateHelper.addItemInTextArray(renderField, "tableData.table.tr", renderFieldTr);
                }
                renderFieldTr = this._generateTr(finalTable[i], i);
                TemplateHelper.addItemInTextArray(renderField, "tableData.table.tr", renderFieldTr);
            }
        } else {
            renderField = null;
        }
        return renderField;

    }
});

})($S);

export default TemplateHandlerV2;
