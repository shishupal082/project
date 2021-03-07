import $S from "../../interface/stack.js";
import DataHandler from "./DataHandler";
// import Config from "./Config";


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
    HandleReportTextLoad: function(response) {
        var workBreak = DataHandler.getWordBreak();
        var skipEmpty = DataHandler.isSkipEmpty();
        var responseArr = AppHandler.ParseTextData(response, workBreak, skipEmpty, true);
        DataHandler.setData("reportData", responseArr);
    }
});

})($S);

export default DataHandlerV2;
