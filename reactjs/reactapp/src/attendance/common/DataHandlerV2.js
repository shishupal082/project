import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
// import Config from "./Config";


// import Api from "../../common/Api";
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
    _generateResponse: function(response) {
        var finalData = [];
        if ($S.isArray(response)) {
            for (var i = 0; i<response.length; i++) {
                finalData = finalData.concat(AppHandler.ParseTextData(response[i], ",", true, true));
            }
        }
        return finalData;
    },
    handleUserDataLoad: function(response) {
        var userData = this._generateResponse(response);
        DataHandler.setData("userData", userData);
    },
    handleRawDataLoad: function(response) {
        var rawData = this._generateResponse(response);
        DataHandler.setData("rawData", rawData);
    },
    handleMetaDataLoad: function(metaDataResponse) {
        var finalMetaData = {};
        if ($S.isArray(metaDataResponse)) {
            for (var i=0; i<metaDataResponse.length; i++) {
                if ($S.isObject(metaDataResponse[i])) {
                    finalMetaData = Object.assign(finalMetaData, metaDataResponse[i]);
                }
            }
        }
        DataHandler.setData("metaData", finalMetaData);
        DataHandler.metaDataInit();
    }
});

})($S);

export default DataHandlerV2;
