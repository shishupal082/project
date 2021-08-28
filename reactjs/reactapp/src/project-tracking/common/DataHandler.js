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
// import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";
import DisplayPage from "./pages/DisplayPage";

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
keys.push("date-select");

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
keys.push("filesInfoLoadStatus");

keys.push("sortingFields");
keys.push("dbViewData");
keys.push("filesInfoData");

keys.push("firstTimeDataLoadStatus");

keys.push("dateParameters");

keys.push("fieldsData");
keys.push("pathParams");

keys.push(Config.fieldsKey.UploadFile);

//TA page
//Add Field Report Page
keys.push("addentry.submitStatus");

CurrentData.setKeys(keys);


CurrentData.setData("loginUserDetailsLoadStatus", "not-started");
CurrentData.setData("appControlDataLoadStatus", "not-started");
CurrentData.setData("appRelatedDataLoadStatus", "not-started");
CurrentData.setData("dbViewDataLoadStatus", "not-started");
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
    getLinkV2: function(id1) {
        var pid = this.getPathParamsData("pid");
        return this.getLinkV3(pid, id1);
    },
    getLinkV3: function(pid, id1) {
        var link = CommonConfig.basepathname + "/pid/" + pid;
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
        dataLoadStatusKey = ["dbViewDataLoadStatus"];
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        var pageName = this.getData("pageName", "");
        if (pageName === "viewPage") {
            dataLoadStatusKey.push("filesInfoLoadStatus");
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
    setCurrentAppId: function(appId) {
        var appControlData = CommonDataHandler.getData("appControlData", []);
        var currentList1Id = "";
        if ($S.isArray(appControlData) && appControlData.length > 0) {
            if ($S.isString(appControlData[0]["id"])) {
                currentList1Id = appControlData[0]["id"];
            }
        }
        DataHandler.setData("currentList1Id", currentList1Id);
    },
    getCurrentAppData: function() {
        var appControlData = CommonDataHandler.getData("appControlData", []);
        var currentAppId = this.getData("currentList1Id", "");
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
    // loadUserRelatedData: function(callback) {
    //     var loginUserDetailsApi = CommonConfig.getApiUrl("getLoginUserDetailsApi", null, true);
    //     if ($S.isString(loginUserDetailsApi)) {
    //         DataHandler.setData("loginUserDetailsLoadStatus", "in_progress");
    //         AppHandler.LoadLoginUserDetails(loginUserDetailsApi, function() {
    //             var isLogin = AppHandler.GetUserData("login", false);
    //             if ($S.isBooleanTrue(Config.forceLogin) && isLogin === false) {
    //                 AppHandler.LazyRedirect(CommonConfig.getApiUrl("loginRedirectUrl", "", true), 250);
    //                 return;
    //             }
    //             DataHandler.setData("loginUserDetailsLoadStatus", "completed");
    //             $S.callMethod(callback);
    //         });
    //     } else {
    //         DataHandler.setData("loginUserDetailsLoadStatus", "completed");
    //         $S.callMethod(callback);
    //     }
    // },
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
        DataHandler.loadDbTableData(callback);
        ApiHandler.loadDataByParams(callback);
    },
    setHeaderAndFooterData: function() {
        var afterLoginLinkJson = DataHandler.getAppData("afterLoginLinkJson", {});
        var footerLinkJsonAfterLogin = DataHandler.getAppData("footerLinkJsonAfterLogin", {});
        var enabledPageId = DataHandlerV2.getEnabledPageId();
        var enabledViewPage = DataHandlerV2.getEnabledViewPageName();
        CommonDataHandler.setHeaderAndFooterData(afterLoginLinkJson, footerLinkJsonAfterLogin, enabledPageId, enabledViewPage);
        Config.headingJson = AppHandler.GetStaticData("headingJson", [], "json");
        Config.afterLoginLinkJson = afterLoginLinkJson;
        Config.footerLinkJsonAfterLogin = footerLinkJsonAfterLogin;
    },
    loadDataByAppId: function(callback) {
        var currentList1Id = DataHandler.getData("currentList1Id", "");
        CommonDataHandler.loadMetaDataByAppId(Config.getConfigData("defaultMetaData", {}), currentList1Id, function() {
            CommonDataHandler.setDateSelectParameter(currentList1Id);
            DataHandler.setHeaderAndFooterData();
            DataHandler.loadDataByPage(callback);
        });
    },
    loadDbTableData: function(callback) {
        var metaData = CommonDataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var dbDataApis = $S.findParam([currentAppData, metaData], "dbDataApis", []);
        ApiHandler.handlePageLoad(dbDataApis, function() {
            $S.callMethod(callback);
        });
    },
    checkForRedirect: function(callback) {
        var isLogin = AppHandler.GetUserData("login", false);
        if ($S.isBooleanTrue(CommonConfig.forceLogin) && isLogin === false) {
            AppHandler.LazyRedirect(CommonConfig.getApiUrl("loginRedirectUrl", "", true), 250);
            return;
        }
        $S.callMethod(callback);
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName;
        var staticDataUrl = CommonConfig.getApiUrl("getStaticDataApi", null, true);
        CommonDataHandler.loadLoginUserDetailsData(function() {
            pageName = DataHandler.getData("pageName", "");
            AppHandler.TrackPageView(pageName);
            DataHandler.checkForRedirect(function() {
                AppHandler.LoadStaticData(staticDataUrl, function() {
                    CommonDataHandler.loadAppControlData(function() {
                        DataHandler.setCurrentAppId();
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
        DataHandler.setData("filesInfoLoadStatus", "not-started");
        DataHandler.loadDataByAppId(function() {
            DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        });
        // DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList1Change: function(appStateCallback, appDataCallback, list1Id) {
        // AppHandler.TrackDropdownChange("list1", list1Id);
        // DataHandler.setData("currentList1Id", list1Id);
        // this.OnReloadClick(appStateCallback, appDataCallback, list1Id);
    },
    OnList2Change: function(appStateCallback, appDataCallback, name, list2Id) {
        AppHandler.TrackDropdownChange("list2Id", list2Id);
    },
    OnList3Change: function(appStateCallback, appDataCallback, name, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    HandleComponentChange: function(type) {
        DataHandler.setData("componentChangeType", type);
    },
    PageComponentDidUpdate: function(appStateCallback, appDataCallback, pageName, changeType) {
        if (pageName === Config.displayPage) {
            DataHandlerV2.findCurrentList3Id();
        }
        this.loadDataByPage(function() {
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
    getRenderData: function() {
        var renderData;
        var currentAppData = this.getCurrentAppData();
        var currentList3Data = this.getCurrentList3Data();
        var pageId = this.getPathParamsData("pageId", "");
        var viewPageName = this.getPathParamsData("viewPageName", "");
        var dateSelect = CommonDataHandler.getData("date-select", "");
        var metaData = CommonDataHandler.getData("metaData");
        var pageName = this.getData("pageName", "");
        var sortingFields = this.getData("sortingFields", []);
        var filterOptions = this.getData("filterOptions");
        var dateParameterField = this.getAppData("pageId:" + pageId + ".dateParameterField", {});
        if (DataHandlerV2.isDisabled("pageName", pageName)) {
            return {"status": "FAILURE", "reason": "Requested page disabled"};
        }
        switch(pageName) {
            case "home":
                var configFormName = DataHandlerV2.getFormNameByPageName(pageName);
                renderData = DataHandlerV2.getTableData(this.getTableName(configFormName + ".tableName"));
            break;
            case "projectId":
                renderData = DataHandlerV2.getProjectDataV2(pageName);
            break;
            case "id1Page":
                renderData = DataHandlerV2.getProjectDataV3(pageName);
            break;
            case "displayPage":
                if (DataHandlerV2.isDisabled("pageId", pageId)) {
                    return {"status": "FAILURE", "reason": "Requested page disabled"};
                }
                renderData = DisplayPage.getRenderData(pageName, sortingFields);
                renderData = AppHandler.getFilteredData(currentAppData, metaData, renderData, filterOptions, "name");
                renderData = DBViewDataHandler.GenerateFinalDBViewData(renderData, currentList3Data, dateParameterField, dateSelect);
                DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
            break;
            case "viewPage":
                if (DataHandlerV2.isDisabled("viewPage", viewPageName)) {
                    return {"status": "FAILURE", "reason": "Requested page disabled"};
                }
                renderData = DisplayPage.getRenderDataV2(pageName, viewPageName, sortingFields);
                renderData = AppHandler.getFilteredData(currentAppData, metaData, renderData, filterOptions, "name");
                renderData = DBViewDataHandler.GenerateFinalDBViewData(renderData, currentList3Data, dateParameterField, dateSelect);
                DBViewDataHandler.SortDbViewResult(renderData, sortingFields, dateParameterField);
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
        var footerData = null;
        var appHeading = null;
        var list3Data = null;
        var filterOptions = null;
        var dateSelectionRequiredPages = [];
        var pageName= DataHandler.getData("pageName", "");
        var pageId = DataHandler.getPathParamsData("pageId", "");
        if (dataLoadStatus) {
            renderData = this.getRenderData();
            footerData = AppHandler.GetFooterData(CommonDataHandler.getData("metaData", {}));
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        }
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, pageName);
        if (dataLoadStatus) {
            list3Data = DataHandlerV2.getList3Data();
            dateSelectionRequiredPages.push(pageName);
            if (DataHandlerV2.isFilterEnabled(pageName, pageId)) {
                filterOptions = DataHandler.getData("filterOptions");
            }
        }
        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", DataHandler.getData("currentList3Id", ""));

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
