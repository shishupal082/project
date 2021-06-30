import $$$ from '../../interface/global';
import $S from "../../interface/stack.js";

var Config = {requestId: $S.getRequestId()};

Config.navigator = $$$.navigator;
var baseApi = $$$.baseApi;
var basepathname = $$$.basepathname;
var appVersion = $$$.appVersion;

Config.baseApi = baseApi;
Config.basepathname = basepathname;
Config.appVersion = appVersion;
Config.forceLogin = $$$.forceLogin;
Config.gtag = $$$.gtag;
Config.JQ = $$$.JQ;
Config.appControlDataPath = $$$.appControlDataPath;
Config.validAppControl = $$$.validAppControl;
Config.uploadFileInstruction = $$$.uploadFileInstruction;

Config.tempConfig = {};


var loginUserDetailsApi = $$$.loginUserDetailsApi;
var relatedUsersDataApi = $$$.relatedUsersDataApi;
var headingJson = $$$.headingJson;
var appControlDataApi = $$$.appControlApi;


try {
    headingJson = JSON.parse(headingJson);
    Config.headingJson = headingJson;
} catch(e) {}


// Config.defaultPageFields = [];

// for(var key in pages) {
//     if (key !== "home") {
//         Config.defaultPageFields.push({"name": key, "toText": $S.capitalize(key), "toUrl": pages[key]});
//     }
// }


var pages = {
    "home": basepathname+"/",
    "projectId": basepathname+"/pid/:pid",
    "projectStatusWork": basepathname+"/pid/:pid/work",
    "projectStatusSupply": basepathname+"/pid/:pid/supply",
    "updateSupplyStatus": basepathname+"/pid/:pid/sid/:sid/supply",
    "projectContingency": basepathname+"/pid/:pid/contingency",
    "updateContingencyStatus": basepathname+"/pid/:pid/sid/:sid/contingency",
    "displaySupplyStatus": basepathname+"/display_supply_status",
    "displayContingencyStatus": basepathname+"/display_contingency_status",
    "displayUploadedFiles": basepathname+"/display_uploaded_files"
};

Config.pages = pages;

Config.home = "home";
Config.noMatch = "noMatch";
Config.projectId = "projectId";
Config.projectStatusWork = "projectStatusWork";
Config.projectStatusSupply = "projectStatusSupply";
Config.updateSupplyStatus = "updateSupplyStatus";
Config.displaySupplyStatus = "displaySupplyStatus";
Config.displayUploadedFiles = "displayUploadedFiles";


Config.projectContingency = "projectContingency";
Config.updateContingencyStatus = "updateContingencyStatus";
Config.displayContingencyStatus = "displayContingencyStatus";

Config.dateSelection = [
    {"name": "Daily", "value": "daily"},
    {"name": "Monthly", "value": "monthly"},
    {"name": "Yearly", "value": "yearly"},
    {"name": "All", "value": "all"}
];
Config.defaultDateSelect = "monthly";
Config.dateSelectionRequiredPages = [Config.displaySupplyStatus, Config.displayUploadedFiles, Config.displayContingencyStatus];

Config.fieldsKey = {
    "Value": "common-value",
    "DateKey": "date-entry-key",
    "RemarksKey": "remark-entry-key",
    "DistanceKey": "new-work-status.distance",
    "SectionKey": "new-work-status.section",
    "ProjectNameKey": "new-project.name",
    "supplyDiscription": "supplyDiscription",
    "NewSupplyItemName": "add-supply-item.name",
    "NewSupplyItemDetails": "add-supply-item.details",
    "UploadFile": "upload_file.file"
};


var messageMapping = {};
messageMapping["tableName.invalid"] = "Invalid table name";
messageMapping[Config.fieldsKey.Value] = "Value Required";
messageMapping[Config.fieldsKey.DateKey] = "Please enter valid date";
messageMapping[Config.fieldsKey.RemarksKey] = "Remarks Required";

messageMapping[Config.fieldsKey.SectionKey] = "Please select section";
messageMapping[Config.fieldsKey.ProjectNameKey] = "Project Name Required";
messageMapping[Config.fieldsKey.supplyDiscription] = "Select Discription";

messageMapping[Config.fieldsKey.DistanceKey] = "Distance Required";
messageMapping[Config.fieldsKey.DistanceKey + ".invalid"] = "Enter Valid Distance";
messageMapping[Config.fieldsKey.NewSupplyItemName] = "Supply Item Name Required";
messageMapping[Config.fieldsKey.NewSupplyItemDetails] = "Supply Item Details Required";
messageMapping[Config.fieldsKey.UploadFile] = "File Required";
Config.messageMapping = messageMapping;

var apiMapping = {};
apiMapping["getLoginUserDetails"] = loginUserDetailsApi;
apiMapping["getRelatedUsersData"] = relatedUsersDataApi;
apiMapping["appControlData"] = appControlDataApi + "?v=" + appVersion;
apiMapping["addTextApi"] = "/api/add_text_v2";
apiMapping["upload_file"] = "/api/upload_file";
apiMapping["delete_file"] = "/api/delete_file";
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
