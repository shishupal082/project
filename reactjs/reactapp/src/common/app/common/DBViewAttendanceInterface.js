import $S from "../../../interface/stack.js";

// import TemplateHelper from "../../TemplateHelper";

// import DBViewTemplate from "./DBViewTemplate";
import DBViewDataHandler from "./DBViewDataHandler";
import DBViewTemplateHandler from "./DBViewTemplateHandler";

var DBViewAttendanceInterface;
(function($S){
DBViewAttendanceInterface = function(arg) {
    return new DBViewAttendanceInterface.fn.init(arg);
};
DBViewAttendanceInterface.fn = DBViewAttendanceInterface.prototype = {
    constructor: DBViewAttendanceInterface,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DBViewAttendanceInterface);
DBViewAttendanceInterface.extend({
    _getDBViewRenderData: function(filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect) {
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(filteredData, currentList3Data, dateParameterField, dateSelect);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        return renderData;
    },
    _getDBViewRenderField: function(isSummary, filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect, dbviewSummaryAggregatePattern, isExpressionEnabled) {
        var tempRenderData, i;
        var isAdded = false;
        var renderField = [];
        var currentList3DataItems = DBViewDataHandler.bifercateCurrentList3DataItems(currentList3Data);
        if ($S.isArray(currentList3DataItems) && currentList3DataItems.length > 0) {
            for(i=0; i<currentList3DataItems.length; i++) {
                if (currentList3DataItems.length > 1) {
                    if ($S.isObject(currentList3DataItems[i])) {
                        if ($S.isStringV2(currentList3DataItems[i]["headingText"]) || $S.isObject(currentList3DataItems[i]["headingText"]) || $S.isArray(currentList3DataItems[i]["headingText"])) {
                            renderField.push({"tag": "div", "text": currentList3DataItems[i]["headingText"]});
                        }
                    }
                }
                tempRenderData = this._getDBViewRenderData(filteredData, currentList3DataItems[i], sortingFields, dateParameterField, dateSelect);
                if (tempRenderData === null || ($S.isArray(tempRenderData) && tempRenderData.length === 0)) {
                } else {
                    isAdded = true;
                    if (isSummary === true) {
                        renderField.push(DBViewTemplateHandler.GenerateDbViewSummaryRenderFieldV2(tempRenderData, currentList3DataItems[i], sortingFields, true, dbviewSummaryAggregatePattern, isExpressionEnabled));
                    } else {
                        renderField.push(DBViewTemplateHandler.GenerateDbViewRenderField(tempRenderData, currentList3DataItems[i], sortingFields, true));
                    }
                }
            }
        } else {
            tempRenderData = this._getDBViewRenderData(filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect);
            if (tempRenderData === null || ($S.isArray(tempRenderData) && tempRenderData.length === 0)) {
            } else {
                isAdded = true;
                if (isSummary === true) {
                    renderField.push(DBViewTemplateHandler.GenerateDbViewSummaryRenderFieldV2(tempRenderData, currentList3Data, sortingFields, true, dbviewSummaryAggregatePattern, isExpressionEnabled));
                } else {
                    renderField.push(DBViewTemplateHandler.GenerateDbViewRenderField(tempRenderData, currentList3Data, sortingFields, true));
                }
            }
        }
        if (isAdded === false) {
            renderField = DBViewTemplateHandler.getTemplate("noDataFound");
        }
        return renderField;
    },
    getDBViewRenderField: function(filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect) {
        var isSummary = false;
        return this._getDBViewRenderField(isSummary, filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect);
    },
    getDBViewSummaryRenderField: function(filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect, dbviewSummaryAggregatePattern, isExpressionEnabled) {
        var isSummary = true;
        return this._getDBViewRenderField(isSummary, filteredData, currentList3Data, sortingFields, dateParameterField, dateSelect, dbviewSummaryAggregatePattern, isExpressionEnabled);
    }
});

})($S);

export default DBViewAttendanceInterface;
