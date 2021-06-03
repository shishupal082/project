import $S from "../../interface/stack.js";
// import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV2 from "./DataHandlerV2";
// import DataHandlerTA from "./DataHandlerTA";
// import DataHandlerAddFieldReport from "./DataHandlerAddFieldReport";

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
    _recursiveGenerateHeading: function(renderField, tempRenderData, currentList3Data) {
        if (!$S.isArray(tempRenderData)) {
            return;
        }
        for (var i=0; i<tempRenderData.length; i++) {
            if ($S.isObject(tempRenderData[i])) {
                if ($S.isString(tempRenderData[i].name)) {
                    renderField.push(this._generateHeading(tempRenderData[i].name, tempRenderData[i].key, currentList3Data));
                }
                this._recursiveGenerateHeading(renderField, tempRenderData[i].text, currentList3Data);
            } else if ($S.isArray(tempRenderData[i])) {
                renderField.push(this.generateDbViewRenderFieldV2([{"tableData": tempRenderData}], true, "tableData"));
                break;
            }
        }
    },
    generateDbViewRenderFieldV3: function(renderData) {
        var renderField = [];
        var currentList3Data = DataHandler.getCurrentList3Data();
        if ($S.isArray(renderData) && renderData.length > 0) {
            this._recursiveGenerateHeading(renderField, renderData, currentList3Data);
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
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
    generateDbViewRenderFieldV4: function(renderData) {
        var renderField = [];
        var currentList3Data = DataHandler.getCurrentList3Data();
        if ($S.isArray(renderData) && renderData.length > 0) {
            this._recursiveGenerateHeadingV4(renderField, renderData, currentList3Data);
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
    generateDbViewRenderFieldV5: function(renderData) {
        var renderField = this.getTemplate("addFieldReport");
        var currentAppData = DataHandler.getCurrentAppData();
        var metaData = DataHandler.getData("metaData", {});
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
        temp[key] = stations;
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
            TemplateHelper.updateTemplateText(renderField, {"loadingText": "Loading ..." + (loadingCount++)});
            return renderField;
        }
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
                    renderField = this.generateDbViewRenderFieldV2(renderData, true, "tableData");
                break;
                case "dbview":
                case "custom_dbview":
                    renderField = this.generateDbViewRenderFieldV3(renderData);
                break;
                case "dbview_summary":
                    renderField = this.generateDbViewRenderFieldV4(renderData);
                break;
                case "add_field_report":
                    renderField = this.generateDbViewRenderFieldV5(renderData);
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
