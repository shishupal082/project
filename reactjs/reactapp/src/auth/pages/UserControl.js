import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
// import Config from "../common/Config";
import DataHandler from "../common/DataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import TemplateHelper from "../../common/TemplateHelper";

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
        var url = CommonConfig.getApiUrl("getRelatedUsersDataApi", false, true);
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
        var userControlPattern = DataHandler.getAppData("userControlPattern", []);
        if (!$S.isArray(response)) {
            response = [];
        }
        var resetValidMethods = ["create_password_error", "register_error"];
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": response}}, userControlPattern, resultCriteria, requiredDataTable);
        if ($S.isArray(finalTable)) {
            for(var i=0; i<finalTable.length; i++) {
                if ($S.isArray(finalTable[i]) && finalTable[i].length >= 8) {
                    if ($S.isObject(finalTable[i][6]) && finalTable[i][6]["name"] === "methodRequestCount") {
                        if ($S.isNumeric(finalTable[i][6]["value"]) && finalTable[i][6]["value"] * 1 > 1) {
                            if ($S.isObject(finalTable[i][7]) && finalTable[i][7]["name"] === "method" && resetValidMethods.indexOf(finalTable[i][7]["value"]) >= 0) {
                                if ($S.isObject(finalTable[i][0]) && finalTable[i][0]["name"] === "username") {
                                    TemplateHelper.updateTemplateValue(finalTable[i][6], {"user_control.reset_count_button": finalTable[i][0]["value"]});
                                }
                            } else {
                                finalTable[i][6]["text"] = finalTable[i][6]["value"];
                            }
                        } else {
                            finalTable[i][6]["text"] = finalTable[i][6]["value"];
                        }
                    }
                }
            }
        }
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
