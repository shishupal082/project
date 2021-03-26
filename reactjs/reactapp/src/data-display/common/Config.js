import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

import Template from "./Template";
// var requestId = $S.getRequestId();

var Config = {};

var basepathname = $$$.basepathname;
var dataLoadBaseapi = $$$.dataLoadBaseapi;

Config.basepathname = basepathname;
Config.dataLoadBaseapi = dataLoadBaseapi;
Config.appVersion = $$$.appVersion;
Config.forceLogin = $$$.forceLogin;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;

var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlDataApi;


try {
    headingJson = JSON.parse(headingJson);
    Template["heading"][1].text = headingJson;
} catch(e) {}

var pageData = {};

var pages = {
    "home": basepathname+"/",
    "entry": basepathname+"/entry",
    "entrybydate": basepathname+"/entrybydate",
    "entrybytype": basepathname+"/entrybytype",
    "entrybystation": basepathname+"/entrybystation",
    "entrybydevice": basepathname+"/entrybydevice",
    "summary": basepathname+"/summary",
    "entrybydatefilter": basepathname+"/entrybydatefilter",
    "addentry": basepathname+"/addentry",
    "uploadfile": basepathname+"/uploadfile"
};

Config.pages = pages;
Template["heading"][1].text = headingJson;

Config.home = "home";
Config.entry = "entry";
Config.entrybydate = "entrybydate";
Config.entrybytype = "entrybytype";
Config.entrybystation = "entrybystation";
Config.entrybydevice = "entrybydevice";
Config.summary = "summary";
Config.entrybydatefilter = "entrybydatefilter";
Config.addentry = "addentry";
Config.uploadfile = "uploadfile";
Config.noMatch = "noMatch";


Config.dateSelectionRequired = ["entrybydate", "entrybytype", "entrybystation", "entrybydevice", "summary", "entrybydatefilter"];

Config.defaultPageFields = [];

for(var key in pages) {
    if (key !== "home") {
        Config.defaultPageFields.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
    }
}

Config.dateSelection = [
    {"name": "Single file", "value": "single-file"},
    {"name": "All file", "value": "all-file"}
];

Config.goBackLinkData = [];


var apiMapping = {};
apiMapping["app-control-data"] = appControlDataApi;
apiMapping["addTextApi"] = "/api/add_text";
apiMapping["dataPathApi"] = "/api/get_files_info_by_filename_pattern?";
apiMapping["getLoginUserDetails"] = "/api/get_login_user_details";;
apiMapping["loginRedirectUrl"] = "/login";
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return dataLoadBaseapi + apiMapping[key];
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
