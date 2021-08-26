import $S from "../../../interface/stack.js";
// import TemplateHandler from "../common/TemplateHandler";
// import Template from "../common/Template";

// import Config from "./Config";
import DataHandler from "../DataHandler";
import DataHandlerV2 from "../DataHandlerV2";
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
    _getValue: function(pageName, attr, currentRow, sourceTableName, value, defaultValue) {
        if (!$S.isObject(currentRow)) {
            currentRow = {};
        }
        var result = defaultValue;
        var tableData = DataHandlerV2.getTableDataV3(pageName, sourceTableName, currentRow.unique_id);
        if ($S.isArray(tableData) && $S.isStringV2(value)) {
            var valueAttr = value.split(":");
            if (valueAttr.length === 1 && valueAttr[0] === "LENGTH") {
                result = tableData.length;
            } else if (valueAttr.length === 2 && valueAttr[0] === "FIRST_ROW") {
                if ($S.isStringV2(valueAttr[1]) && tableData.length > 0) {
                    result = tableData[0][valueAttr[1]];
                }
            }
        }
        return result;
    },
    _updateAttr: function(pageName, tableData, attr) {
        if (!$S.isObject(attr) || !$S.isArray(tableData)) {
            return;
        }
        var sourceTableName = attr["sourceTableName"];
        var destinationFieldName = attr["destinationFieldName"];
        var value = attr["value"];
        if ($S.isStringV2(sourceTableName) && $S.isStringV2(destinationFieldName)) {
            for (var i=0; i<tableData.length; i++) {
                if (!$S.isObject(tableData[i])) {
                    continue;
                }
                tableData[i][destinationFieldName] = this._getValue(pageName, attr, tableData[i], sourceTableName, value, tableData[i][destinationFieldName]);
            }
        }
    },
    updateDependentAttr: function(pageName, tableData) {
        var dependentAttr = DataHandler.getAppData("dependentAttr");
        if ($S.isArray(dependentAttr)) {
            for(var i=0; i<dependentAttr.length; i++) {
                this._updateAttr(pageName, tableData, dependentAttr[i]);
            }
        }
    },
    getRenderTable: function(pageName, tableName, resultPatternName, tableData) {
        var pid = CommonDataHandler.getPathParamsData("pid", "");
        this._updateDetailsLink(pageName, pid, tableData);
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
