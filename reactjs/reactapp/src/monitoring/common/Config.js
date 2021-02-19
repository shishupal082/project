import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var requestId = $S.getRequestId();

var Config = {};

var basepathname = $$$.basepathname;


Config.baseapi = $$$.baseapi;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.forceLogin = $$$.forceLogin;

Config.addTextFilenamePattern = $$$.addTextFilenamePattern;

if (!$S.isString(Config.addTextFilenamePattern)) {
    Config.addTextFilenamePattern = "YYYY/-/MM/-/DD/-/hh/-/mm/-report.csv";
}


Config.headingPattern = $$$.headingPattern;

if (!$S.isString(Config.headingPattern)) {
    Config.headingPattern = "device";
}


var pageData = {};
pageData["uploadFileInstruction"] = $$$.uploadFileInstruction;
pageData["uploadTextInstruction"] = $$$.uploadTextInstruction;

var appControlApi = $$$.appControlApi;

if (!$S.isArray(appControlApi)) {
    appControlApi = [];
}
Config.appControlApi = appControlApi.map(function(el, i, arr) {
    return Config.baseapi + el + "?v="+ requestId;
});

Config.validTeamAppControl = $$$.validTeamAppControl;

var appControlDataPath = $$$.appControlDataPath;
Config.updateAppControlApi = function(teamAppControlData) {
    if ($S.isString(appControlDataPath) && appControlDataPath.length > 0) {
        if ($S.isString(teamAppControlData) && teamAppControlData.length > 0) {
            Config.appControlApi = [Config.baseapi + appControlDataPath + teamAppControlData + ".json?v="+ requestId];
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
    "entrybydatefilter": basepathname+"/entrybydatefilter",
    "addentry": basepathname+"/addentry",
    "uploadfile": basepathname+"/uploadfile"
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
apiMapping["getRelatedUserDetails"] = "/api/get_related_users_data";
apiMapping["getFilesInfo"] = "/api/get_files_info";
apiMapping["addTextApi"] = "/api/add_text";
apiMapping["uploadfileApi"] = "/api/upload_file";
apiMapping["loginRedirectUrl"] = "/login";
apiMapping["entryByDateUrl"] = pages.entrybydate;
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return Config.baseapi + apiMapping[key];
        } else {
            // used for redirect on fileupload or addtext
            return apiMapping[key];
        }
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

Config.getPageData = function(key, defaultValue) {
    if ($S.isString(pageData[key])) {
        return pageData[key];
    }
    return defaultValue;
};

export default Config;
