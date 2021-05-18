import $S from "../interface/stack.js";
import Api from '../common/Api.js';
import Config from "./Config";
import Template from "./Template";
import DataHandler from "./DataHandler";
import TemplateHelper from "../common/TemplateHelper";
import AppHandler from "../common/app/common/AppHandler";


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
    getRenderFieldRow: function() {
        var data = DataHandler.getData("users_control.response", []);
        if (!$S.isArray(data) || data.length < 1) {
            return AppHandler.getTemplate(Template, "noDataFound", []);
        }
        var renderFieldRow = AppHandler.getTemplate(Template, "usersControl", []);
        var rowTemplate;
        for (var i=0; i<data.length; i++) {
            rowTemplate = AppHandler.getTemplate(Template, "usersControl.row", []);
            if (data[i]["valid"]) {
                data[i]["valid"] = "True";
            } else {
                data[i]["valid"] = "False";
            }
            data[i]["s.no."] = i+1;
            TemplateHelper.updateTemplateText(rowTemplate, data[i]);
            TemplateHelper.addItemInTextArray(renderFieldRow, "usersControl.data", rowTemplate);
        }
        return renderFieldRow;
    }
});
})($S);

export default UserControl;
