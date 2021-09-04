import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
// import AppHandler from '../../common/app/common/AppHandler.js';
import Config from "../common/Config";
import DataHandler from "../common/DataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";


var DatabaseFiles;

(function($S){
DatabaseFiles = function(arg) {
    return new DatabaseFiles.fn.init(arg);
};

DatabaseFiles.fn = DatabaseFiles.prototype = {
    constructor: DatabaseFiles,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(DatabaseFiles);

DatabaseFiles.extend({
    loadData: function(callback) {
        var url = Config.getApiUrl("getDatabaseFilesInfoApi", null, true);
        if (!$S.isString(url)) {
            return $S.callMethod(callback);
        }
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isArray(response["data"])) {
                DataHandler.setData("database_files.response", response["data"]);
            }
        }, function() {
            $S.log("Load database files info complete.");
            $S.callMethod(callback);
        }, "databaseFiles", Api.getAjaxApiCallMethod());
    }
});

DatabaseFiles.extend({
    getRenderData: function() {
        var resultCriteria = null, requiredDataTable = null, currentList3Data = null, dateParameterField = null, dateSelect = null;
        var response = DataHandler.getData("database_files.response", []);
        var databaseFilesPattern = DataHandler.getAppData("database_files_info.pattern", []);
        if (!$S.isArray(response)) {
            response = [];
        }
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": response}}, databaseFilesPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getRenderFieldRow: function() {
        var currentList3Data = null, dateParameterField = null;
        var renderData = this.getRenderData();
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields);
        return {"tag": "div", "className": "", "text": renderFieldRow};
    }
});
})($S);

export default DatabaseFiles;
