import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
import FormHandler from "./forms/FormHandler";
import TemplateHandler from "./template/TemplateHandler";

import Api from "../../common/Api";
import AppHandler from "../../common/app/common/AppHandler";
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

// keys.push("sortable");
// keys.push("sortableValue");
keys.push("sortingFields");
keys.push("dbViewData");
// keys.push("dbViewDataTable");
keys.push("dbViewDataLoadStatus");

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
        var pathParams = this.getData("pathParams", {});
        if ($S.isString(key) && key.length > 0) {
            if ($S.isObject(pathParams)) {
                if ($S.isUndefined(pathParams[key])) {
                    return defaultValue;
                } else {
                    return pathParams[key];
                }
            }
        }
        return defaultValue;
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
    getLink: function(pid, sid, page) {
        var link = Config.basepathname + "/pid/" + pid + "/sid/" + sid + "/" + page;
        return link;
    },
    isDataLoadComplete: function() {
        var dataLoadStatusKey = [];
        dataLoadStatusKey.push("loginUserDetailsLoadStatus");
        dataLoadStatusKey.push("appControlDataLoadStatus");
        dataLoadStatusKey.push("appRelatedDataLoadStatus");
        if(DataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        DataHandler.setData("firstTimeDataLoadStatus", "completed");
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
        var appControlData = this.getData("appControlData", []);
        var currentList1Id = "";
        if ($S.isArray(appControlData) && appControlData.length > 0) {
            if ($S.isString(appControlData[0]["id"])) {
                currentList1Id = appControlData[0]["id"];
            }
        }
        DataHandler.setData("currentList1Id", currentList1Id);
    },
    // GetDataParameterFromDate: function(dateRange) {
    //     var allDate, tempAllDate, arrangedDate, startLimit, endLimit;
    //     var i;
    //     if ($S.isArray(dateRange) && dateRange.length === 2) {
    //         allDate = AppHandler.GenerateDateBetween2Date(dateRange[0], dateRange[1]);
    //         startLimit = dateRange[0];
    //         endLimit = dateRange[1];
    //         tempAllDate = allDate.map(function(el, index, arr) {
    //             return el.dateStr;
    //         });
    //         arrangedDate = AppHandler.generateDateSelectionParameter(tempAllDate);
    //         if ($S.isObject(arrangedDate)) {
    //             for(var key in arrangedDate) {
    //                 if ($S.isArray(arrangedDate[key])) {
    //                     for (i=0; i<arrangedDate[key].length; i++) {
    //                         if ($S.isArray(arrangedDate[key][i].dateRange) && arrangedDate[key][i].dateRange.length === 2) {
    //                             arrangedDate[key][i].allDate = AppHandler.GenerateDateBetween2Date(arrangedDate[key][i].dateRange[0], arrangedDate[key][i].dateRange[1], startLimit, endLimit);
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     return arrangedDate;
    // },
    // generateDateParameter: function() {
    //     var currentAppData = DataHandler.getCurrentAppData();
    //     var metaData = DataHandler.getData("metaData", {});
    //     var selectedDateRange = this.getCurrentList3Data();
    //     var dateRange = $S.findParam([selectedDateRange, currentAppData, metaData], "dateRange", []);
    //     DataHandler.setData("dateParameters", this.GetDataParameterFromDate(dateRange));
    // },
    getCurrentAppData: function() {
        var appControlData = this.getData("appControlData", []);
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
    loadUserRelatedData: function(callback) {
        var loginUserDetailsApi = Config.getApiUrl("getLoginUserDetails", null, true);
        if ($S.isString(loginUserDetailsApi)) {
            DataHandler.setData("loginUserDetailsLoadStatus", "in_progress");
            AppHandler.LoadLoginUserDetails(Config.getApiUrl("getLoginUserDetails", null, true), function() {
                var isLogin = AppHandler.GetUserData("login", false);
                if ($S.isBooleanTrue(Config.forceLogin) && isLogin === false) {
                    AppHandler.LazyRedirect(Config.getApiUrl("loginRedirectUrl", "", true), 250);
                    return;
                }
                DataHandler.setData("loginUserDetailsLoadStatus", "completed");
                $S.callMethod(callback);
            });
        } else {
            DataHandler.setData("loginUserDetailsLoadStatus", "completed");
            $S.callMethod(callback);
        }
    },
    getAppData: function(key, defaultValue) {
        if (!$S.isStringV2(key)) {
            return defaultValue;
        }
        var currentAppData = this.getCurrentAppData();
        var metaData = this.getData("metaData", {});
        var tempConfig = Config.tempConfig;
        return $S.findParam([currentAppData, metaData, tempConfig], key, defaultValue);
    }
});

