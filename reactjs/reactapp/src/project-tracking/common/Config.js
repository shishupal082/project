import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";
import CommonConfig from "../../common/app/common/CommonConfig";

var Config = {};

var basepathname = CommonConfig.basepathname;

Config.uploadFileInstruction = $$$.uploadFileInstruction;

Config.tempConfig = {};

Config.headingJson = [];
Config.afterLoginLinkJson = [];
Config.footerLinkJsonAfterLogin = [];

var pages = {
    "home": basepathname+"/",
    "projectId": basepathname+"/pid/:pid",
    "id1Page": basepathname+"/pid/:pid/id1/:id1",
    // "projectStatusWork": basepathname+"/pid/:pid/work",
    // "updateWorkStatus": basepathname+"/pid/:pid/sid/:sid/work",
    // "projectStatusSupply": basepathname+"/pid/:pid/supply",
    // "updateSupplyStatus": basepathname+"/pid/:pid/sid/:sid/supply",
    // "projectContingency": basepathname+"/pid/:pid/contingency",
    // "updateContingencyStatus": basepathname+"/pid/:pid/sid/:sid/contingency",
    "displayPage": basepathname+"/display/:pageId",
    "viewPage": basepathname+"/view/:viewPageName"
};

Config.pages = pages;

Config.home = "home";
Config.noMatch = "noMatch";
Config.projectId = "projectId";
Config.id1Page = "id1Page";
Config.displayPage = "displayPage";
Config.viewPage = "viewPage";

// Config.projectStatusWork = "projectStatusWork";
// Config.updateWorkStatus = "updateWorkStatus";

// Config.projectStatusSupply = "projectStatusSupply";
// Config.updateSupplyStatus = "updateSupplyStatus";
// Config.projectContingency = "projectContingency";
// Config.updateContingencyStatus = "updateContingencyStatus";


Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";
Config.dateSelectionRequiredPages = [];

Config.fieldsKey = {
    "Value": "common-value",
    "DateKey": "date-entry-key",
    "RemarksKey": "remark-entry-key",
    "DistanceKey": "new-work-status.distance",
    "SectionKey": "new-work-status.section",
    "supplyDiscription": "supplyDiscription",
    "NewSupplyItemName": "add-supply-item.name",
    "NewSupplyItemDetails": "add-supply-item.details",
    "UploadFile": "upload_file.file",
    "AddProjectComment": "add-project-comment-form.comment",
    "ProjectFileKey": "add-project-files-form.project",
    "AddLinkText": "upload_file_link.subject",
    "AddLinkUrl": "upload_file_link.heading"
};

var messageMapping = {
    "form.generic_form0.entry.project-name": "Project name required.",
    "form.generic_form0.entry.form_type": "Form type required."
};
var defaultMetaData = {
    "home.formName": "form.generic_form0",
    "form.generic_form0.validationData": {
        "form.generic_form0.entry.project-name": {
            "type": "string",
            "isRequired": true
        },
        "form.generic_form0.entry.form_type": {
            "type": "string",
            "isRequired": true
        }
    },
    "form.generic_form0.requiredKeys": ["form.generic_form0.entry.form_type", "form.generic_form0.entry.project-name"]
};

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
