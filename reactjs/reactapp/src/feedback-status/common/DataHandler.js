import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandlerV2 from "./DataHandlerV2";
import FormHandler from "../forms/FormHandler";
import TemplateHandler from "./TemplateHandler";
import ApiHandler from "../api/ApiHandler";

// import Api from "../../common/Api";
// import TemplateHelper from "../../common/TemplateHelper";
import AppHandler from "../../common/app/common/AppHandler";
import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
import CommonDataHandler from "../../common/app/common/CommonDataHandler";
import CommonConfig from "../../common/app/common/CommonConfig";
// import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";
import HomePage from "../pages/HomePage";
import PidPage from "../pages/PidPage";
import Id1Page from "../pages/Id1Page";
import Id2Page from "../pages/Id2Page";
import ViewPage from "../pages/ViewPage";
import DisplayPage from "../pages/DisplayPage";

var DataHandler;

(function($S){
// var DT = $S.getDT();

var keys = [];

keys.push("renderData");
keys.push("renderFieldRow");

keys.push("pageName");
keys.push("componentChangeType");



keys.push("currentList1Id");
keys.push("currentList3Id");

keys.push("filterValues");
keys.push("filterOptions");


keys.push("userData");
keys.push("filteredUserData");
keys.push("attendanceData");
keys.push("latestAttendanceData");

keys.push("appRelatedDataLoadStatus");
keys.push("dbViewDataLoadStatus");
keys.push("filesInfoLoadStatus");

keys.push("sortingFields");
keys.push("dbViewData");
keys.push("filesInfoData");

keys.push("dateParameters");


keys.push("addentry.submitStatus");

CommonDataHandler.addAdditionalDataKeys(keys);
CommonDataHandler.setData("dbViewDataLoadStatus", "not-started");


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
        return CommonDataHandler.setData(key, value, isDirect);
    },
    getData: function(key, defaultValue, isDirect) {
        return CommonDataHandler.getData(key, defaultValue, isDirect);
    },
    getLink: function(pid, sid, page) {
        var link = CommonConfig.basepathname + "/pid/" + pid + "/sid/" + sid + "/" + page;
        return link;
    },
    getLinkV2: function(sid) {
        var pid = CommonDataHandler.getPathParamsData("pid");
        var pageName = this.getData("pageName", "");
        var linkRef = DataHandlerV2.getLinkRef(pageName);
        return this.getLink(pid, sid, linkRef);
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
        dataLoadStatusKey.push("dbViewDataLoadStatus");
        if(CommonDataHandler.getDataLoadStatusByKey(dataLoadStatusKey) !== "completed") {
            return false;
        }
        CommonDataHandler.setData("firstTimeDataLoadStatus", "completed");
        return true;
    },
    getTableName: function(key) {
        var currentAppId = this.getData("currentList1Id", "");
        var tableName = CommonDataHandler.getAppData(currentAppId, "tableName", {});
        if ($S.isObject(tableName) && $S.isStringV2(tableName[key])) {
            return tableName[key];
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
    getCurrentAppData: function() {
        var currentAppId = this.getData("currentList1Id", "");
        return CommonDataHandler.getAppDataById(currentAppId, {});
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
    checkForRedirect: function(callback) {
        var isLogin = AppHandler.GetUserData("login", false);
        if ($S.isBooleanTrue(CommonConfig.forceLogin) && isLogin === false) {
            AppHandler.LazyRedirect(CommonConfig.getApiUrl("loginRedirectUrl", "", true), 250);
            return;
        }
        $S.callMethod(callback);
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
    loadDataByPage: function(callback) {
        DataHandler.loadDbTableData(callback);
        // ApiHandler.loadDataByParams(callback);
    },

    loadDataByAppId: function(callback) {
        var currentList1Id = DataHandler.getData("currentList1Id", "");
        CommonDataHandler.loadMetaDataByAppId(currentList1Id, function() {
            DataHandler.loadDataByPage(callback);
        });
    },
    loadDbTableData: function(callback) {
        var metaData = CommonDataHandler.getData("metaData", {});
        var currentAppData = DataHandler.getCurrentAppData(DataHandler.getData("currentList1Id", ""));
        var dbDataApis = $S.findParam([currentAppData, metaData], "dbDataApis", []);
        ApiHandler.handlePageLoad(dbDataApis, function() {
            $S.callMethod(callback);
        });
        $S.callMethod(callback);
    },
    handleStaticDataLoad: function() {
        var headingJson = AppHandler.GetStaticData("headingJson", [], "json");
        Config.headingJson = headingJson;
        TemplateHandler.SetUserRealtedData();
        this.setCurrentAppId();
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
                        DataHandler.handleStaticDataLoad();
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
        DataHandler.setData("date-select", value);
        DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
    },
    OnFormSubmit: function(appStateCallback, appDataCallback, name, value) {
        var pageName = DataHandler.getData("pageName", "");
        if (pageName === Config.home) {
            FormHandler.submitNewProject(pageName, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (pageName === Config.pidPage) {
            FormHandler.submitFeedbackStatus(pageName, name, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        } else if (pageName === Config.id1Page) {
            FormHandler.submitFeedbackStatus(pageName, name, function() {
                DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
            });
        // } else if (name === "upload_file_form") {
        //     FormHandler.submitUploadFile(pageName, function() {
        //         DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        //     });
        // } else if (name === "upload_file_form_link") {
        //     FormHandler.submitAddLink(pageName, function() {
        //         DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        //     });
        // } else if (name === "delete_file.form") {
        //     FormHandler.submitDeleteFile(pageName, value, function() {
        //         DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        //     });
        // } else if (name === "add-project-comment-form") {
        //     FormHandler.submitAddProjectComment(pageName, function() {
        //         DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        //     });
        // } else if (name === "add-project-files-form") {
        //     FormHandler.submitAddProjectFiles(pageName, function() {
        //         DataHandler.handleDataLoadComplete(appStateCallback, appDataCallback);
        //     });
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
        CommonDataHandler.setFieldsData(name, value);
    }
});
DataHandler.extend({
    getRenderField: function(pageName, dataLoadStatus) {
        var renderData;
        if (!dataLoadStatus) {
            return null;
        }
        var isPageEnabled = DataHandlerV2.isEnabled("pageName", pageName);
        if (!isPageEnabled) {
            renderData = {"status": "FAILURE", "reason": "Requested page disabled"};
            return TemplateHandler.getInvalidField(renderData);
        }
        var isValidPid = true;
        if ([Config.pidPage, Config.id1Page].indexOf(pageName) >= 0) {
            isValidPid = DataHandlerV2.isValidPid();
        }
        if (!isValidPid) {
            renderData = {"status": "FAILURE", "reason": "Invalid path parameter"};
            return TemplateHandler.getInvalidField(renderData);
        }
        switch(pageName) {
            case "home":
                renderData = HomePage.getRenderField(pageName);
            break;
            case "pidPage":
                renderData = PidPage.getRenderField(pageName);
            break;
            case "id1Page":
                renderData = Id1Page.getRenderField(pageName);
            break;
            case "id2Page":
                renderData = Id2Page.getRenderField(pageName);
            break;
            case "displayPage":
                renderData = DisplayPage.getRenderField(pageName);
            break;
            case "viewPage":
                renderData = ViewPage.getRenderField(pageName);
            break;
            case "noMatch":
            default:
                renderData = TemplateHandler.getTemplate("noMatch");
            break;
        }
        return renderData;
    },
    handleDataLoadComplete: function(appStateCallback, appDataCallback) {
        var dataLoadStatus = this.isDataLoadComplete();
        var appHeading = null;
        var list2Data = null;
        var list3Data = null;
        var filterOptions = null;
        var dateSelectionRequiredPages = [];
        var pageName= DataHandler.getData("pageName", "");
        var pageId = CommonDataHandler.getPathParamsData("pageId", "");
        if (dataLoadStatus) {
            // footerData = AppHandler.GetFooterData(this.getData("metaData", {}));
            appHeading = TemplateHandler.GetHeadingField();
            list2Data = DataHandlerV2.getList2Data(pageName);
            appDataCallback("appHeading", appHeading);
        }
        if (dataLoadStatus && DataHandlerV2.isEnabled("pageId", pageId)) {
            list3Data = DataHandlerV2.getList3Data();
            filterOptions = DataHandler.getData("filterOptions");
            dateSelectionRequiredPages.push(pageName);
        }
        var renderFieldRow = this.getRenderField(pageName, dataLoadStatus);

        appDataCallback("list2Data", list2Data);
        appDataCallback("currentList2Id", CommonDataHandler.getPathParamsData("sid", ""));

        appDataCallback("list3Data", list3Data);
        appDataCallback("currentList3Id", DataHandler.getData("currentList3Id", ""));

        appDataCallback("renderFieldRow", renderFieldRow);

        appDataCallback("dateSelectionRequiredPages", dateSelectionRequiredPages);
        appDataCallback("dateSelection", CommonConfig.dateSelection);
        appDataCallback("selectedDateType", DataHandler.getData("date-select", ""));
        appDataCallback("filterOptions", AppHandler.getFilterData(filterOptions));
        appStateCallback();
    }
});

})($S);

export default DataHandler;
