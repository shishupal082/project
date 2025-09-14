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
    loadApiRoleMappingConfig: function(callback) {
        var url = Config.getApiUrl("api_role_mapping", null, true);
        if (!$S.isString(url)) {
            return $S.callMethod(callback);
        }
        var apiMappingData = [], roleData;
        $S.loadJsonData(null, [url], function(response, apiName, ajax){
            if ($S.isObject(response) && response["status"] === "SUCCESS" && $S.isObject(response["data"])) {
                for (var api_url in response["data"]) {
                    if (api_url) {
                        roleData = response["data"][api_url];
                        if ($S.isArray(roleData)) {
                            for (var i=0; i<roleData.length; i++) {
                                if ($S.isObject(roleData[i])) {
                                    //2 parameter role and source is coming from backend
                                    roleData[i]["api_name"] = api_url;
                                    apiMappingData.push(roleData[i]);
                                }
                            }
                        }
                    }
                }
                DataHandler.setData("apiRoleMappingData", apiMappingData);
            }
            $S.callMethod(callback);
        }, function() {
            $S.log("Load api_role_mapping complete.");
        }, "api_role_mapping", Api.getAjaxApiCallMethod());
    },
    loadDatabaseFiles: function(callback) {
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
    getList1Data: function(pageName) {
        var tableData = [];
        if (pageName === Config.api_role_mapping) {
            tableData = DataHandler.getData("apiRoleMappingData", []);
        } else if (pageName === Config.database_files) {
            tableData = DataHandler.getData("database_files.response", []);
        }
        if (tableData && tableData.length >= 1) {
            return DataHandler.getAppData("pageName:" + pageName + ".list1Data");
        }
        return null;
    },
    getFilterKeyMapping: function(pageName) {
        var filterKeyMapping = DataHandler.getAppData("pageName:" + pageName + ".filterKeyMapping");
        return filterKeyMapping;
    }
});

DatabaseFiles.extend({
    getRenderData: function(tableData,displayPattern,currentList3Data) {
        var resultCriteria = null, requiredDataTable = null, dateParameterField = null, dateSelect = null;
        if (!$S.isArray(tableData)) {
            tableData = [];
        }
        var filterOptions = DataHandler.getData("filterOptions", []);
        tableData = AppHandler.getFilteredData({}, {}, tableData, filterOptions, "name");
        var finalTable = DBViewDataHandler.GetFinalTable({"table1": {"tableData": tableData}}, displayPattern, resultCriteria, requiredDataTable);
        var renderData = DBViewDataHandler.GenerateFinalDBViewData(finalTable, currentList3Data, dateParameterField, dateSelect);
        return renderData;
    },
    getRenderFieldRow: function(tableData, displayPattern) {
        var dateParameterField = null, showReloadButton = false;
        var currentList3Data = DataHandler.getCurrentList1Data();
        var renderData = this.getRenderData(tableData,displayPattern,currentList3Data);
        var sortingFields = DataHandler.getData("sortingFields", []);
        renderData = DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
        var renderFieldRow = DBViewTemplateHandler.GenerateDbViewRenderField(renderData, currentList3Data, sortingFields, showReloadButton);
        return {"tag": "div", "className": "", "text": renderFieldRow};
    }
});
})($S);

export default DatabaseFiles;
