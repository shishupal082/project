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
    "linkText": $$$.linkText,
    "isSinglePageApp": $$$.isSinglePageApp
};


var loginUserDetailsApi = $$$.loginUserDetailsApi;
var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlApi;
var udpServicePostApi = $$$.udpServicePostApi;


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
    "dbview": pageUrl["otherPages"],
    "rcc_view": pageUrl["otherPages"],
    "rcc_summary": pageUrl["otherPages"]
};

Config.pages = pages;
Config.pageUrl = pageUrl;

Config.projectHome = "projectHome";
Config.home = "home";
Config.otherPages = "otherPages";
Config.dbview = "dbview";
Config.rcc_view = "rcc_view";
Config.rcc_summary = "rcc_summary";
Config.noMatch = "noMatch";

Config.validPages = [Config.dbview, Config.rcc_view, Config.rcc_summary];

Config.dateSelectionRequired = [];

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";

var apiMapping = {};
apiMapping["udpServicePostApi"] = udpServicePostApi;
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
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
