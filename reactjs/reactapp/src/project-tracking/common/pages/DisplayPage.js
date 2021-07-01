import $S from "../../../interface/stack.js";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
// import TemplateHandler from "../template/TemplateHandler";
// import Config from "../Config";

// import AppHandler from "../../../common/app/common/AppHandler";
// import TemplateHelper from "../../../common/TemplateHelper";
// import FormHandler from "./FormHandler";
import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";


var DisplayPage;

(function($S){
// var DT = $S.getDT();

DisplayPage = function(arg) {
    return new DisplayPage.fn.init(arg);
};
DisplayPage.fn = DisplayPage.prototype = {
    constructor: DisplayPage,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DisplayPage);
DisplayPage.extend({
    getRenderData: function(pageName, sortingFields) {
        var pageId = DataHandler.getPathParamsData("pageId");
        var requiredDataTable = DataHandler.getAppData("pageId:" + pageId + ".requiredDataTable");
        var dbViewData = {}, i;
        if ($S.isArray(requiredDataTable)) {
            for (i=0; i<requiredDataTable.length; i++) {
                if ($S.isStringV2(requiredDataTable[i])) {
                    dbViewData[requiredDataTable[i]] = {"tableData": DataHandlerV2.getTableData(requiredDataTable[i])};
                }
            }
        }
        DataHandlerV2.handlePageByPageId(pageId, dbViewData);
        var resultPattern = DataHandler.getAppData("pageId:" + pageId + ".resultPattern");
        var resultCriteria = DataHandler.getAppData("pageId:" + pageId + ".resultCriteria");
        var finalTable = DBViewDataHandler.GetFinalTable(dbViewData, resultPattern, resultCriteria, null);
        return finalTable;
    }
});
})($S);

export default DisplayPage;
