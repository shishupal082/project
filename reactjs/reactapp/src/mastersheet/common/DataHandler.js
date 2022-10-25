import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
import TemplateHandler from "./template/TemplateHandler";
import ApiHandler from "./api/ApiHandler";

// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");

keys.push("pageName");
keys.push("componentChangeType");



keys.push("currentList1Id");
// keys.push("currentList2Id");
keys.push("currentList3Id");
// keys.push("date-select");

keys.push("filterValues");
keys.push("filterOptions");


keys.push("appControlData");
keys.push("appControlMetaData");
keys.push("metaData");
keys.push("userData");
keys.push("filteredUserData");
keys.push("attendanceData");
keys.push("latestAttendanceData");

keys.push("loginUserDetailsLoadStatus");
keys.push("appControlDataLoadStatus");
keys.push("appRelatedDataLoadStatus");
keys.push("dbViewDataLoadStatus");
keys.push("dbTableDataLoadStatus");
keys.push("local.loadDbTableDataStatus");
keys.push("filesInfoLoadStatus");

keys.push("sortingFields");
keys.push("dbViewData");
keys.push("filesInfoData");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");
keys.push("pathParams");

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("appRelatedDataLoadStatus", "not-started");
CurrentData.setData("dbViewDataLoadStatus", "not-started");
CurrentData.setData("dbTableDataLoadStatus", "not-started");
CurrentData.setData("filesInfoLoadStatus", "not-started");

CurrentData.setData("addentry.submitStatus", "not-started");

CurrentData.setData("firstTimeDataLoadStatus", "not-started");