DataHandler.extend({
    loadDataByAppId: function(callback) {
        var appControlData = DataHandler.getCurrentAppData();//{}
        var request = [], metaDataApi = [];
        if ($S.isArray(appControlData["metaDataApi"])) {
            metaDataApi = appControlData["metaDataApi"];
        }
        metaDataApi = metaDataApi.map(function(el, i, arr) {
            return Config.baseApi + el + "?v=" + Config.appVersion;
        });
        var metaDataRequest = {
                            "url": metaDataApi,
                            "apiName": "metaData",
                            "requestMethod": Api.getAjaxApiCallMethod()};
        request.push(metaDataRequest);
        DataHandler.setData("appRelatedDataLoadStatus", "in_progress");
        DataHandler.setData("dbViewDataLoadStatus", "not-started");
        AppHandler.LoadDataFromRequestApi(request, function() {
            for(var i=0; i<request.length; i++) {
                if (request[i].apiName === "metaData") {
                    DataHandlerV2.handleMetaDataLoad(request[i].response);
                }
            }
            // DataHandler.generateDateParameter();
            DataHandler.setData("appRelatedDataLoadStatus", "completed");
            $S.log("currentAppData load complete");
            DataHandler.handlePageRouting(null, callback);
        });
    },
    handlePageRouting: function(reason, callback) {
        var metaData = DataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData();
        var dbDataApis = $S.findParam([currentAppData, metaData], "dbDataApis", []);
        DataHandlerV2.handlePageLoad(dbDataApis, function() {
            $S.callMethod(callback);
        });
    },
    loadAppControlData: function(callback) {
        DataHandler.setData("appControlDataLoadStatus", "in_progress");
        var appControlApi = Config.getApiUrl("appControlData", null, true);
        AppHandler.loadAppControlData(appControlApi, Config.baseApi, Config.appControlDataPath, Config.validAppControl, function(appControlData, metaData) {
            DataHandler.setData("appControlData", appControlData);
            DataHandler.setData("appControlMetaData", metaData);
            $S.log("appControlData load complete");
            DataHandler.setData("appControlDataLoadStatus", "completed");
            DataHandler.setCurrentAppId();
            // DataHandler.generateDateParameter();
            DataHandler.loadDataByAppId(function() {
                $S.callMethod(callback);
            });
        });
    }
});
DataHandler.extend({
    AppDidMount: function(appStateCallback, appDataCallback) {
        var pageName;
        DataHandler.loadUserRelatedData(function() {
            DataHandler.loadAppControlData(function() {
                pageName = DataHandler.getData("pageName", "");
                AppHandler.TrackPageView(pageName);
                TemplateHandler.handlePageNameChange(pageName, "");
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        });
    },
    OnReloadClick: function(appStateCallback, appDataCallback) {
        AppHandler.TrackEvent("reloadClick");
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
    OnList2Change: function(appStateCallback, appDataCallback, list2Id) {
        // var pages = Config.pages;
        // if (!$S.isString(pages[list2Id])) {
        //     var currentList2Data = DataHandlerV2.getList2DataByName(list2Id);
        //     if ($S.isObject(currentList2Data) && $S.isStringV2(currentList2Data.toUrl)) {
        //         AppHandler.TrackPageView(list2Id);
        //         AppHandler.LazyRedirect(currentList2Data.toUrl, 250);
        //     }
        //     return;
        // }
        // DataHandler.setData("currentList2Id", list2Id);
        // if ([Config.custom_dbview].indexOf(list2Id) >= 0) {
        //     DataHandler.applyResetFilter();
        // }
        // AppHandler.TrackPageView(list2Id);
        // DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnList3Change: function(appStateCallback, appDataCallback, list3Id) {
        AppHandler.TrackDropdownChange("list3", list3Id);
        DataHandler.setData("currentList3Id", list3Id);
        // DataHandler.generateDateParameter();
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    PageComponentDidMount: function(appStateCallback, appDataCallback, pageName) {
        var oldPageName = DataHandler.getData("pageName", "");
        if (oldPageName !== pageName) {
            AppHandler.TrackPageView(pageName);
            DataHandler.setData("pageName", pageName);
            DataHandlerV2.findCurrentList3Id();
            this.handlePageRouting("pageComponentDidMount", function() {
                TemplateHandler.handlePageNameChange(pageName, oldPageName);
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        }
    },
    OnDateSelectClick: function(appStateCallback, appDataCallback, value) {
        AppHandler.TrackEvent("dateSelect:" + value);
        DataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        var pageName = DataHandler.getData("pageName", "");
        if (name === "new-work-status") {
            FormHandler.submitNewWorkStatus(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "new-project") {
            FormHandler.submitNewProject(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "add-supply-status") {
            FormHandler.submitAddSupplyStatus(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "add-supply-item") {
            FormHandler.submitNewSupplyItem(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "upload_file_form") {
            FormHandler.submitUploadFile(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "delete_file.form") {
            FormHandler.submitDeleteFile(pageName, value, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (name === "add-project-comment-form") {
            FormHandler.submitAddProjectComment(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
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
    }
});
DataHandler.extend({
    getRenderData: function() {
        var renderData;
        var currentAppData = this.getCurrentAppData();
        var currentList3Data = this.getCurrentList3Data();
        var pageName = this.getData("pageName", "");
        var pageId = this.getPathParamsData("pageId", "");
        var sortingFields = this.getData("sortingFields", []);
        var dateSelect = this.getData("date-select", "");
        var metaData = this.getData("metaData");
        var filterOptions = this.getData("filterOptions");
        var dateParameterField = this.getAppData("pageId:" + pageId + ".dateParameterField", {});
        if (DataHandlerV2.isDisabled("pageName", pageName)) {
            return {"status": "FAILURE", "reason": "Requested page disabled"};
        }
        switch(pageName) {
            case "home":
                renderData = DataHandlerV2.getTableData(this.getTableName("projectTable"));
            break;
            case "projectId":
                renderData = DataHandlerV2.getProjectDataV2(pageName);
            break;
            case "projectStatusSupply":
            case "projectStatusWork":
            case "projectContingency":
                renderData = DataHandlerV2.getAddItemPageData(pageName, sortingFields);
            break;
            case "updateSupplyStatus":
            case "updateContingencyStatus":
            case "updateWorkStatus":
                renderData = DataHandlerV2.getItemUpdatePageData(pageName, sortingFields);
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
            footerData = AppHandler.GetFooterData(this.getData("metaData", {}));
            appHeading = TemplateHandler.GetHeadingField(this.getHeadingText());
        }
        if (dataLoadStatus && !DataHandlerV2.isDisabled("pageId", pageId)) {
            list3Data = DataHandlerV2.getList3Data();
            filterOptions = DataHandler.getData("filterOptions");
            dateSelectionRequiredPages.push(pageName);
        }
        var renderFieldRow = TemplateHandler.GetPageRenderField(dataLoadStatus, renderData, footerData, pageName);

        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", DataHandler.getData("currentList3Id", ""));

        appDataCallback("appHeading", appHeading);
        appDataCallback("renderFieldRow", renderFieldRow);

        appDataCallback("dateSelectionRequiredPages", dateSelectionRequiredPages);
        appDataCallback("dateSelection", Config.dateSelection);
        appDataCallback("selectedDateType", DataHandler.getData("date-select", ""));
        appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
        appStateCallback();
    }
});

})($S);

export default DataHandler;
