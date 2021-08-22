import $S from "../../interface/stack.js";
import TemplateHandler from "../common/TemplateHandler";
// import Template from "../common/Template";

// import Config from "./Config";
import DataHandler from "../common/DataHandler";
import DataHandlerV2 from "../common/DataHandlerV2";
import FormHandler from "../forms/FormHandler";


import TemplateHelper from "../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";
// import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
// import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";


var Id1Page;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
Id1Page = function(arg) {
    return new Id1Page.fn.init(arg);
};
Id1Page.fn = Id1Page.prototype = {
    constructor: Id1Page,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(Id1Page);


Id1Page.extend({
    _getProjectTable: function(pageName) {
        var tableData = DataHandlerV2.getTableData(DataHandler.getTableName("projectTable"));
        var tableTemplate = [], homeFields = [], i, linkTemplate;
        if ($S.isArray(tableData)) {
            for (i=0; i<tableData.length; i++) {
                if (!$S.isObject(tableData[i])) {
                    continue;
                }
                homeFields.push({"toUrl": TemplateHandler.getLink(pageName, tableData[i].pid),
                        "toText": tableData[i].pName});
            }
        }
        for (i = 0; i< homeFields.length; i++) {
            linkTemplate = TemplateHandler.getLinkTemplate(homeFields[i].toUrl, homeFields[i].toText);
            tableTemplate.push(linkTemplate);
        }
        return tableTemplate;
    },
    getRenderField: function(pageName) {
        var template = TemplateHandler.getTemplate("id1Page");
        var newFormField = FormHandler.getFormTemplate(pageName, "updateFeedbackForm");
        var homeFields = this._getProjectTable(pageName);
        if (homeFields.length === 0 && newFormField === null) {
            template = TemplateHandler.getTemplate("noDataFound");
        } else {
            TemplateHelper.addItemInTextArray(template, "id1Page.details", homeFields);
            TemplateHelper.addItemInTextArray(template, "id1Page.updateFeedback", newFormField);
        }
        return template;
    },
});

})($S);

export default Id1Page;
