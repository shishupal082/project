import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";
import Template from "./Template";

var requestId = $S.getRequestId();

var Config = {};

var basepathname = $$$.basepathname;
var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUserDetailsApi = $$$.usernamesApi;


Config.baseApi = $$$.baseApi;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.forceLogin = $$$.forceLogin;

Config.addTextFilenamePattern = $$$.addTextFilenamePattern;

if (!$S.isString(Config.addTextFilenamePattern)) {
    Config.addTextFilenamePattern = "YYYY/-/MM/-/DD/-/hh/-/mm/-report.csv";
}

var headingJson = $$$.headingJson;
try {
    headingJson = JSON.parse(headingJson);
    Template["pageHeading"][1].text = headingJson;
} catch(e) {}

Config.headingPattern = $$$.headingPattern;

if (!$S.isString(Config.headingPattern)) {
    Config.headingPattern = "device";
}

var pageData = {};
pageData["uploadFileInstruction"] = $$$.uploadFileInstruction;
pageData["uploadTextInstruction"] = $$$.uploadTextInstruction;

var appControlApi = $$$.appControlApi;

if ($S.isString(appControlApi)) {
    appControlApi = Config.baseApi + appControlApi + "?v="+ requestId;;
} else {
    appControlApi = null;
}
Config.appControlApi = appControlApi;
Config.appControlDataPath = $$$.appControlDataPath;
Config.validAppControl = $$$.validAppControl;

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
            "href": pages.home,
            "text": {
                "tag": "h6",
                "text": "Go Back"
            }
        }
    }
];

Config.goBackLinkData = [];


var apiMapping = {};
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["getRelatedUserDetails"] = relatedUserDetailsApi;
apiMapping["getFilesInfo"] = "/api/get_files_info";
apiMapping["addTextApi"] = "/api/add_text";
apiMapping["uploadfileApi"] = "/api/upload_file";
apiMapping["loginRedirectUrl"] = "/login";
apiMapping["entryByDateUrl"] = pages.entrybydate;
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return Config.baseApi + apiMapping[key];
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
    return Config.baseApi + "/view/file/" + filepath + "?" + selector;
};

Config.getPageData = function(key, defaultValue) {
    if ($S.isString(pageData[key])) {
        return pageData[key];
    }
    return defaultValue;
};

export default Config;
