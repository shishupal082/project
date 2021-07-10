import $S from "../../../interface/stack.js";
import Config from "../Config";
import DataHandler from "../DataHandler";
// import TemplateHandler from "../template/TemplateHandler";
// import DisplayUploadedFiles from "../pages/DisplayUploadedFiles";

import Api from "../../../common/Api";
import AppHandler from "../../../common/app/common/AppHandler";
// import DBViewDataHandler from "../../../common/app/common/DBViewDataHandler";

var ApiHandler;

(function($S){
ApiHandler = function(arg) {
    return new ApiHandler.fn.init(arg);
};
ApiHandler.fn = ApiHandler.prototype = {
    constructor: ApiHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(ApiHandler);
ApiHandler.extend({
    _loadFileInfoData: function(callback) {
        var url = Config.getApiUrl("getFilesInfoApi", "", true);
        DataHandler.setData("filesInfoLoadStatus", "in_progress");
        var request = [], temp;
        if ($S.isStringV2(url)) {
            temp = {};
            temp.apiName = "getFilesInfoApi";
            temp.requestMethod = Api.getAjaxApiCallMethod();
            temp.url = [url];
            request.push(temp);
            AppHandler.LoadDataFromRequestApi(request, function() {
                DataHandler.setData("filesInfoLoadStatus", "completed");
                if ($S.isArray(request) && request.length === 1 && $S.isArray(request[0].response) && $S.isArray(request[0].response)) {
                    if (request[0].response.length === 1 && $S.isObject(request[0].response[0])) {
                        if (request[0].response[0].status === "SUCCESS") {
                            DataHandler.setData("filesInfoData", request[0].response[0].data);
                        }
                    }
                }
                $S.callMethod(callback);
            });
        } else {
            DataHandler.setData("filesInfoLoadStatus", "completed");
            $S.callMethod(callback);
        }
    },
    loadDataByParams: function(callback) {
        var pageName = DataHandler.getData("pageName", "");
        var viewPageName = DataHandler.getPathParamsData("viewPageName", "");
        if (pageName === "viewPage" && viewPageName === "manageFiles") {
            this._loadFileInfoData(callback);
        } else {
            $S.callMethod(callback);
        }
    }
});
})($S);

export default ApiHandler;