DataHandler = function(arg) {
    return new DataHandler.fn.init(arg);
};
DataHandler.fn = DataHandler.prototype = {
    constructor: DataHandler,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(DataHandler);

DataHandler.extend({
    setData: function(key, value, isDirect) {
        return CurrentData.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CurrentData.getData(key, defaultValue, isDirect);
    },
    clearFieldsData: function() {
        this.setData("fieldsData", {});
        CommonDataHandler.clearFieldsData();
    },
    setFieldsData: function(key, value) {
        var fieldsData = this.getData("fieldsData", {});
        if (!$S.isObject(fieldsData)) {
            fieldsData = {};
        }
        if ($S.isString(value)) {
            value = value.trim();
        }
        fieldsData[key] = value;
        this.setData("fieldsData", fieldsData);
    },
    getFieldsData: function(key, defaultValue) {
        var fieldsData = this.getData("fieldsData", {});
        if ($S.isString(key) && key.length > 0) {
            if ($S.isObject(fieldsData)) {
                if ($S.isUndefined(fieldsData[key])) {
                    return defaultValue;
                } else {
                    return fieldsData[key];
                }
            }
        }
        return defaultValue;
    },
    getPathParamsData: function(key, defaultValue) {
        return CommonDataHandler.getPathParamsData(key, defaultValue);
    },
    getDataLoadStatusByKey: function(keys) {
        var dataLoadStatus = [], i;
        var loadStatus;
        if ($S.isArray(keys)) {
            for (i = 0; i < keys.length; i++) {
                if ($S.isString(keys[i])) {
                    loadStatus = DataHandler.getData(keys[i], "");
                    dataLoadStatus.push(loadStatus);
                }
            }
        } else {
            return "";
        }
        for (i = 0; i < dataLoadStatus.length; i++) {
            if (dataLoadStatus[i] !== "completed") {
                return "";
            }
        }
        return "completed";
    },
    getLinkByIndex: function(index) {
        // var pageName = this.getData("pageName", "");
        var link = CommonConfig.basepathname  + "/" + index;
        return link;
    },
    // getLinkV2: function(id1) {
    //     var pid = this.getPathParamsData("pid");
    //     return this.getLinkV3(pid, id1);
    // },
    getLinkV3: function(pid, id1) {
        var index = this.getPathParamsData("index", "0");
        var link = CommonConfig.basepathname  + "/" + index + "/pid/" + pid;
        if ($S.isStringV2(id1)) {
            link += "/id1/" + id1;
        }
        return link;
    },
    isDataLoadComplete: function() {
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("appControlDataLoadStatus");
        dataLoadStatusKey.push("metaDataLoadStatus");
        if(CommonDataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        dataLoadStatusKey = ["dbViewDataLoadStatus", "dbTableDataLoadStatus"];
        var pageName = this.getData("pageName", "");
        if (pageName === "manageFiles") {
            dataLoadStatusKey.push("filesInfoLoadStatus");
        }
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        CommonDataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    getTableName: function(key) {
        var tableNames = this.getAppData("tableName", {});
        if ($S.isObject(tableNames) && $S.isStringV2(tableNames[key])) {
            return tableNames[key];
        }
        return null;
    }
});
DataHandler.extend({
    getCurrentAppData: function() {
        var appControlData = CommonDataHandler.getData("appControlData", []);
        var currentAppId = this.getPathParamsData("index", "");
        var currentAppData = {};
        if ($S.isArray(appControlData)) {
            for (var i = 0; i < appControlData.length; i++) {
                if (appControlData[i]["id"] === currentAppId) {
                    currentAppData = appControlData[i];
                    break;
                }
            }
        }
        return currentAppData;
    },
    getCurrentList3Data: function() {
        var list3Id = this.getData("currentList3Id", "");
        var list3Data = DataHandlerV2.getList3Data();
        var currentList3Data = {};
        if ($S.isArray(list3Data)) {
            for(var i=0; i<list3Data.length; i++) {
                if ($S.isObject(list3Data[i])) {
                    if (list3Data[i]["name"] === list3Id) {
                        currentList3Data = list3Data[i];
                        break;
                    }
                }
            }
        }
        return currentList3Data;
    },
    getHeadingText: function() {
        var currentAppData = this.getCurrentAppData();
        return AppHandler.getHeadingText(currentAppData, "App Heading");
    },
    applyResetFilter: function() {
        var filterOptions = DataHandler.getData("filterOptions", []);
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                filterOptions[i].selectedValue = "";
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", {});
    }
});

DataHandler.extend({
    getAppData: function(key, defaultValue) {
        if (!$S.isStringV2(key)) {
            return defaultValue;
        }
        var currentAppData = this.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData", {});
        var tempConfig = Config.tempConfig;
        return $S.findParam([currentAppData, metaData, tempConfig], key, defaultValue);
    }
});

DataHandler.extend({
    loadDataByPage: function(callback) {
        DataHandlerV2.findCurrentList3Id();
        this.setData("local.loadDbTableDataStatus", "in_progress");
        DataHandler.loadDbTableData(function() {
            DataHandler.setData("local.loadDbTableDataStatus", "completed");
            $S.callMethod(callback);
        });
    },
    loadDataByAppId: function(callback) {
        var currentList1Id = DataHandler.getPathParamsData("index", "");
        var status = CommonDataHandler.getData("metaDataLoadStatus", "");
        var pageName = this.getData("pageName", "");
        if (status !== "completed") {
            if (pageName === Config.manageFiles) {
                currentList1Id = this.getAppData("pageName:manageFiles.appIndex", "");
            }
            CommonDataHandler.loadMetaDataByAppId(Config.getConfigData("defaultMetaData", {}), currentList1Id, function() {
                CommonDataHandler.setDateSelectParameter(currentList1Id);
                DataHandler.loadDataByPage(callback);
            });
        } else {
            DataHandler.loadDataByPage(callback);
        }
    },
    loadDbTableData: function(callback) {
        var tableFilterParam = this.getAppData("tableFilterParam", {});
        var getTableDataApiNameKey = this.getAppData("getTableDataApiNameKey", "");
        var dbTableDataIndex = DataHandler.getAppData("dbTableDataIndex", {});
        var combineTableData = DataHandler.getAppData("combineTableData", []);
        var dbDataApis = DataHandler.getAppData("dbDataApis", {});
        ApiHandler.handlePageLoad(dbDataApis, dbTableDataIndex, function() {
            ApiHandler.handlePageLoadV2(getTableDataApiNameKey, tableFilterParam, dbTableDataIndex, combineTableData, function() {
                $S.callMethod(callback);
            });
        });
    },
    checkForRedirect: function(callback) {
        var isLogin = AppHandler.GetUserData("login", false);
        if ($S.isBooleanTrue(CommonConfig.forceLogin) && isLogin === false) {
            AppHandler.LazyRedirect(CommonConfig.getApiUrl("loginRedirectUrl", "", true), 250);
            return;
        }
        $S.callMethod(callback);
    },
    resetAllFields: function() {
        CommonDataHandler.clearMetaData();
        CommonDataHandler.setData("metaDataLoadStatus", "not-started");
        this.clearFieldsData();
        this.setData("dbViewData", {});
        this.setData("appRelatedDataLoadStatus", "not-started");
        this.setData("dbViewDataLoadStatus", "not-started");
        this.setData("dbTableDataLoadStatus", "not-started");
        this.setData("filesInfoLoadStatus", "not-started");
        this.setData("addentry.submitStatus", "not-started");
        this.setData("firstTimeDataLoadStatus", "not-started");
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName = DataHandler.getData("pageName", "");
        if (pageName === Config.origin) {
            AppHandler.LazyRedirect(CommonConfig.basepathname + "/0", 250);
            return;
        }
        var staticDataUrl = CommonConfig.getApiUrl("getStaticDataApi", null, true);
        CommonDataHandler.loadLoginUserDetailsData(function() {
            AppHandler.TrackPageView(pageName);
            DataHandler.checkForRedirect(function() {
                AppHandler.LoadStaticData(staticDataUrl, function() {
                    CommonDataHandler.loadAppControlData(Config.getConfigData("defaultMetaData", {}), function() {
                        var title = DataHandler.getAppData("title", "");
                        if ($S.isStringV2(title) && CommonConfig.JQ) {
                            CommonConfig.JQ("title").html(title);
                        }
                        DataHandler.loadDataByAppId(function() {
                            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                        });
                    });
                });
            });
        });
    },
    OnReloadClick: function(appStateCallback, appDataCallback) {
        AppHandler.TrackEvent("reloadClick");
        this.resetAllFields();
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        // DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        // AppHandler.TrackDropdownChange("list1", list1Id);
        // this.OnReloadClick(appStateCallback, appDataCallback);
    },
    // OnList2Change: function(appStateCallback, appDataCallback, name, list2Id) {
    //     AppHandler.TrackDropdownChange("list2Id", list2Id);
    // },
    OnList3Change: function(appStateCallback, appDataCallback, name, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    HandleComponentChange: function(type, oldValue, newValue) {
        DataHandler.setData("componentChangeType", type);
        var isReset = false;
        if (type === "index" || type === "pageName") {
            if (type === "pageName") {
                if ($S.isStringV2(oldValue) && $S.isStringV2(newValue)) {
                    if ([oldValue, newValue].indexOf(Config.manageFiles) >= 0) {
                        isReset = true;
                    }
                }
            } else {
                isReset = true;
            }
        }
        if (isReset) {
            this.resetAllFields();
        }
    },
    PageComponentDidUpdate: function(appStateCallback, appDataCallback, pageName, changeType) {
        this.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("dateSelect:" + value);
        CommonDataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {},
    ViewFileClick: function(appStateCallback, appDataCallback, name, value) {
        console.log(name + ":" + value);
    },
    OnClick: function(appStateCallback, appDataCallback, name, value) {
        if (name === "delete_file.form.button") {
            DataHandler.setFieldsData(name, value);
            DataHandler.setFieldsData("remove_file.form.button", "");
        } else if (name === "remove_file.form.button") {
            DataHandler.setFieldsData(name, value);
            DataHandler.setFieldsData("delete_file.form.button", "");
        }
    },
    SortClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("sort:" + value);
        var sortingFields = DataHandler.getData("sortingFields", []);
        var finalSortingField = DBViewDataHandler.UpdateSortingFields(sortingFields, value);
        DataHandler.setData("sortingFields", finalSortingField);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFilterChange: function(appStateCallback, appDataCallback, name, value) {
        var filterValues = DataHandler.getData("filterValues", {});
        var filterOptions = DataHandler.getData("filterOptions", []);
        AppHandler.TrackEvent("filterChange:" + value);
        if (!$S.isObject(filterValues)) {
            filterValues = {};
        }
        filterValues[name] = value;
        if ($S.isArray(filterOptions)) {
            for (var i = 0; i<filterOptions.length; i++) {
                if (filterOptions[i].selectName === name) {
                    filterOptions[i].selectedValue = value;
                }
            }
        }
        DataHandler.setData("filterOptions", filterOptions);
        DataHandler.setData("filterValues", filterValues);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnDropdownChange: function(appStateCallback, appDataCallback, name, value) {
        if (name === "") {
            return;
        }
        DataHandler.setFieldsData(name, value);
        CommonDataHandler.setFieldsData(name, value);
    },
    OnResetClick: function(appStateCallback, appDataCallback, name, value) {
        AppHandler.TrackEvent("resetClick");
        DataHandler.applyResetFilter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFileUploadChange: function(appStateCallback, appDataCallback, name, value) {
        this.setData(name, value, true);
    },
    OnInputChange: function(appStateCallback, appDataCallback, name, value) {
        this.setFieldsData(name, value);
        CommonDataHandler.setFieldsData(name, value);
    }
});
DataHandler.extend({
    getRenderData: function(pageName, pageId, viewPageName) {
        var renderData;
        var tableName;
        switch(pageName) {
            case "home":
                tableName = this.getAppData("templateDataTableName", "");
                renderData = DataHandlerV2.getTableData(tableName);
            break;
            default:
                renderData = [];
            break;
        }
        return renderData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var renderData = null;
        var appHeading = null;
        var list1Data = null;
        var list3Data = null;
        var filterOptions = null;
        var dateSelectionRequiredPages = [];
        var pageName= DataHandler.getData("pageName", "");
        var pageId = DataHandler.getPathParamsData("pageId", "");
        var viewPageName = DataHandler.getPathParamsData("viewPageName", "");
        if (dataLoadStatus) {
            renderData = this.getRenderData(pageName, pageId, viewPageName);
        }
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, pageName);
        if (dataLoadStatus) {
            list1Data = DataHandlerV2.getList1Data();
            list3Data = DataHandlerV2.getList3Data();
            if (DataHandlerV2.isFilterEnabled(pageName, pageId, viewPageName)) {
                filterOptions = DataHandler.getData("filterOptions");
            }
            if (DataHandlerV2.isDateSelectionEnable(pageName, pageId, viewPageName)) {
                dateSelectionRequiredPages.push(pageName);
            }
        }
        appDataCallback("list1Data", list1Data);
        appDataCallback("currentList1Id", DataHandler.getPathParamsData("index", ""));
        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", DataHandler.getData("currentList3Id", ""));
        appDataCallback("enableReloadButton", DataHandler.getAppData("enableReloadButton", false));
        appDataCallback("appHeading", appHeading);
        appDataCallback("renderFieldRow", [renderFieldRow, {"tag": "div.center", "text": $S.clone(Config.footerLinkJsonAfterLogin)}]);

        appDataCallback("dateSelectionRequiredPages", dateSelectionRequiredPages);
        appDataCallback("dateSelection", Config.dateSelection);
        appDataCallback("selectedDateType", CommonDataHandler.getData("date-select", ""));
        appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
        appStateCallback();
    }
});

})($S);

export default DataHandler;
