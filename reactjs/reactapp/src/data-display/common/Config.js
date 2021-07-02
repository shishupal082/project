import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

import Template from "./Template";
// var requestId = $S.getRequestId();

var Config = {};

var basepathname = $$$.basepathname;
var baseApi = $$$.baseApi;
var loginUserDetailsApi = $$$.loginUserDetailsApi;

Config.basepathname = basepathname;
Config.baseApi = baseApi;
Config.appVersion = $$$.appVersion;
Config.forceLogin = $$$.forceLogin;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.appControlDataPath = $$$.appControlDataPath;
Config.validAppControl = $$$.validAppControl;

var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlDataApi;


try {
    headingJson = JSON.parse(headingJson);
    Template["heading"][1].text = headingJson;
} catch(e) {}

var pageData = {};

var pages = {
    "dataDisplay": basepathname+"/"
};

Config.pages = pages;
Config.dataDisplay = "dataDisplay";


Template["heading"][1].text = headingJson;

Config.dateSelectionRequired = ["dataDisplay"];

Config.defaultPageFields = [];

Config.dateSelection = [
    {"name": "Single file", "value": "single-file"},
    {"name": "All file", "value": "all-file"}
];

Config.goBackLinkData = [];


var apiMapping = {};
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["appControlData"] = appControlDataApi;
apiMapping["dataPathApi"] = "/api/get_files_info_by_filename_pattern?";
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


Config.getPageData = function(key, defaultValue) {
    if ($S.isString(pageData[key])) {
        return pageData[key];
    }
    return defaultValue;
};

export default Config;
