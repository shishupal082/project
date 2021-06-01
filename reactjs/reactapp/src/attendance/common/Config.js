import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

import Template from "./Template";

var Config = {requestId: $S.getRequestId()};

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
Config.enabledPages = $$$.enabledPages;


var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUsersDataApi = $$$.relatedUsersDataApi;
var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlApi;


try {
    headingJson = JSON.parse(headingJson);
    Template["heading"][1].text = headingJson;
} catch(e) {}


var pages = {
    "home": basepathname+"/",
    "entry": basepathname+"/entry",
    "update": basepathname+"/update",
    "summary": basepathname+"/summary",
    "ta": basepathname+"/ta",
    "dbview": basepathname+"/dbview",
    "dbview_summary": basepathname+"/dbview_summary"
};

Config.pages = pages;

Config.home = "home";
Config.entry = "entry";
Config.update = "update";
Config.summary = "summary";
Config.ta = "ta";
Config.dbview = "dbview";
Config.dbview_summary = "dbview_summary";
Config.noMatch = "noMatch";

Config.dateSelectionRequired = ["entry", "summary", "dbview", "dbview_summary"];

Config.defaultPageFields = [];

for(var key in pages) {
    if (key !== "home") {
        Config.defaultPageFields.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
    }
}

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
apiMapping["dataPathApi"] = "/api/get_files_info_by_filename_pattern?";
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
