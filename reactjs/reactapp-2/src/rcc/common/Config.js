import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

// import Template from "./Template";

var Config = {requestId: $S.getRequestId()};

Config.navigator = $$$.navigator;
var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var loginUserDetailsApi = $$$.loginUserDetailsApi;
Config.baseApi = baseApi;
Config.basepathname = basepathname;
Config.loginUserDetailsApi = loginUserDetailsApi;

Config.appControlDataPath = $$$.appControlDataPath;
var appControlDataApi = $$$.appControlApi;
Config.projectHeading = $$$.projectHeading;
Config.forceLogin = $$$.forceLogin;
var appVersion = $$$.appVersion;
Config.appVersion = appVersion;
Config.JQ = $$$.JQ;
Config.gtag = $$$.gtag;
Config.validAppControl = $$$.validAppControl;

Config.tempConfig = {};

var tcpServicePostApi = "";
var customPageData = $$$.customPageData;
if ($S.isObject(customPageData) && $S.isStringV2(customPageData["tcpServicePostApi"])) {
    tcpServicePostApi = customPageData["tcpServicePostApi"];
}

var pageUrl = {
    "projectHome": basepathname+"/",
    "home": basepathname+"/:pid",
    "otherPages": basepathname+"/:pid/:pageName"
};

var pages = {
    "projectHome": pageUrl["projectHome"],
    "home": pageUrl["home"],
    "dbview": pageUrl["otherPages"],
    "dbview_rcc": pageUrl["otherPages"],
    "rcc_view": pageUrl["otherPages"],
    "rcc_summary": pageUrl["otherPages"]
};

Config.pages = pages;
Config.pageUrl = pageUrl;

Config.projectHome = "projectHome";
Config.home = "home";
Config.otherPages = "otherPages";
Config.dbview = "dbview";
Config.dbview_rcc = "dbview_rcc";
Config.rcc_view = "rcc_view";
Config.rcc_summary = "rcc_summary";
Config.noMatch = "noMatch";

Config.validPages = [Config.dbview, Config.dbview_rcc, Config.rcc_view, Config.rcc_summary];

Config.dateSelectionRequired = [];

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";

var apiMapping = {};
apiMapping["tcpServicePostApi"] = tcpServicePostApi;
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
