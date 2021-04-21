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
    _getTdClassNameFromDateAttr: function(dateAttr, nhList, phList) {
        var className = "";
        if (!$S.isArray(nhList)) {
            nhList = [];
        }
        if (!$S.isArray(phList)) {
            phList = [];
        }
        if ($S.isObject(dateAttr)) {
            if ($S.isString(dateAttr.day)) {
                className = "day-"+dateAttr.day;
            }
            if (nhList.indexOf(dateAttr.dateStr) >= 0) {
                className += " day-nh";
            }
            if (phList.indexOf(dateAttr.dateStr) >= 0) {
                className += " day-ph";
            }
        }
        return className;
    },
    _generateAttendance: function(attendanceData, attendanceOption, userData, dateAttr, nhList, phList) {
        var text = "", temp;
        var selectName = userData.userId + "," + dateAttr.dateStr + "," + userData.name;
        if ($S.isObject(attendanceData) && $S.isObject(attendanceData[userData.userId])) {
            if ($S.isArray(attendanceData[userData.userId].attendance)) {
                temp = attendanceData[userData.userId].attendance;
                for(var i=temp.length-1; i>=0; i--) {
                    if (!$S.isObject(temp[i])) {
                        continue;
                    }
                    if (dateAttr.dateStr === temp[i].date) {
                        text = temp[i].type;
                        break;
                    }
                }
            }
        }
        if ($S.isObject(attendanceOption)) {
            attendanceOption = $S.clone(attendanceOption);
            attendanceOption.value = text;
            attendanceOption.name = selectName;
        } else {
            attendanceOption = text;
        }
        var className = this._getTdClassNameFromDateAttr(dateAttr, nhList, phList);
        return {"tag": "td", "className":className, "text": attendanceOption};
    },
    _updateHeadingRowAttendance: function(headingRow, sortableFields, stationName, name) {
        var template3Data = {};
        template3Data[stationName] = this._generateHeading({"name": "station", "text": "Station"}, sortableFields);
        template3Data[name] = this._generateHeading({"name": "name", "text": "Name"}, sortableFields);
        TemplateHelper.updateTemplateText(headingRow, template3Data);
    },
    _generateIndividualTable: function(data, sortableFields, attendanceOption, nhList, phList) {
        var template2 = this.getTemplate("monthlyTemplate.data.table");
        var template3 = this.getTemplate("monthlyTemplate.data.table.tr");
        var i, j, template3Data;
        var userData = DataHandler.getData("filteredUserData", []);
        var attendanceData = DataHandler.getData("attendanceData", {});
        var isValidTemplate = false;
        if ($S.isArray(data.allDate)) {
            this._updateHeadingRowAttendance(template3, sortableFields, "monthlyTemplate.table.tr.station", "monthlyTemplate.table.tr.name");
            for(i=0; i<data.allDate.length; i++) {
                TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "className": this._getTdClassNameFromDateAttr(data.allDate[i], nhList, phList), "text": data.allDate[i].date});
            }
            if (userData.length > 0) {
                isValidTemplate = true;
                TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
                for (j=0; j<userData.length; j++) {
                    template3 = this.getTemplate("monthlyTemplate.data.table.tr");
                    template3Data = {"monthlyTemplate.table.tr.s_no": j+1,
                                    "monthlyTemplate.table.tr.name": userData[j].name,
                                    "monthlyTemplate.table.tr.station": userData[j].station};
                    TemplateHelper.updateTemplateText(template3, template3Data);
                    for(i=0; i<data.allDate.length; i++) {
                        TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", this._generateAttendance(attendanceData, attendanceOption, userData[j], data.allDate[i], nhList, phList));
                    }
                    TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
                }
            }
        }
        if (!isValidTemplate) {
            template2 = null;
        }
        return template2;
    },
    generateUpdateEntryRenderField: function(renderData, sortableFields, attendanceOption, nhList, phList) {
        var renderField = this.getTemplate("monthlyTemplate");
        var i, template1, template2;
        var isValidTemplate = false;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = renderData.length-1; i>=0 ; i--) {
                template1 = this.getTemplate("monthlyTemplate.data");
                template2 = this._generateIndividualTable(renderData[i], sortableFields, attendanceOption, nhList, phList);
                if ($S.isArray(template2)) {
                    isValidTemplate = true;
                    TemplateHelper.updateTemplateText(template1, {"monthlyTemplate.data.dateHeading": renderData[i].dateHeading});
                    TemplateHelper.addItemInTextArray(template1, "monthlyTemplate.data.table", template2);
                    TemplateHelper.addItemInTextArray(renderField, "monthlyTemplate.data", template1);
                }
            }
        }
        if (!isValidTemplate) {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
    _updateTotalCount: function(totalCountObj, key, count) {
        if (!$S.isObject(totalCountObj) || !$S.isString(key) || key.length < 1) {
            return;
        }
        if ($S.isNumber(totalCountObj[key])) {
            totalCountObj[key] += count;
        } else {
            totalCountObj[key] = count;
        }
    },
    _generateAttendanceCount: function(validDate, attendanceData, userData, summaryFields, defaultCount, totalCountObj) {
        var result = [];
        var i, j;
        if (!$S.isObject(attendanceData)) {
            attendanceData = {};
        }
        if (!$S.isObject(userData)) {
            userData = {};
        }
        if (!$S.isObject(attendanceData[userData.userId])) {
            attendanceData[userData.userId] = {};
        }
        if ($S.isUndefined(defaultCount)) {
            defaultCount = "";
        }
        var attendance = attendanceData[userData.userId].attendance;
        var type, count, totalCount = 0, displayCount;
        if ($S.isArray(summaryFields)) {
            for(i=0; i<summaryFields.length; i++) {
                type = summaryFields[i].text;
                count = 0;
                if ($S.isArray(attendance)) {
                    for (j = 0; j < attendance.length; j++) {
                        if (validDate.indexOf(attendance[j].date) >= 0) {
                            count += $S.searchItems(summaryFields[i].value, [attendance[j].type], summaryFields[i].searchByPattern).length;
                        }
                    }
                }
                totalCount += count;
                if (count === 0) {
                    displayCount = defaultCount;
                } else {
                    displayCount = count;
                    this._updateTotalCount(totalCountObj, type, count);
                }
                result.push({"name": type, "count": displayCount});
            }
        }
        if (totalCount <= 0) {
            result = null;
        }
        return result;
    },
    _addTotalRow: function(template2, validDate, summaryFields, defaultCount, totalCountObj) {
        if (!$S.isArray(validDate) || validDate.length < 1) {
            return;
        }
        if (!$S.isObject(totalCountObj)) {
            totalCountObj = {};
        }
        var template3 = this.getTemplate("monthlyTemplate.data.table.tr");
        var template3Data = {"monthlyTemplate.table.tr.s_no": "",
                        "monthlyTemplate.table.tr.station": "",
                        "monthlyTemplate.table.tr.name": {"tag": "b", "text": "Total"}};
        var temp = [], type, count, displayCount, i;
        if ($S.isArray(summaryFields)) {
            for(i=0; i<summaryFields.length; i++) {
                type = summaryFields[i].text;
                count = 0;
                if ($S.isNumber(totalCountObj[type])) {
                    count = totalCountObj[type];
                }
                if (count === 0) {
                    displayCount = defaultCount;
                } else {
                    displayCount = count;
                }
                temp.push({"name": type, "count": displayCount});
            }
        }
        if ($S.isArray(temp)) {
            TemplateHelper.updateTemplateText(template3, template3Data);
            for(i=0; i<temp.length; i++) {
                TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", {"tag": "td.b", "text": temp[i].count});
            }
            TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
        }
    },
    _generateHeading: function(data, sortableFields) {
        if (!$S.isObject(data)) {
            return "";
        }
        var sortableName = DataHandler.getData("sortable", "");
        var className = "btn btn-light";
        if ($S.isArray(sortableFields) && $S.isString(data.name) && sortableFields.indexOf(data.name) >= 0) {
            if (sortableName === data.name) {
                className += " active";
            }
            return {"tag": "button.b", "className": className, "value": data.name, "name": "sortable", "text": data.text};
        }
        return {"tag": "b", "text": data.text};
    },
    _generateIndividualTableV2: function(validDate, userData, attendanceData, summaryFields, defaultCount, sortableFields) {
        var template2 = this.getTemplate("monthlyTemplate.data.table");
        var template3, headingRow = this.getTemplate("monthlyTemplate.data.table.tr");
        var i, j, k, template3Data, temp, count;
        var headingRowAdded = false, template2Added = false;
        var totalCount = {};
        if ($S.isArray(summaryFields)) {
            this._updateHeadingRowAttendance(headingRow, sortableFields, "monthlyTemplate.table.tr.station", "monthlyTemplate.table.tr.name");
            for(i=0; i<summaryFields.length; i++) {
                TemplateHelper.addItemInTextArray(headingRow, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "text":
                        this._generateHeading({"name": summaryFields[i].name, "text": summaryFields[i].text}, sortableFields)});
            }
            count = 1;
            for (j=0; j<userData.length; j++) {
                template3 = this.getTemplate("monthlyTemplate.data.table.tr");
                template3Data = {"monthlyTemplate.table.tr.s_no": count++,
                            "monthlyTemplate.table.tr.station": userData[j].station,
                            "monthlyTemplate.table.tr.name": userData[j].name};
                temp = this._generateAttendanceCount(validDate, attendanceData, userData[j], summaryFields, defaultCount, totalCount);
                if ($S.isArray(temp)) {
                    TemplateHelper.updateTemplateText(template3, template3Data);
                    for(k=0; k<temp.length; k++) {
                        TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "text": temp[k].count});
                    }
                    if (!headingRowAdded) {
                        TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", headingRow);
                        headingRowAdded = true;
                    }
                    template2Added = true;
                    TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
                } else {
                    count--;
                }
            }
        }
        if (template2Added) {
            this._addTotalRow(template2, validDate, summaryFields, defaultCount, totalCount);
        } else {
            template2 = null;
        }
        return template2;
    },
    generateSummaryRenderField: function(renderData, sortableFields) {
        var attendanceData = DataHandler.getData("latestAttendanceData", {});
        var userDataV2 = DataHandler.getData("filteredUserData", []);
        var renderField = this.getTemplate("monthlyTemplate");
        var metaData = DataHandler.getData("metaData", {});
        var appControlData = DataHandler.getCurrentAppData();
        var summaryFields = $S.findParam([appControlData, metaData], "summaryFields");
        var defaultCount = $S.findParam([appControlData, metaData], "defaultCount");
        var validTemplate = false;
        var i, template1, template2, validDate;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = renderData.length-1; i>=0 ; i--) {
                template1 = this.getTemplate("monthlyTemplate.data");
                TemplateHelper.updateTemplateText(template1, {"monthlyTemplate.data.dateHeading": renderData[i].dateHeading});
                validDate = [];
                if ($S.isArray(renderData[i].allDate)) {
                    validDate = renderData[i].allDate.map(function(el, i, arr) {
                        return el.dateStr;
                    });
                }
                template2 = this._generateIndividualTableV2(validDate, userDataV2, attendanceData, summaryFields, defaultCount, sortableFields);
                if ($S.isArray(template2)) {
                    validTemplate = true;
                    TemplateHelper.addItemInTextArray(template1, "monthlyTemplate.data.table", template2);
                    TemplateHelper.addItemInTextArray(renderField, "monthlyTemplate.data", template1);
                }
            }
        }
        if (!validTemplate) {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
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
    _getRowField: function(s_no, rowData, unit, summaryLink, value) {
        var trField = this.getTemplate("taRowField");
        var trData = {};
        trData["taRowField.s_no"] = s_no;
        trData["taRowField.name"] = rowData.name;
        trData["taRowField.station"] = rowData.station;
        trData["taRowField.unit"] = unit;
        TemplateHelper.updateTemplateText(trField, trData);
        TemplateHelper.setTemplateAttr(trField, "taRowField.entry.name", "value", value);
        TemplateHelper.setTemplateAttr(trField, "taRowField.entry.name", "name", rowData.userId);
        TemplateHelper.setTemplateAttr(trField, "taRowField.summaryLink.href", "href", summaryLink);
        return trField;
    },
    generateTaRenderField: function(renderData, sortableFields, unit, summaryLink) {
        var renderField = this.getTemplate("taField");
        if (!$S.isArray(renderData)) {
            return this.getTemplate("noDataFound");
        }
        var fieldsData = DataHandler.getData("fieldsData", {});
        var trField, value;
        if (renderData.length > 0) {
            trField = this.getTemplate("taRowField");
            this._updateHeadingRowAttendance(trField, sortableFields, "taRowField.station", "taRowField.name");
            TemplateHelper.updateTemplateText(trField, {"taRowField.entry": {"tag": "b", "text": "Entry"}, "taRowField.summaryLink": ""});
            TemplateHelper.updateTemplateText(trField, {"submit": ""});
            TemplateHelper.addItemInTextArray(renderField, "tableEntry", trField);
            for (var i = 0; i < renderData.length; i++) {
                if (!$S.isString(renderData[i].userId) || renderData[i].userId.length === 0) {
                    continue;
                }
                value = $S.isUndefined(fieldsData[renderData[i].userId]) ? "" : fieldsData[renderData[i].userId];
                TemplateHelper.addItemInTextArray(renderField, "tableEntry", this._getRowField(i+1, renderData[i], unit, summaryLink, value));
            }
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
});
TemplateHandler.extend({
    _updateTdText: function(tdData) {
        if (!$S.isObject(tdData)) {
            return tdData;
        }
        var value = $S.findParam([tdData], "value", "");
        var fieldName = $S.findParam([tdData], "fieldName", "");
        var text = $S.findParam([tdData], "text", "");
        var wordBreak = $S.findParam([tdData], "word-break", "");
        var wordBreakTag = $S.findParam([tdData], "word-break-tag", "");
        var temp = {};
        if ($S.isString(wordBreak) && wordBreak.length > 0) {
            if (!$S.isString(wordBreakTag) || wordBreakTag.length === 0) {
                wordBreakTag = "li";
            }
            value = value.split(";").map(function(el,i, arr) {
                return {"tag": wordBreakTag, "text": el};
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
        var i, tdField, temp;
        if (!$S.isArray(trData)) {
            trData = [];
        }
        if (trData.length > 0) {
            tdField = {"tag": "td.b", "text": rowIndex+1};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        for (i=0; i<trData.length; i++) {
            temp = this._updateTdText(trData[i]);
            tdField = {"tag": "td", "text": temp};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        return renderFieldTr;
    },
    _generateFirstTr: function(trData, rowIndex) {
        var renderFieldTr = this.getTemplate("dbviewField.tr");
        var i, tdField, isSortable, sortableValue, tdText, defaultClassName = "btn btn-light", className, additionalClassName;
        if (!$S.isArray(trData)) {
            trData = [];
        }
        sortableValue = DataHandler.getData("sortable", "");
        if (trData.length > 0) {
            tdField = {"tag": "td.b", "text": "S.No."};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        for (i=0; i<trData.length; i++) {
            isSortable = $S.findParam([trData[i]], "isSortable", false);
            if ($S.isBooleanTrue(isSortable)) {
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
            tdField = {"tag": "td", "text": tdText};
            TemplateHelper.addItemInTextArray(renderFieldTr, "dbviewField.tr.tds", tdField);
        }
        return renderFieldTr;
    },
    generateDbViewRenderField: function(renderData) {
        var renderField = this.getTemplate("dbviewField");
        var renderFieldTr, i;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = 0; i < renderData.length; i++) {
                if (i===0) {
                    renderFieldTr = this._generateFirstTr(renderData[i], i);
                    TemplateHelper.addItemInTextArray(renderField, "dbviewField.trs", renderFieldTr);
                }
                renderFieldTr = this._generateTr(renderData[i], i);
                TemplateHelper.addItemInTextArray(renderField, "dbviewField.trs", renderFieldTr);
            }
        } else {
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
    GetPageRenderField: function(dataLoadStatus, renderData, footerData) {
        if (!dataLoadStatus) {
            return this.getTemplate("loading");
        }
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var attendanceOption = metaData.attendanceOption;
        var nhList = $S.findParam([currentAppData, metaData], "nhList");
        var phList = $S.findParam([currentAppData, metaData], "phList");
        var sortableFields = $S.findParam([currentAppData, metaData], "sortableFields");
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var unit, summaryLink;
        var renderField;
        if (DataHandlerV2.isPageDisabled(currentList2Id)) {
            renderField = this.getTemplate("noMatch");
        } else {
            switch(currentList2Id) {
                case "entry":
                    renderField = this.generateUpdateEntryRenderField(renderData, sortableFields, "", nhList, phList);
                break;
                case "update":
                    renderField = this.generateUpdateEntryRenderField(renderData, "", attendanceOption, nhList, phList);
                break;
                case "summary":
                    renderField = this.generateSummaryRenderField(renderData, sortableFields);
                break;
                case "home":
                    renderField = this.generateHomeRenderField();
                break;
                case "ta":
                    unit = $S.findParam([metaData, currentAppData], "unit", "");
                    summaryLink = $S.findParam([metaData, currentAppData], "summaryLink", null);
                    renderField = this.generateTaRenderField(renderData, sortableFields, unit, summaryLink);
                break;
                case "dbview":
                    renderField = this.generateDbViewRenderField(renderData);
                break;
                case "noMatch":
                default:
                    renderField = this.getTemplate("noMatch");
                break;
            }
        }
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
