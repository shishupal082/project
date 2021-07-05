import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

import Template from "./Template";

var Config = {requestId: $S.getRequestId()};

Config.navigator = $$$.navigator;
var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var appVersion = $$$.appVersion;

Config.baseApi = baseApi;
Config.basepathname = basepathname;
Config.appVersion = appVersion;
Config.forceLogin = $$$.forceLogin;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.appControlDataPath = $$$.appControlDataPath;
Config.validAppControl = $$$.validAppControl;
Config.projectHeading = $$$.projectHeading;

Config.tempConfig = {
    "enabledPages": $$$.enabledPages,
    "redirectPages": $$$.redirectPages,
    "addFieldReport.addTextFilenamePattern": $$$.addTextFilenamePattern,
    "linkText": $$$.linkText
};


var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUsersDataApi = $$$.relatedUsersDataApi;
var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlApi;


try {
    headingJson = JSON.parse(headingJson);
    Template["heading"][1].text = headingJson;
} catch(e) {}

var pageUrl = {
    "projectHome": basepathname+"/",
    "home": basepathname+"/:pid",
    "otherPages": basepathname+"/:pid/:pageName"
};

var pages = {
    "projectHome": pageUrl["projectHome"],
    "home": pageUrl["home"],
    "entry": pageUrl["otherPages"],
    "update": pageUrl["otherPages"],
    "summary": pageUrl["otherPages"],
    "ta": pageUrl["otherPages"],
    "dbview": pageUrl["otherPages"],
    "dbview_summary": pageUrl["otherPages"],
    "custom_dbview": pageUrl["otherPages"],
    "add_field_report": pageUrl["otherPages"]
};

Config.pages = pages;
Config.pageUrl = pageUrl;

Config.projectHome = "projectHome";
Config.home = "home";
Config.otherPages = "otherPages";
Config.entry = "entry";
Config.update = "update";
Config.summary = "summary";
Config.ta = "ta";
Config.dbview = "dbview";
Config.dbview_summary = "dbview_summary";
Config.custom_dbview = "custom_dbview";
Config.add_field_report = "add_field_report";
Config.noMatch = "noMatch";

Config.validPages = [Config.entry, Config.update, Config.summary, Config.ta, Config.dbview, Config.dbview_summary, Config.custom_dbview, Config.add_field_report];

Config.dateSelectionRequired = [Config.entry, Config.summary, Config.dbview, Config.dbview_summary, Config.custom_dbview];

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";

var apiMapping = {};
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["getRelatedUsersData"] = relatedUsersDataApi;
apiMapping["appControlData"] = appControlDataApi + "?v=" + appVersion;
apiMapping["addTextApi"] = "/api/add_text";
apiMapping["loginRedirectUrl"] = "/login";
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return baseApi + apiMapping[key];
        } else {
            // used for redirect
            return apiMapping[key];
        }
    }
    return defaultValue;
};

export default Config;
