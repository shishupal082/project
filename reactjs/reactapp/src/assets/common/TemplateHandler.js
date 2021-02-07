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
        var href = "?name="+name;
        var staticData = DataHandler.getData("staticData", {});
        if ($S.isArray(staticData.data)) {
            for (var i = 0; i < staticData.data.length; i++) {
                if (staticData.data[i].name === name) {
                    if (staticData.data[i].linkType === "direct") {
                        href = staticData.data[i].link;
                    } else {
                        href = "?name=" + name;
                    }
                    if ($S.isString(staticData.data[i].footerLinkText)) {
                        text = staticData.data[i].footerLinkText;
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
    _getTdField: function(r, c, tdData) {
        var tdField = this.getTemplate("tableTdField");
        if (r === 0 || c === 0) {
            TemplateHelper.setTemplateAttr(tdField, "tdData", "tag", "th");
        }
        TemplateHelper.updateTemplateText(tdField, {"tdData": tdData});
        return tdField;
    },
    _getRowField: function(index, rowData) {
        var trField = this.getTemplate("tableRowField");
        for (var i = 0; i < rowData.length; i++) {
            TemplateHelper.addItemInTextArray(trField, "tableRowEntry", this._getTdField(index, i, rowData[i]));
        }
        return trField;
    },
    GetPageRenderField: function(renderData) {
        var renderField = this.getTemplate("tableField");
        for (var i = 0; i < renderData.length; i++) {
            TemplateHelper.addItemInTextArray(renderField, "tableEntry", this._getRowField(i, renderData[i]));
        }
        var footerData = DataHandler.getFooterData();
        var footerField = this.getTemplate("footerField");
        var footerFieldHtml = this.generateFooterHtml(footerData);
        TemplateHelper.updateTemplateText(footerField, {"footerLink": footerFieldHtml});
        TemplateHelper.addItemInTextArray(renderField, "footer", footerField);
        return renderField;
    },
    GetHeadingField: function() {
        var renderField = this.getTemplate("heading");
        var headingText = DataHandler.getHeadingText();
        TemplateHelper.updateTemplateText(renderField, {"heading-text": headingText});
        return renderField;
    }
});

})($S);

export default TemplateHandler;
