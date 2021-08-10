import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
import Config from "../common/Config";
import DataHandler from "../common/DataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";


var UserControl;

(function($S){
UserControl = function(arg) {
    return new UserControl.fn.init(arg);
};

UserControl.fn = UserControl.prototype = {
    constructor: UserControl,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(UserControl);

UserControl.extend({
    loadRelatedUsersData: function(callback) {
        var url = Config.getApiUrl("getRelatedUsersData", false, true);
        if (!$S.isString(url)) {
            $S.callMethod(callback);
        }
        var finalResponse = [];
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isArray(response["data"])) {
                finalResponse = $S.sortResult(response["data"], "ascending", "username");
                DataHandler.setData("users_control.response", UserControl.getFinalTableData(finalResponse));
            }
        }, function() {
            $S.log("Load relatedUserData complete.");
            $S.callMethod(callback);
        }, null, Api.getAjaxApiCallMethod());
    }
});

UserControl.extend({
    getFinalTableData: function(response) {
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var userControlPattern = Config.userControlPattern;
        if (!$S.isArray(response)) {
            response = [];
        }
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": response}}, userControlPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getRenderFieldRow: function() {
        var currentList3Data = null, dateParameterField = null;
        var renderData = DataHandler.getData("users_control.response", []);
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return {"tag": "div", "className": "", "text": renderFieldRow};
    }
});
})($S);

export default UserControl;
