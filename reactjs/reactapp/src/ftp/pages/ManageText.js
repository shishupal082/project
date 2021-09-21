import $S from "../../interface/stack.js";

// import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";



// import Config from "../common/Config";
// import GATracking from "../common/GATracking";
// import Template from "../common/Template";
import DataHandler from "../common/DataHandler";


var ManageText;

(function($S){
ManageText = function(arg) {
    return new ManageText.fn.init(arg);
};

ManageText.fn = ManageText.prototype = {
    constructor: ManageText,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};
$S.extendObject(ManageText);

ManageText.extend({
    getRenderFieldRow: function(pageName) {
        var resultPattern = DataHandler.getAppData("resultPattern", []);
        var resultCriteria = DataHandler.getAppData("resultCriteria", []);
        var database = DataHandler.getData("database", {});
        var requiredDataTable = DataHandler.getAppData("requiredDataTable", []);
        var currentList3Data = null, sortingFields = null, viewReloadOption = false;
        var finalTable = DBViewDataHandler.GetFinalTableV2(database, resultCriteria, requiredDataTable);
        finalTable = DBViewDataHandler.ApplyResultPattern(finalTable, resultPattern);
        finalTable = DBViewTemplateHandler.GenerateDbViewRenderField(finalTable, currentList3Data, sortingFields, viewReloadOption);
        return finalTable;
    }
});
ManageText.extend({
    _loadTableData: function(pageName, callback) {
        var getTableDataApiNameKey = DataHandler.getAppData("getTableDataApiNameKey", "");
        var tableFilterParam = DataHandler.getAppData("tableFilterParam", {});
        var dbTableDataIndex = DataHandler.getAppData("dbTableDataIndex", {});
        var combineTableData = DataHandler.getAppData("combineTableData", {});
        var defaultSorting = DataHandler.getAppData("defaultSorting", []);
        var url = CommonConfig.getApiUrl(getTableDataApiNameKey, null, true);
        AppHandler.LoadTableData(url, tableFilterParam, dbTableDataIndex, function(database) {
            AppHandler.CombineTableData(database, combineTableData);
            DBViewDataHandler.SortTableData(database, defaultSorting);
            if ($S.isObject(database)) {
                DataHandler.setData("database", database);
            }
            $S.callMethod(callback);
        });
    },
    _loadMetaData: function(pageName, callback) {
        var appControlMetaData = DataHandler.getData("appControlMetaData", {});
        DataHandler.setData("metaData", appControlMetaData);
        this._loadTableData(pageName, callback);
    },
    loadPageData: function(pageName, callback) {
        var appControlApi = AppHandler.GetStaticDataJsonFile("manageTextControlDataApi", null);
        if (!$S.isStringV2(appControlApi)) {
            return $S.callMethod(callback);
        }
        appControlApi = CommonConfig.baseApi + appControlApi + "?v=" + CommonConfig.requestId;
        AppHandler.loadAppControlData(appControlApi, null, null, null, function(list1Data, appControlMetaData) {
            DataHandler.setData("list1Data", list1Data);
            DataHandler.setData("appControlMetaData", appControlMetaData);
            ManageText._loadMetaData(pageName, callback)
        });
    }
});
ManageText.extend({
    _deleteText: function(deleteId, callback) {
        if (!$S.isStringV2(deleteId)) {
            deleteId = "";
        }
        var postData = {};
        postData["deleteId"] = deleteId;
        $S.callMethodV2(this._handleDeleteResponse, callback, "in_progress");
        $S.sendPostRequest(CommonConfig.JQ, CommonConfig.getApiUrl("deleteText", null, true), postData, function(ajax, status, response) {
            if (status === "FAILURE") {
                AppHandler.TrackApiRequest("deleteText", "FAILURE");
                alert("Error in uploading data, Please Try again.");
            } else if ($S.isObject(response) && response.status === "FAILURE") {
                AppHandler.TrackApiRequest("deleteText", "FAILURE");
                alert(response.error);
            } else {
                AppHandler.TrackApiRequest("deleteText", "SUCCESS");
                AppHandler.LazyReload(250);
            }
        });
    },
    deleteText: function(pageName, deleteId) {
        var deleting = window.confirm("Are you sure? You want to delete.");
        if (deleting) {
            this._deleteText(deleteId);
        }
    }
});
})($S);

export default ManageText;
