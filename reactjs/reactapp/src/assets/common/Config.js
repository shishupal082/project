import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

// var requestId = $S.getRequestId();

var Config = {};

var basepathname = $$$.basepathname;


Config.baseapi = $$$.baseapi;
Config.basepathname = basepathname;
Config.appVersion = $$$.appVersion;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.queryParamName = $$$.queryParamName;
Config.queryParamMapping = $$$.queryParamMapping;

var staticDataApi = $$$.staticDataApi;
if (!$S.isString(staticDataApi)) {
    staticDataApi = "/files/v1/get/view/filedata?name=static-data.json";
}

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
apiMapping["static-data"] = staticDataApi;
apiMapping["task-data"] = "/task/api/v2/tasks";
apiMapping["component-data"] = "/task/api/v1/component/all";
apiMapping["app-data"] = "/task/api/v2/app/all";
Config.getApiUrl = function(key, defaultValue, addBaseUrl) {
    if ($S.isString(apiMapping[key])) {
        if ($S.isBooleanTrue(addBaseUrl)) {
            return Config.baseapi + apiMapping[key];
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

Config.footerData = [
    {
        "entry": [["1","2","3"],["4","5","6"]]
    },
    {
        "type": "table-cols",
        "entry": [["1,1", "2,1"], ["1,2", "2,2"], ["1,3"], ["1,4", "2,4", "3,4", "4,4"]]
    },
    {
        "type": "table-rows",
        "entry": [["1,1","1,2"], ["2,1"]]
    }
];

export default Config;
