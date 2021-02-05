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
        var footerField = DataHandler.getFooterFields();
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
