import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";
import CommonConfig from "../../common/app/common/CommonConfig";

var Config = {};

var basepathname = CommonConfig.basepathname;

Config.uploadFileInstruction = $$$.uploadFileInstruction;

Config.tempConfig = {
    "afterLoginLinkJson": [
        {
            "tag": "span",
            "text": [
                {"tag":"span","text":"Login as: "},
                {"tag":"span.b","name":"pageHeading.username","text":""}
            ]
        },
        {
            "tag": "span",
            "text": [
                {"tag":"span", "text":" |  "},
                {"tag":"span", "text":{"tag":"a","name":"pageHeading.logoutLink","href":"/logout","text":"Logout"}}
            ]
        }
    ]
};
var tempConfigGlobalKey = [];
for (var i=0; i<tempConfigGlobalKey.length; i++) {
    if ($S.isStringV2($$$[tempConfigGlobalKey[i]])) {
        Config.tempConfig[tempConfigGlobalKey[i]] = $$$[tempConfigGlobalKey[i]];
    }
}

Config.headingJson = [
    {
        "tag": "div.center.h1",
        "name": "heading-text",
        "text": ""
    }
];
Config.afterLoginLinkJson = [];
Config.footerLinkJsonAfterLogin = [];

var pages = {
    "origin": basepathname+"/",
    "home": basepathname+"/:index",
    "projectPage": basepathname+"/:index/:pageName"
};

Config.pages = pages;

Config.origin = "origin";
Config.home = "home";
Config.noMatch = "noMatch";
Config.projectPage = "projectPage";
Config.track_plan = "track-plan";
Config.edit_image = "edit-image";
Config.edit_text = "edit-text";
Config.validPages = [Config.track_plan, Config.edit_image, Config.edit_text];

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";
Config.dateSelectionRequiredPages = [];

Config.getConfigData = function(key, defaultValue) {
    switch(key) {
        default:
            return defaultValue;
    }
};

export default Config;
