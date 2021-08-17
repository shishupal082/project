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


var ViewPage;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
ViewPage = function(arg) {
    return new ViewPage.fn.init(arg);
};
ViewPage.fn = ViewPage.prototype = {
    constructor: ViewPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(ViewPage);


ViewPage.extend({
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
        var template = TemplateHandler.getTemplate("home");
        var newFormField = FormHandler.getAddNewProjectTemplate();
        var homeFields = this._getProjectTable(pageName);
        if (homeFields.length === 0 && newFormField === null) {
            template = TemplateHandler.getTemplate("noDataFound");
        } else {
            TemplateHelper.addItemInTextArray(template, "home.link", homeFields);
            TemplateHelper.addItemInTextArray(template, "home.addNewProject", newFormField);
        }
        return template;
    }
});

})($S);

export default ViewPage;
