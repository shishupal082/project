import $S from "../../interface/stack.js";
// import Config from "./Config";
import DataHandler from "./DataHandler";

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
    getTemplate: function(pageName) {
        if (Template[pageName]) {
            return $S.clone(Template[pageName]);
        }
        return $S.clone(Template["noDataFound"]);
    },
    setHeadingUsername: function(username) {
        var heading = this.getTemplate("heading");
        if ($S.isString(username)) {
            TemplateHelper.setTemplateAttr(heading, "pageHeading.username", "text", username);
            Template["heading"] = heading;
            return true;
        }
        return false;
    },
    _getTdField: function(rowIndex, colIndex, isFirstRow, isLastRow, isFirstCol, tdData) {
        var tdField = this.getTemplate("tableTdField");
        if (isFirstCol) {
            TemplateHelper.setTemplateAttr(tdField, "tdData", "tag", "th");
        }
        TemplateHelper.updateTemplateText(tdField, {"tdData": tdData});
        return tdField;
    },
    _getRowField: function(rowIndex, isFirstRow, isLastRow, rowData) {
        var trField = this.getTemplate("tableRowField");
        TemplateHelper.updateTemplateText(trField, {"s.no.": rowIndex});
        for (var i = 0; i < rowData.length; i++) {
            TemplateHelper.addItemInTextArray(trField, "tableRowEntry", this._getTdField(rowIndex, i+1, isFirstRow, isLastRow, i===0, rowData[i]));
        }
        return trField;
    },
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
            attendanceOption.value = text;
            attendanceOption.name = selectName;
        } else {
            attendanceOption = text;
        }
        return {"tag": "td", "text": attendanceOption};
    },
    _generateIndividualTable: function(data) {
        var template2 = this.getTemplate("monthlyTemplate.data.table");
        var template3 = this.getTemplate("monthlyTemplate.data.table.tr");
        var i, j, template3Data;
        var userData = DataHandler.getData("userData", []);
        var attendanceData = DataHandler.getData("attendanceData", {});
        var attendanceOption = DataHandler.getData("metaData", {}).attendanceOption;
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
                    TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", this._generateAttendance(attendanceData, $S.clone(attendanceOption), userData[j], data.allDate[i]));
                }
                // TemplateHelper.addItemInTextArray(template3, "monthlyTemplate.data.table.tr.tds", {"tag": "td", "text": j});
                TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3);
            }
        }
        TemplateHelper.addItemInTextArray(template2, "monthlyTemplate.data.table.tr", template3)
        return template2;
    },
    GetPageRenderField: function(dataLoadStatus, renderData, footerData) {
        if (!dataLoadStatus) {
            return this.getTemplate("loading");
        }
        var renderField = this.getTemplate("monthlyTemplate");
        var template1, template2;
        if (renderData.length > 0) {
            for (var i = 0; i < renderData.length; i++) {
                template1 = this.getTemplate("monthlyTemplate.data");
                TemplateHelper.updateTemplateText(template1, {"monthlyTemplate.data.dateHeading": renderData[i].dateHeading});
                template2 = this._generateIndividualTable(renderData[i]);
                TemplateHelper.addItemInTextArray(template1, "monthlyTemplate.data.table", template2);
                TemplateHelper.addItemInTextArray(renderField, "monthlyTemplate.data", template1);
            }
        } else {
            renderField = this.getTemplate("noDataFound");
        }
        var footerField = this.getTemplate("footerField");
        var footerFieldHtml = this.generateFooterHtml(footerData);
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
