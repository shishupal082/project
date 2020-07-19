import React from 'react';
import $S from "../interface/stack.js";
// import Api from "../common/Api";

import Template from "./common/Template";
import Config from "./common/Config";
import FTPHelper from "./common/FTPHelper";
import PageData from "./common/PageData";

import RenderComponent from "./component/RenderComponent";


// var RequestId = $S.getRequestId();
// var DT = $S.getDT();
// var baseapi = Config.baseapi;
var Data = $S.getDataObj();

var keys = ["FTPTemplate", "userData", "linkTemplate", "uploadFileTemplate"];

Data.getTemplate = function(key, defaultTemplate) {
    var allTemplate = Data.getData("FTPTemplate", {});
    if ($S.isObject(allTemplate)) {
        if ($S.isDefined(allTemplate[key])) {
            return allTemplate[key];
        }
    }
    return defaultTemplate;
};
Data.initData = function() {
    // var defaultData;
    // var allData = Data.getAllData();
    for (var i = 0; i < keys.length; i++) {
        if (["FTPTemplate", "userData"].indexOf(keys[i]) >= 0) {
            continue;
        }
        // defaultData = [];
        // if ($S.isObject(allData[keys[i]])) {
        //     defaultData = {};
        // }
        Data.setData(keys[i], null);
    }
};

Data.getUserData = function(key, defaultValue) {
    var userData = Data.getData("userData", {});
    if ($S.isDefined(userData[key])) {
        return userData[key];
    }
    return defaultValue;
};

Data.setUserData = function(key, value) {
    var userData = Data.getData("userData", {});
    userData[key] = value;
    Data.setData("userData", userData);
};

Data.setKeys(keys);
Data.initData();
Data.setData("FTPTemplate", Template);
var isLogin = Config.getPageData("is_login") === "true" ? true : false;
var userName = Config.getPageData("username", "");
var currentPageName = Config.getPageData("page", "");

Data.setUserData("is_login", isLogin);
Data.setUserData("username", userName);
Data.setUserData("page", currentPageName);
PageData.setData("page", currentPageName);

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            renderField: []
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(e) {
        var self = this;
        e.preventDefault();
        PageData.handleFormSubmit(e, Data, function() {
            self.setRenderField();
        });
        return false;
    }
    onClick(e) {
        //On button click
    }
    onChange(e) {
        // var terget = e.currentTarget;
        PageData.handleInputChange(e);
    }
    setRenderField() {
        var renderField = [];
        renderField.push(Data.getTemplate("heading", {}));
        var isLogin = Data.getUserData("is_login", false);
        if (isLogin) {
            FTPHelper.setLinkTemplate(Data);
            renderField.push(Data.getData("linkTemplate", {}));
            renderField.push(FTPHelper.getFieldTemplateByPageName(Data, currentPageName));
        } else {
            renderField.push(FTPHelper.getFieldTemplateByPageName(Data, currentPageName));
        }
        this.setState({renderField: renderField});
    }
    componentDidMount() {
        var redirectStatus = FTPHelper.checkForRedirect(Data, Config);
        if (redirectStatus) {
            return;
        }
        this.setRenderField();
        // var renderField = [];
        // for(var key in Template) {
        //     renderField.push(Template[key]);
        // }
        // renderField.push(Template.heading);
        // renderField.push(Template.link);
        // renderField.push(Template.login);
        // renderField.push(Template.forgot_password);
        // renderField.push(Template.upload_file);
        // renderField.push(Template.change_password);
        // renderField.push(Template.loading);
        // this.setState({renderField: renderField});
    }
    render() {
        var renderFieldRow = this.state.renderField;
        return(
            <RenderComponent renderFieldRow={renderFieldRow}
                onFormSubmit={this.onFormSubmit}
                onClick={this.onClick}
                onChange={this.onChange}
            />
        );
    }
}

export default App;
