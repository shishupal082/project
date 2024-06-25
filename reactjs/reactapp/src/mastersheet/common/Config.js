import $S from "../../interface/stack.js";
import CommonConfig from "../../common/app/common/CommonConfig";

var Config = {};

var basepathname = CommonConfig.basepathname;

Config.tempConfig = {};
Config.headingJson = [];
Config.afterLoginLinkJson = [];
Config.footerLinkJsonAfterLogin = [];

var pages = {
    "origin": basepathname+"/",
    "home": basepathname+"/:index"
};

Config.pages = pages;

Config.origin = "origin";
Config.home = "home";
Config.noMatch = "noMatch";


Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";
Config.dateSelectionRequiredPages = [];
var messageMapping = {};
var defaultMetaData = {};

Config.getConfigData = function(key, defaultValue) {
    switch(key) {
        case "messageMapping":
            return $S.clone(messageMapping);
        case "defaultMetaData":
            return $S.clone(defaultMetaData);
        default:
            return defaultValue;
    }
};

export default Config;
