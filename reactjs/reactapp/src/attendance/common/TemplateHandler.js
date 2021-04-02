import $S from "../../interface/stack.js";
// import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV2 from "./DataHandlerV2";

import Template from "./Template";
import TemplateHelper from "../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";

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
    _generateLink: function(linkType, name) {
        var text = name;
        var href = "";
        var staticData = DataHandler.getData("metaData", {});
        if ($S.isArray(staticData.footerLink)) {
            for (var i = 0; i < staticData.footerLink.length; i++) {
                if (staticData.footerLink[i].name === name) {
                    href = staticData.footerLink[i].link;
                    if ($S.isString(staticData.footerLink[i].footerLinkText)) {
                        text = staticData.footerLink[i].footerLinkText;
                    }
                    break;
                }
            }
        }
        return {"tag": "a", "href": href, "text": text};
    },
    generateFooterHtml: function(footerData) {
        var htmlFields = [], i, j, k;
        var divField = [{"tag": "div", "name": "tempDiv", "text": []}];
        var divField2 = [{"tag": "div", "name": "tempDiv2", "text": []}];
        var tableField = [{"tag": "table.tbody", "className": "", "name": "tempTable", "text": []}];
        var trField = [{"tag": "tr", "name": "tempTr", "text": []}];
        var tempDivField, tempDivField2, tempTableField, tempTrField;
        if ($S.isArray(footerData)) {
            for(i=0; i<footerData.length; i++) {
                if (!$S.isArray(footerData[i].entry)) {
                    continue;
                }
                if (footerData[i].type === "div") {
                    tempDivField = $S.clone(divField);
                    for (j=0; j<footerData[i].entry.length; j++) {
                        if ($S.isArray(footerData[i].entry[j])) {
                            tempDivField2 = $S.clone(divField2);
                            for (k = 0; k < footerData[i].entry[j].length-1; k++) {
                                TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", this._generateLink(footerData[i].linkType, footerData[i].entry[j][k]));
                                TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", {"tag": "a", "text": {"tag": "span", "text": "|"}});
                            }
                            TemplateHelper.addItemInTextArray(tempDivField2, "tempDiv2", this._generateLink(footerData[i].linkType, footerData[i].entry[j][k]));
                            TemplateHelper.addItemInTextArray(tempDivField, "tempDiv", tempDivField2);
                        }
                    }
                    htmlFields.push(tempDivField);
                } else if (footerData[i].type === "table") {
                    tempTableField = $S.clone(tableField);
                    for (j=0; j<footerData[i].entry.length; j++) {
                        if ($S.isArray(footerData[i].entry[j])) {
                            tempTrField = $S.clone(trField);
                            for (k = 0; k < footerData[i].entry[j].length-1; k++) {
                                TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": this._generateLink(footerData[i].linkType, footerData[i].entry[j][k])});
                                TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": {"tag": "span", "text": "|"}});
                            }
                            TemplateHelper.addItemInTextArray(tempTrField, "tempTr", {"tag": "td", "text": this._generateLink(footerData[i].linkType, footerData[i].entry[j][k])});
                            TemplateHelper.addItemInTextArray(tempTableField, "tempTable", tempTrField);
                        }
                    }
                    htmlFields.push(tempTableField);
                }
            }
        }
        return htmlFields;
    }
});
TemplateHandler.extend({
    _generateAttendance: function(attendanceData, attendanceOption, userData, dateAttr) {
        var text = "", temp;
        var selectName = userData.userId + "," + dateAttr.dateStr + "," + userData.username;
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
        return {"tag": "td", "text": attendanceOption};
    },
    _generateIndividualTable: function(data, attendanceOption) {
        var template2 = this.getTemplate("monthlyTemplate.data.table");
        var template3 = this.getTemplate("monthlyTemplate.data.table.tr");
        var i, j, template3Data;
        var userData = DataHandler.getData("filteredUserData", []);
        var attendanceData = DataHandler.getData("attendanceData", {});
        if ($S.isArray(data.allDate)) {
            for(i=0; i<data.allDate.length; i++) {
                TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "text": data.allDate[i].date});
            }
            TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
            for (j=0; j<userData.length; j++) {
                template3 = this.getTemplate("monthlyTemplate.data.table.tr");
                template3Data = {"monthlyTemplate.table.tr.s_no": j+1, "monthlyTemplate.table.tr.name": userData[j].displayName};
                TemplateHelper.updateTemplateText(template3, template3Data);
                for(i=0; i<data.allDate.length; i++) {
                    TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", this._generateAttendance(attendanceData, attendanceOption, userData[j], data.allDate[i]));
                }
                TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
            }
        }
        return template2;
    },
    generateUpdateEntryRenderField: function(renderData, attendanceOption) {
        var renderField = this.getTemplate("monthlyTemplate");
        var template1, template2;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (var i = 0; i < renderData.length; i++) {
                template1 = this.getTemplate("monthlyTemplate.data");
                TemplateHelper.updateTemplateText(template1, {"monthlyTemplate.data.dateHeading": renderData[i].dateHeading});
                template2 = this._generateIndividualTable(renderData[i], attendanceOption);
                TemplateHelper.addItemInTextArray(template1, "monthlyTemplate.data.table", template2);
                TemplateHelper.addItemInTextArray(renderField, "monthlyTemplate.data", template1);
            }
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        return renderField;
    },
    _generateAttendanceCount: function(validDate, attendanceData, userData, summaryFields) {
        var result = [];
        var i, j;
        var attendance = attendanceData[userData.userId].attendance;
        var type, count, totalCount = 0;
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
                result.push({"name": type, "count": count});
            }
        }
        if (totalCount <= 0) {
            result = null;
        }
        return result;
    },
    _generateIndividualTableV2: function(validDate, userData, attendanceData) {
        var template2 = this.getTemplate("monthlyTemplate.data.table");
        var template3, headingRow = this.getTemplate("monthlyTemplate.data.table.tr");
        var i, j, k, template3Data, temp;
        var headingRowAdded = false, template2Added = false;
        var summaryFields = DataHandler.getData("metaData", {}).summaryFields;
        if ($S.isArray(summaryFields)) {
            for(i=0; i<summaryFields.length; i++) {
                TemplateHelper.addItemInTextArray(headingRow, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "text": summaryFields[i].text});
            }
            for (j=0; j<userData.length; j++) {
                template3 = this.getTemplate("monthlyTemplate.data.table.tr");
                template3Data = {"monthlyTemplate.table.tr.s_no": j+1, "monthlyTemplate.table.tr.name": userData[j].displayName};
                temp = this._generateAttendanceCount(validDate, attendanceData, userData[j], summaryFields);
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
                }
            }
        }
        if (!template2Added) {
            template2 = null;
        }
        return template2;
    },
    generateSummaryRenderField: function(renderData) {
        var userData = DataHandler.getData("filteredUserData", []);
        var attendanceData = DataHandler.getData("latestAttendanceData", {});
        var renderField = this.getTemplate("monthlyTemplate");
        var userDataV2 = [], i;
        var validTemplate = false;
        for (i = 0; i < userData.length; i++) {
            if ($S.isObject(attendanceData[userData[i].userId]) && attendanceData[userData[i].userId].attendance.length > 0) {
                userDataV2.push(userData[i]);
            }
        }
        var template1, template2, validDate;
        if ($S.isArray(renderData) && renderData.length > 0) {
            for (i = 0; i < renderData.length; i++) {
                template1 = this.getTemplate("monthlyTemplate.data");
                TemplateHelper.updateTemplateText(template1, {"monthlyTemplate.data.dateHeading": renderData[i].dateHeading});
                validDate = [];
                if ($S.isArray(renderData[i].allDate)) {
                    validDate = renderData[i].allDate.map(function(el, i, arr) {
                        return el.dateStr;
                    });
                }
                template2 = this._generateIndividualTableV2(validDate, userDataV2, attendanceData);
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
        var attendanceOption = DataHandler.getData("metaData", {}).attendanceOption;
        var currentList2Id = DataHandler.getData("currentList2Id", "");
        var renderField;
        switch(currentList2Id) {
            case "entry":
                renderField = this.generateUpdateEntryRenderField(renderData, "");
            break;
            case "update":
                renderField = this.generateUpdateEntryRenderField(renderData, attendanceOption);
            break;
            case "summary":
                renderField = this.generateSummaryRenderField(renderData);
            break;
            case "home":
                renderField = this.generateHomeRenderField();
            break;
            case "noMatch":
            default:
                renderField = this.getTemplate("noMatch");
            break;
        }
        var footerFieldHtml = this.generateFooterHtml(footerData);
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
