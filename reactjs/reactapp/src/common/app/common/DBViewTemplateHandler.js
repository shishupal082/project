import $S from "../../../interface/stack.js";

import TemplateHelper from "../../TemplateHelper";

import DBViewTemplate from "./DBViewTemplate";

var DBViewTemplateHandler;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
DBViewTemplateHandler = function(arg) {
    return new DBViewTemplateHandler.fn.init(arg);
};
DBViewTemplateHandler.fn = DBViewTemplateHandler.prototype = {
    constructor: DBViewTemplateHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DBViewTemplateHandler);
DBViewTemplateHandler.extend({
    UpdateTemplate: function(key, value) {
        if ($S.isStringV2(key)) {
            DBViewTemplate[key] = value;
        }
    }
});
DBViewTemplateHandler.extend({
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
        if ($S.isStringV2(wordBreak) && $S.isString(value)) {
            if (!$S.isStringV2(wordBreakTag)) {
                wordBreakTag = "li";
            }
            value = value.split(wordBreak).map(function(el,i, arr) {
                return {"tag": wordBreakTag, "text": el.trim()};
            });
        }
        if (($S.isObject(text) || $S.isArray(text))) {
            if ($S.isStringV2(fieldName)) {
                temp[fieldName] = value;
                TemplateHelper.updateTemplateText(text, temp);
            }
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
    _getHeadingText: function(tdData, defaultHeading) {
        if (!$S.isObject(tdData)) {
            return defaultHeading;
        }
        if (!$S.isUndefined(tdData["heading"])) {
            return tdData["heading"];
        }
        if (!$S.isUndefined(tdData["name"])) {
            return tdData["name"];
        }
        return defaultHeading;
    },
    _generateFirstTr: function(trData, isSortableFieldRequired, sortingFields) {
        var renderFieldTr = this.getTemplate("dbviewField.tr");
        var i, tdField, isSortable, tdText, isFound;
        var defaultClassName = "btn", className, additionalClassName;
        var isValidTr = false;
        var tdClassName = "";
        if (!$S.isArray(trData)) {
            trData = [];
        }
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
            if ($S.isBooleanTrue(isSortable) && $S.isBooleanTrue(isSortableFieldRequired)) {
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
                tdText = [{"tag": "button.b", "className": className, "name": "sortable", "value": trData[i].name, "text": this._getHeadingText(trData[i], "")}];
            } else {
                tdText = [{"tag": "b", "text": this._getHeadingText(trData[i], "")}];
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

DBViewTemplateHandler.extend({
    generateIndividualTableV2: function(renderData, isSortableFieldRequired, tableTemplateName, sortingFields) {
        var renderField = this.getTemplate(tableTemplateName);
        var renderFieldTr, i;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = 0; i < renderData.length; i++) {
                if (i===0) {
                    renderFieldTr = this._generateFirstTr(renderData[i], isSortableFieldRequired, sortingFields);
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
    _generateHeading: function(headingText, key, currentList3Data) {
        var heading = headingText;
        var formValue = {"tableHeading": headingText};
        var currentField = null;
        var i = 0, isFound = false;
        formValue[key] = headingText;
        if ($S.isObject(currentList3Data) && $S.isArray(currentList3Data.value)) {
            for (i = 0; i < currentList3Data.value.length; i++) {
                if (!$S.isObject(currentList3Data.value[i])) {
                    continue;
                }
                if (currentList3Data.value[i].key === key) {
                    currentField = currentList3Data.value[i];
                    break;
                }
            }
        }
        if ($S.isObject(currentField)) {
            if ($S.isObject(currentField.text) || $S.isArray(currentField.text)) {
                heading = $S.clone(currentField.text);
                isFound = true;
            }
        }
        if (!isFound) {
            if ($S.isObject(currentList3Data) && $S.isArray(currentList3Data.value)) {
                if (i === 0 && currentList3Data.value.length === 1) {
                    heading = this.getTemplate("dbViewHeading1-1");
                } else if (i === 0 && currentList3Data.value.length > 1) {
                    heading = this.getTemplate("dbViewHeading1-many");
                } else if (i === 1 && currentList3Data.value.length >= 2) {
                    heading = this.getTemplate("dbViewHeading2-many");
                } else if (currentList3Data.value.length > 2) {
                    heading = this.getTemplate("dbViewHeading3-many");
                }
            }
        }
        if (!$S.isString(heading)) {
            TemplateHelper.updateTemplateText(heading, formValue);
        }
        return heading;
    },
    _recursiveGenerateHeading: function(renderField, tempRenderData, currentList3Data, sortingFields) {
        if (!$S.isArray(tempRenderData)) {
            return;
        }
        for (var i=0; i<tempRenderData.length; i++) {
            if ($S.isObject(tempRenderData[i])) {
                if ($S.isString(tempRenderData[i].name)) {
                    renderField.push(this._generateHeading(tempRenderData[i].name, tempRenderData[i].key, currentList3Data));
                }
                this._recursiveGenerateHeading(renderField, tempRenderData[i].text, currentList3Data, sortingFields);
            } else if ($S.isArray(tempRenderData[i])) {
                renderField.push(this.generateDbViewRenderFieldV2([{"tableData": tempRenderData}], true, "tableData", sortingFields));
                break;
            }
        }
    },
    _generateDbViewSummaryTr: function(trsData) {
        var field = this.getTemplate("dbviewSummaryField");
        var trField, temp;
        if ($S.isArray(trsData) && trsData.length > 0) {
            for(var i=0; i<trsData.length; i++) {
                trField = this.getTemplate("dbviewSummaryField.tr");
                temp = {};
                temp["dbviewSummaryField.tr.s_no"] = i+1;
                if (!$S.isObject(trsData[i])) {
                    continue;
                }
                if ($S.isString(trsData[i].name) && trsData[i].name.length > 0) {
                    temp["dbviewSummaryField.tr.description"] = trsData[i].name;
                } else {
                    temp["dbviewSummaryField.tr.description"] = "Total";
                }
                if ($S.isArray(trsData[i].text) && trsData[i].text.length > 0) {
                    if ($S.isObject(trsData[i].text[0])) {
                        if ($S.isArray(trsData[i].text[0].text)) {
                            temp["dbviewSummaryField.tr.count"] = trsData[i].text[0].text.length;
                        } else {
                            temp["dbviewSummaryField.tr.count"] = trsData[i].text.length;
                        }
                    } else {
                        temp["dbviewSummaryField.tr.count"] = trsData[i].text.length;
                    }
                } else {
                    temp["dbviewSummaryField.tr.count"] = 0;
                }
                TemplateHelper.updateTemplateText(trField, temp);
                TemplateHelper.addItemInTextArray(field, "dbviewSummaryField", trField);
            }
        }
        return field;
    },
    _recursiveGenerateHeadingV4: function(renderField, tempRenderData, currentList3Data) {
        if (!$S.isArray(tempRenderData) || tempRenderData.length < 1) {
            return;
        }
        var isBreak = false;
        for (var i=0; i<tempRenderData.length; i++) {
            if (!$S.isObject(tempRenderData[i]) || !$S.isArray(tempRenderData[i].text)) {
                continue;
            }
            for(var j=0; j<tempRenderData[i].text.length; j++) {
                if (!$S.isObject(tempRenderData[i].text[j]) || !$S.isString(tempRenderData[i].text[j].key)) {
                    renderField.push(this._generateDbViewSummaryTr(tempRenderData));
                    isBreak = true;
                    break;
                }
                break;
            }
            if (isBreak) {
                break;
            }
            renderField.push(this._generateHeading(tempRenderData[i].name, tempRenderData[i].key, currentList3Data));
            renderField.push(this._recursiveGenerateHeadingV4(renderField, tempRenderData[i].text, currentList3Data));
        }
    },
    generateDbViewRenderFieldV2: function(renderData, isSortableFieldRequired, tableTemplateName, sortingFields) {
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
                tableField = this.generateIndividualTableV2(renderData[i].tableData, isSortableFieldRequired, tableTemplateName, sortingFields);
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
    },
    GenerateDbViewRenderField: function(renderData, currentList3Data, sortingFields) {
        // currentList3Data is required for generate heading
        // sortingFields is required for highlight button (primary / secondary)
        var renderField = [];
        if ($S.isArray(renderData) && renderData.length > 0) {
            this._recursiveGenerateHeading(renderField, renderData, currentList3Data, sortingFields);
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
    GenerateDbViewSummaryRenderField: function(renderData, currentList3Data) {
        var renderField = [];
        if ($S.isArray(renderData) && renderData.length > 0) {
            this._recursiveGenerateHeadingV4(renderField, renderData, currentList3Data);
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    }
});
DBViewTemplateHandler.extend({
    getTemplate: function(pageName) {
        if (DBViewTemplate[pageName]) {
            return $S.clone(DBViewTemplate[pageName]);
        }
        return $S.clone(DBViewTemplate["templateNotFound"]);
    },
});

})($S);

export default DBViewTemplateHandler;
