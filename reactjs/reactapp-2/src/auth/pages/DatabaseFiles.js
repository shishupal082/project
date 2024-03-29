import $S from "../../interface/stack.js";

import Api from '../../common/Api.js';
import AppHandler from '../../common/app/common/AppHandler.js';
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
    getList1Data: function(pageName) {
        var list1Data = DataHandler.getAppData("pageName:" + pageName + ".list1Data");
        return list1Data;
    },
    getFilterKeyMapping: function(pageName) {
        var filterKeyMapping = DataHandler.getAppData("pageName:" + pageName + ".filterKeyMapping");
        return filterKeyMapping;
    },
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
    getRenderData: function(currentList3Data) {
        var resultCriteria = null, requiredDataTable = null, dateParameterField = null, dateSelect = null;
        var response = DataHandler.getData("database_files.response", []);
        var databaseFilesPattern = DataHandler.getAppData("database_files_info.pattern", []);
        if (!$S.isArray(response)) {
            response = [];
        }
        var filterOptions = DataHandler.getData("filterOptions", []);
        response = AppHandler.getFilteredData({}, {}, response, filterOptions, "name");
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": response}}, databaseFilesPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getRenderFieldRow: function() {
        var dateParameterField = null, showReloadButton = false;
        var currentList3Data = DataHandler.getCurrentList1Data();
        var renderData = this.getRenderData(currentList3Data);
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields, showReloadButton);
        return {"tag": "div", "className": "", "text": renderFieldRow};
    }
});
})($S);

export default DatabaseFiles;
