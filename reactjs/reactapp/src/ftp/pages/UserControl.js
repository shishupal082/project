import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
// import TemplateHelper from "../../common/TemplateHelper";
// import AppHandler from "../../common/app/common/AppHandler";

import Config from "../common/Config";
// import Template from "../common/Template";
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
    loadPageData: function(callback) {
        var url = Config.getApiUrl("getRelatedUsersData", false, true);
        if (!$S.isString(url)) {
            $S.callMethod(callback);
        }
        var finalResponse = [];
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isArray(response["data"])) {
                finalResponse = $S.sortResult(response["data"], "ascending", "username");
            }
        }, function() {
            $S.log("Load relatedUserData complete.");
            if ($S.isFunction(callback)) {
                callback(finalResponse);
            }
        }, null, Api.getAjaxApiCallMethod());
    }
});

UserControl.extend({
    getFinalTableUserControl: function(response) {
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
        return {"tag": "div", "className": "container", "text": renderFieldRow};
    }
});
})($S);

export default UserControl;
