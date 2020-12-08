import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {};

var basepathname = $$$.basepathname;


Config.baseapi = $$$.baseapi;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.forceLogin = $$$.forceLogin;

var appControlApi = $$$.appControlApi;

if (!$S.isArray(appControlApi)) {
    appControlApi = [];
}
Config.appControlApi = appControlApi.map(function(el, i, arr) {
    return Config.baseapi + el + "?v="+ Config.appVersion;
});

var appControlDataPath = $$$.appControlDataPath;
Config.updateAppControlApi = function(username) {
    if ($S.isString(appControlDataPath) && appControlDataPath.length > 0) {
        if ($S.isString(username) && username.length > 0) {
            Config.appControlApi = [Config.baseapi + appControlDataPath + username + ".json?v="+ Config.appVersion];
        }
    }
};

var pages = {
    "home": basepathname+"/",
    "entry": basepathname+"/entry",
    "entrybydate": basepathname+"/entrybydate",
    "entrybytype": basepathname+"/entrybytype",
    "entrybystation": basepathname+"/entrybystation",
    "entrybydevice": basepathname+"/entrybydevice",
    "summary": basepathname+"/summary",
    "entrybydatefilter": basepathname+"/entrybydatefilter"
};

Config.pages = pages;


Config.home = "home";
Config.entry = "entry";
Config.entrybydate = "entrybydate";
Config.entrybytype = "entrybytype";
Config.entrybystation = "entrybystation";
Config.entrybydevice = "entrybydevice";
Config.summary = "summary";
Config.entrybydatefilter = "entrybydatefilter";
Config.noMatch = "noMatch";


Config.dateSelectionRequired = ["entrybydate", "entrybytype", "entrybystation", "entrybydevice", "summary", "entrybydatefilter"];

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

Config.goBackLinkData = [
    {
        "tag": "div",
        "className": "position-absolute",
        "text": {
            "tag": "link",
            "url": pages.home,
            "text": {
                "tag": "h6",
                "text": "Go Back"
            }
        }
    }
];

Config.goBackLinkData = [];


var apiMapping = {};
apiMapping["getLoginUserDetails"] = "/api/get_login_user_details";
apiMapping["getFilesInfo"] = "/api/get_files_info";
apiMapping["loginRedirectUrl"] = "/login";
Config.getApiUrl = function(key, defaultValue) {
    if ($S.isString(apiMapping[key])) {
        return Config.baseapi + apiMapping[key];
    }
    return defaultValue;
};

Config.createCsvApi = function(filepath, username, requestId) {
    var selector = "container=api&v=" + requestId;
    if ($S.isString(username) && username.length > 0) {
        selector += "&u=" + username;
    }
    return Config.baseapi + "/view/file/" + filepath + "?" + selector;
};


export default Config;
