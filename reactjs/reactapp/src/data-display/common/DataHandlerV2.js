import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
import Config from "./Config";


import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";

var DataHandlerV2;

(function($S){
// var DT = $S.getDT();
DataHandlerV2 = function(arg) {
    return new DataHandlerV2.fn.init(arg);
};
DataHandlerV2.fn = DataHandlerV2.prototype = {
    constructor: DataHandlerV2,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandlerV2);

DataHandlerV2.extend({
    HandleReportTextLoad: function(finalResponse) {
        var workBreak = DataHandler.getWordBreak();
        var skipEmpty = DataHandler.isSkipEmpty();
        var responseArr = [];
        var i;
        for(i=0; i<finalResponse.length; i++) {
            responseArr = responseArr.concat(AppHandler.ParseTextData(finalResponse[i], workBreak, skipEmpty, true));
        }
        DataHandler.setData("reportData", responseArr);
    }
});
DataHandlerV2.extend({
    loadDataPath: function(callback) {
        var currentAppData = DataHandler.getCurrentAppData();
        var filenameUsername = $S.isString(currentAppData.filenameUsername) ? currentAppData.filenameUsername : ".";
        var fileType = $S.isString(currentAppData.fileType) ? currentAppData.fileType : "[.]txt";
        var api = Config.getApiUrl("dataPathApi", "", true);
        api += "filename="+fileType+"&username="+filenameUsername;
        $S.loadJsonData(null, [api], function(response, apiName, ajax){
            callback(response);
        }, null, null, Api.getAjaxApiCallMethod());
    }
});

})($S);

export default DataHandlerV2;
