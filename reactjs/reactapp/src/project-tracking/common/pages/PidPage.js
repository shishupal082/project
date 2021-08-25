import $S from "../../../interface/stack.js";
// import TemplateHandler from "../common/TemplateHandler";
// import Template from "../common/Template";

// import Config from "./Config";
import DataHandler from "../DataHandler";
// import DataHandlerV2 from "../DataHandlerV2";
import FeedbackPage from "./FeedbackPage";
// import FormHandler from "../forms/FormHandler";


// import TemplateHelper from "../../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";
import CommonDataHandler from "../../../common/app/common/CommonDataHandler";
// import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../../common/app/common/DBViewTemplateHandler";


var PidPage;
(function($S){
// var DT = $S.getDT();
// var loadingCount = 0;
PidPage = function(arg) {
    return new PidPage.fn.init(arg);
};
PidPage.fn = PidPage.prototype = {
    constructor: PidPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(PidPage);

PidPage.extend({
    _updateDetailsLink: function(pageName, pid, data) {
        if (!$S.isArray(data)) {
            return data;
        }
        for (var i=0; i<data.length; i++) {
            if (!$S.isObject(data[i])) {
                continue;
            }
            if ($S.isStringV2(data[i]["unique_id"])) {
                data[i]["details_link"] = DataHandler.getLinkV3(pid, data[i]["unique_id"]);
            }
        }
        return data;
    },
    getRenderTable: function(pageName, tableName, resultPatternName, tableData) {
        var pid = CommonDataHandler.getPathParamsData("pid", "");
        this._updateDetailsLink(pageName, pid, tableData);
        FeedbackPage.updateStatusLink(pageName, tableData);
        var resultPattern = DataHandler.getAppData(resultPatternName);
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var dbViewData = {};
        dbViewData[tableName] = {"tableData": tableData};
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var updateData = ($S.isArray(renderData) && renderData.length === 1) ? renderData[0].text : null;
        FeedbackPage.updateStatusText(pageName, pid, updateData);
        var renderFieldTable = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return renderFieldTable;
    }
});

})($S);

export default PidPage;
