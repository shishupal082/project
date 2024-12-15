import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
import FormHandler from "./forms/FormHandler";
import TemplateHandler from "./template/TemplateHandler";
import ApiHandler from "./api/ApiHandler";

// import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
// import DBViewTemplateHandler from "../../common/app/common/DBViewTemplateHandler";
import DBViewAttendanceInterface from "../../common/app/common/DBViewAttendanceInterface";
// import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";
// import DisplayPage from "./pages/DisplayPage";
import ScanDir from "./pages/ScanDir";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var CurrentData = $S.getDataObj();
var URlPaser = $S.getUrlParserObject(window.location.href);
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
keys.push("dbViewConfigDataLoadStatus");
keys.push("dbTableDataLoadStatus");
keys.push("local.loadDataByParamsStatus");
keys.push("local.loadDbTableDataStatus");
keys.push("filesInfoLoadStatus");

keys.push("sortingFields");
keys.push("dbViewData");
keys.push("dbViewDataTable");
keys.push("dbViewConfigDataTable");
keys.push("filesInfoData");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");
keys.push("pathParams");
keys.push("queryParams");

keys.push(Config.fieldsKey.UploadFile);

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("appRelatedDataLoadStatus", "not-started");
CurrentData.setData("dbViewConfigDataLoadStatus", "not-started");
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
        var value = CurrentData.getData(key, defaultValue, isDirect);
        var scanDirId;
        if (key === "pageName" && value === "home_id") {
            scanDirId = this.getUrlQueryParameter("id");
            if ($S.isStringV2(scanDirId)) {
                value += "_view";
            }
        }
        return value;
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
    getQueryParam: function(key, defaultValue) {
        return URlPaser.getData(key, defaultValue);
    },
    getCurrentUrl: function() {
        return window.location.href;
    },
    getUrlQueryParameter: function(key, defaultValue) {
        return $S.getUrlAttribute(this.getCurrentUrl(), key, defaultValue);
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
        var pageName = this.getData("pageName", "");
        var link = CommonConfig.basepathname  + "/" + index;
        var pid, id1, pageId, viewPageName;
        if (pageName === Config.viewPage) {
            viewPageName = this.getPathParamsData("viewPageName", "");
            link += "/view/" + viewPageName;
        } else if (pageName === Config.displayPage) {
            pageId = this.getPathParamsData("pageId");
            link += "/display/" + pageId;
        } else if (pageName === Config.projectId) {
            pid = this.getPathParamsData("pid");
            link += "/pid/" + pid;
        } else if (pageName === Config.id1Page) {
            pid = this.getPathParamsData("pid");
            id1 = this.getPathParamsData("id1");
            link += "/pid/" + pid + "/id1/" + id1;
        } else if (pageName === Config.manageFiles) {
            link = Config.pages.manageFiles;
        }
        return link;
    },
    getLinkV2: function(scanDirPageName) {
        var index = this.getPathParamsData("index");
        var scanDirId = this.getPathParamsData("id");
        var url = TemplateHandler.getHeaderLink(index, scanDirId, scanDirPageName);
        var queryParam = ScanDir.getQueryParamUrl();
        if ($S.isStringV2(queryParam)) {
            return url + "?" + queryParam;
        }
        return url;
    },
    getLinkV3: function(selectedRecursive) {
        var currentRecusrive = this.getQueryParam("recursive", "");
        if (currentRecusrive === selectedRecursive) {
            return "";
        }
        var index = this.getPathParamsData("index");
        var scanDirId = this.getPathParamsData("id");
        var scanDirPageName = this.getPathParamsData("scanDirPage")
        var url = TemplateHandler.getHeaderLink(index, scanDirId, scanDirPageName);
        var pathnameQuery = this.getQueryParam("pathname", "");
        var queryParam = "";
        if ($S.isStringV2(pathnameQuery)) {
            queryParam = "pathname=" + pathnameQuery;
        }
        if ($S.isStringV2(selectedRecursive)) {
            if ($S.isStringV2(queryParam)) {
                queryParam += "&recursive=" + selectedRecursive;
            } else {
                queryParam += "recursive=" + selectedRecursive;
            }
        }
        if ($S.isStringV2(queryParam)) {
            url += "?" + queryParam;
        }
        return url;
    },
    isDataLoadComplete: function() {
        var pageName = this.getData("pageName", "");
        var scanDirPage = this.getAppData("scanDirPage", "");
        if (pageName === Config.noMatch) {
            return true;
        }
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("appControlDataLoadStatus");
        if (["home"].indexOf(pageName)>=0) {
            dataLoadStatusKey.push("metaDataLoadStatus");
        }
        var status = CommonDataHandler.getDataLoadStatusByKey(dataLoadStatusKey);
        if (["origin"].indexOf(pageName)>=0) {
            return status === "completed";
        }
        dataLoadStatusKey = ["dbViewConfigDataLoadStatus"];
        if (["dbview","dbview_summary"].indexOf(scanDirPage)>=0) {
            dataLoadStatusKey.push("dbViewDataLoadStatus");
        }
        if(this.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
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
                if ($S.isStringV2(filterOptions[i].allFieldValue)) {
                    filterOptions[i].selectedValue = filterOptions[i].allFieldValue;
                } else {
                    filterOptions[i].selectedValue = "";
                }
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
        var appControlMetaData = CommonDataHandler.getData("appControlMetaData", {});
        var tempConfig = Config.tempConfig;
        return $S.findParam([currentAppData, metaData, appControlMetaData, tempConfig], key, defaultValue);
    },
    getCustomePageDataByKey: function(key, defaultValue) {
        return CommonDataHandler.getCustomePageDataByKey(key, defaultValue);
    }
});

