import $$$ from '../../interface/global';
// import $S from "../../interface/stack.js";
import CommonConfig from "../../common/app/common/CommonConfig";

var Config = {};

Config.tempConfig = {};
Config.headingJson = [];
Config.afterLoginLinkJson = $$$.afterLoginLinkJson;
Config.footerLinkJsonAfterLogin = $$$.footerLinkJsonAfterLogin;

var basepathname = CommonConfig.basepathname;

var pages = {
    "home": basepathname+"/",
    "pidPage": basepathname+"/pid/:pid",
    "id1Page": basepathname+"/pid/:pid/id1/:id1",
    "id2Page": basepathname+"/pid/:pid/id1/:id1/id2/:id2",
    "displayPage": basepathname+"/display/:pageId",
    "viewPage": basepathname+"/view/:viewPageName"
};

Config.pages = pages;

Config.home = "home";
Config.pidPage = "pidPage";
Config.id1Page = "id1Page";
Config.id2Page = "id2Page";

Config.displayPage = "displayPage";
Config.viewPage = "viewPage";

Config.noMatch = "noMatch";



// Config.fieldsKey = {
//     "ProjectNameKey": "new-project.name",
//     "Value": "common-value",
//     "DateKey": "date-entry-key",
//     "RemarksKey": "remark-entry-key",
//     "DistanceKey": "new-work-status.distance",
//     "SectionKey": "new-work-status.section",
//     "supplyDiscription": "supplyDiscription",
//     "NewSupplyItemName": "add-supply-item.name",
//     "NewSupplyItemDetails": "add-supply-item.details",
//     "UploadFile": "upload_file.file",
//     "AddProjectComment": "add-project-comment-form.comment",
//     "ProjectFileKey": "add-project-files-form.project",
//     "AddLinkText": "upload_file_link.subject",
//     "AddLinkUrl": "upload_file_link.heading"
// };


// var messageMapping = {};
// messageMapping["tableName.invalid"] = "Invalid table name";
// messageMapping[Config.fieldsKey.Value] = "Value Required";
// messageMapping[Config.fieldsKey.DateKey] = "Please enter valid date";
// messageMapping[Config.fieldsKey.RemarksKey] = "Remarks Required";

// messageMapping[Config.fieldsKey.SectionKey] = "Please select section";
// messageMapping[Config.fieldsKey.ProjectNameKey] = "Project Name Required";
// messageMapping[Config.fieldsKey.supplyDiscription] = "Select Discription";

// messageMapping[Config.fieldsKey.DistanceKey] = "Distance Required";
// messageMapping[Config.fieldsKey.DistanceKey + ".invalid"] = "Enter Valid Distance";
// messageMapping[Config.fieldsKey.NewSupplyItemName] = "Supply Item Name Required";
// messageMapping[Config.fieldsKey.NewSupplyItemDetails] = "Supply Item Details Required";
// messageMapping[Config.fieldsKey.UploadFile] = "File Required";
// messageMapping[Config.fieldsKey.AddProjectComment] = "Comment Required";
// messageMapping[Config.fieldsKey.ProjectFileKey] = "Select Project Name";
// messageMapping[Config.fieldsKey.AddLinkText] = "Link Heading required";
// messageMapping[Config.fieldsKey.AddLinkUrl] = "Link required";
// Config.messageMapping = messageMapping;

export default Config;