DataHandler.extend({
    loadDataByPage: function(callback) {
        // DataHandlerV2.findCurrentList3Id();
        // this.setData("local.loadDataByParamsStatus", "in_progress");
        // this.setData("local.loadDbTableDataStatus", "in_progress");
        // var temp;
        // DataHandler.loadDbTableData(function() {
        //     DataHandler.setData("local.loadDbTableDataStatus", "completed");
        //     temp = DataHandler.getDataLoadStatusByKey(["local.loadDataByParamsStatus"]);
        //     if (temp === "completed") {
        //         $S.callMethod(callback);
        //     }
        // });
        // ApiHandler.loadDataByParams(function() {
        //     DataHandler.setData("local.loadDataByParamsStatus", "completed");
        //     temp = DataHandler.getDataLoadStatusByKey(["local.loadDbTableDataStatus"]);
        //     if (temp === "completed") {
        //         $S.callMethod(callback);
        //     }
        // });
        DataHandlerV2.findCurrentList3Id();
        $S.callMethod(callback);
    },
    setHeaderAndFooterData: function() {
        var afterLoginLinkJson = DataHandler.getAppData("afterLoginLinkJson", {});
        var footerLinkJsonAfterLogin = DataHandler.getAppData("footerLinkJsonAfterLogin", {});
        var enabledPages = DataHandlerV2.getEnabledPages();
        var enabledPageId = DataHandlerV2.getEnabledPageId();
        var enabledViewPage = DataHandlerV2.getEnabledViewPageName();
        var addBasepathLinkName = this.getAppData("addBasepathLinkName", []);
        DataHandlerV2.updateLinkIndex(afterLoginLinkJson, footerLinkJsonAfterLogin, enabledPageId, enabledViewPage)
        CommonDataHandler.setHeaderAndFooterData(addBasepathLinkName, afterLoginLinkJson, footerLinkJsonAfterLogin, enabledPageId, enabledViewPage, enabledPages);
        Config.headingJson = [];//AppHandler.GetStaticData("headingJson", [], "json");
        Config.afterLoginLinkJson = afterLoginLinkJson;
        Config.footerLinkJsonAfterLogin = footerLinkJsonAfterLogin;
    },
    loadDataByAppId: function(callback) {
        var currentList1Id = DataHandler.getPathParamsData("index", "");
        var metaDataLoadStatus = CommonDataHandler.getData("metaDataLoadStatus", "");
        var dbViewConfigDataLoadStatus = this.getData("dbViewConfigDataLoadStatus", "");
        var dbViewDataLoadStatus = this.getData("dbViewDataLoadStatus", "");
        var pageName = this.getData("pageName", "");
        if (["home", "scanDirPage"].indexOf(pageName)>=0) {
            if (metaDataLoadStatus !== "completed") {
                CommonDataHandler.loadMetaDataByAppId(Config.getConfigData("defaultMetaData", {}), currentList1Id, function() {
                    CommonDataHandler.setDateSelectParameter(currentList1Id);
                    ScanDir.loadScanDirConfigDataApi(pageName, function() {
                        ScanDir.loadScanDirDataApi(pageName, function() {
                            DataHandler.loadDataByPage(callback);
                        });
                    });
                });
            } else if (dbViewConfigDataLoadStatus !== "completed") {
                ScanDir.loadScanDirConfigDataApi(pageName, function() {
                    ScanDir.loadScanDirDataApi(pageName, function() {
                        DataHandler.loadDataByPage(callback);
                    });
                });
            } else if (dbViewDataLoadStatus !== "completed") {
                ScanDir.loadScanDirDataApi(pageName, function() {
                    DataHandler.loadDataByPage(callback);
                });
            } else {
                DataHandler.loadDataByPage(callback);
            }
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
        // this.setData("appRelatedDataLoadStatus", "not-started");
        this.setData("dbViewConfigDataLoadStatus", "not-started");
        this.setData("dbViewDataLoadStatus", "not-started");
        // this.setData("dbTableDataLoadStatus", "not-started");
        // this.setData("filesInfoLoadStatus", "not-started");
        // this.setData("addentry.submitStatus", "not-started");
        this.setData("firstTimeDataLoadStatus", "not-started");
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName = DataHandler.getData("pageName", "");
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
                        DataHandler.setHeaderAndFooterData();
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
    OnList2Change: function(appStateCallback, appDataCallback, name, list2Id) {
        AppHandler.TrackDropdownChange("list2Id", list2Id);
    },
    OnRecursiveChange: function(appStateCallback, appDataCallback, name, value) {
        AppHandler.TrackDropdownChange("recursive", value);
    },
    OnList3Change: function(appStateCallback, appDataCallback, name, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    HandleComponentChange: function(type, oldValue, newValue) {
        DataHandler.setData("componentChangeType", type);
        var isReset = false;
        var resultPattern = DataHandler.getAppData("resultPattern.dbview");
        var tableName = ScanDir.getTableName(resultPattern);
        if (type === "pageName" && [oldValue,newValue].indexOf(Config.origin) >= 0) {
            isReset = true;
        } else if (type === "pageName" && [oldValue,newValue].indexOf(Config.scanDirPage) >= 0) {
            this.setData("dbViewData", {});
            this.setData("dbViewConfigDataTable", []);
            this.setData("dbViewConfigDataLoadStatus", "not-started");
        } else if (type === "index") {
            this.setData("dbViewData", {});
            this.setData("dbViewConfigDataTable", []);
            this.setData("dbViewConfigDataLoadStatus", "not-started");
        } else if (type === "scanDirId") {
            this.setData("dbViewData", {});
            this.setData("dbViewConfigDataTable", []);
            this.setData("dbViewConfigDataLoadStatus", "not-started");
        } else if (type === "query.pathname") {
        }
        this.setData("dbViewDataTable", {});
        this.setData("dbViewDataLoadStatus", "not-started");
        DataHandlerV2.clearTableData(tableName);
        if (isReset) {
            this.resetAllFields();
        }
    },
    PageComponentDidUpdate: function(appStateCallback, appDataCallback, pageName, changeType) {
        this.setHeaderAndFooterData();
        this.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("dateSelect:" + value);
        CommonDataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        var pageName = DataHandler.getData("pageName", "");
        if (name === "upload_file_form") {
            FormHandler.submitUploadFile(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "upload_file_form_link") {
            FormHandler.submitAddLink(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "add-project-comment-form") {
            FormHandler.submitAddProjectComment(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "delete_file.form") {
            FormHandler.submitDeleteFile(pageName, value, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "add-project-files-form") {
            FormHandler.submitAddProjectFiles(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else {
            var configFormName = DataHandlerV2.getFormNameByPageName(pageName);
            if (configFormName === name) {
                var formType = DataHandlerV2.getFormTypeByPageName(pageName);
                FormHandler.submitGenericForm(pageName, name, formType, function() {
                    DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
                });
            }
        }
    },
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
    getRenderData: function(pageName, viewPageName) {
        var renderData;
        var appControlData = CommonDataHandler.getData("appControlData", []);
        var currentAppData = this.getCurrentAppData();
        var metaData = CommonDataHandler.getData("metaData");
        var currentList3Data = this.getCurrentList3Data();
        var sortingFields = this.getData("sortingFields", []);
        var filterOptions = DataHandler.getData("filterOptions", []);
        var dateSelect = CommonDataHandler.getData("date-select", "");
        var dateParameterField = DataHandlerV2.getDateParameterField();
        var userData = this.getData("dbViewDataTable");
        var filteredUserData = AppHandler.getFilteredData(currentAppData, metaData, userData, filterOptions, "name", dateParameterField);
        switch(pageName) {
            case "origin":
                renderData = appControlData;
            break;
            case "home":
                renderData = this.getData("dbViewConfigDataTable");
                renderData = DBViewAttendanceInterface.getDBViewRenderField(renderData, currentList3Data, sortingFields);
            break;
            case "scanDirPage":
                if (viewPageName === "dbview") {
                    renderData = DBViewAttendanceInterface.getDBViewRenderField(filteredUserData, currentList3Data, sortingFields, dateParameterField, dateSelect);
                } else if (viewPageName === "dbview_summary") {
                    renderData = DBViewAttendanceInterface.getDBViewSummaryRenderField(filteredUserData, currentList3Data, sortingFields, dateParameterField, dateSelect);
                } else {
                    renderData = TemplateHandler.getTemplate("noMatch");
                }
            break;
            default:
                renderData = [];
            break;
        }
        return renderData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var pageName= DataHandler.getData("pageName", "");
        var dataLoadStatus = this.isDataLoadComplete();
        var renderData = null;
        var appHeading = null;
        var list1Data = null;
        var list2Data = null;
        var list3Data = null;
        var filterOptions = null;
        var dateSelectionRequiredPages = [];
        var viewPageName = DataHandler.getPathParamsData("scanDirPage", "");
        if (dataLoadStatus) {
            renderData = this.getRenderData(pageName, viewPageName);
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        }
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, pageName);
        if (dataLoadStatus) {
            list1Data = DataHandlerV2.getList1Data();
            list2Data = DataHandlerV2.getList2Data();
            list3Data = DataHandlerV2.getList3Data();
            if (DataHandlerV2.isFilterEnabled(pageName, viewPageName)) {
                filterOptions = DataHandler.getData("filterOptions");
            }
            if (DataHandlerV2.isDateSelectionEnable(pageName, viewPageName)) {
                dateSelectionRequiredPages.push(pageName);
            }
        }
        appDataCallback("list1Data", list1Data);
        appDataCallback("currentList1Id", DataHandler.getPathParamsData("index", ""));
        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", DataHandler.getPathParamsData("scanDirPage", ""));
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
