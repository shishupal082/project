import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";

DataHandler.handlePageLoad();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "list1Data": [],
            "currentList1Id": "",
            "addContainerClass": true,
            "firstTimeDataLoadStatus": "",
            "appHeading": [{"tag": "div", "text": ""}],
            "filterOptions": [],
            "renderFieldRow": []
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.responseGoogleSuccess = this.responseGoogleSuccess.bind(this);
        this.responseGoogleFailure = this.responseGoogleFailure.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            onChange: this.onChange,
            dropDownChange: this.dropDownChange,
            onFormSubmit: this.onFormSubmit,
            pageComponentDidMount: this.pageComponentDidMount,
            registerChildAttribute: this.registerChildAttribute,
            responseGoogleSuccess: this.responseGoogleSuccess,
            responseGoogleFailure: this.responseGoogleFailure
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    responseGoogleSuccess(response) {
        if ($S.isObject(response) && $S.isObject(response.profileObj) && $S.isStringV2(response.tokenId)) {
            var email = response.profileObj.email;
            DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, "social_login_email", email);
            DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, "social_login_token_id", response.tokenId);
            DataHandler.OnFormSubmit(this.appStateCallback, this.appDataCallback, "form_name" ,"social_login_form");
        }
    }
    responseGoogleFailure(response) {}
    gotoPage(pageName) {
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (name === "reset-filter") {
            DataHandler.OnResetClick(this.appStateCallback, this.appDataCallback);
        } else {
            DataHandler.OnButtonClick(this.appStateCallback, this.appDataCallback, name, value);
        }
    }
    // for input and textarea
    onChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, name, value);
    }
    onFormSubmit(e) {
        e.preventDefault();
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        DataHandler.OnFormSubmit(this.appStateCallback, this.appDataCallback, name, value);
    }
    dropDownChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filterNames = [];
        for(var i=0; i<filterOptions.length; i++) {
            if ($S.isString(filterOptions[i].selectName)) {
                filterNames.push(filterOptions[i].selectName);
            }
        }
        if (filterNames.indexOf(name) >= 0) {
            DataHandler.OnFilterChange(this.appStateCallback, this.appDataCallback, name, value);
        } else {
            DataHandler.OnDropdownChange(this.appStateCallback, this.appDataCallback, name, value);
        }
    }
    appStateCallback() {
        $S.log("App:appStateCallback");
        this.setState({isLoaded: true});
    }
    appDataCallback(name, data) {
        $S.updateDataObj(this.appData, name, data, "checkType");
    }
    pageComponentDidMount(pageName) {
        DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback, pageName);
    }
    componentDidMount() {
        $S.log("App:componentDidMount");
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppDidMount(appStateCallback, appDataCallback);
    }
    removeTab(pageName) {
    }
    addTab(pageName) {
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pages = Config.pages;
        const login_other_user = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.login_other_user}/>);
        const users_control = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.users_control}/>);
        const permission_control = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.permission_control}/>);
        const compare_control = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.compare_control}/>);
        const login = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.login}/>);
        const logout = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.logout}/>);
        const register = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.register}/>);
        const change_password = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.change_password}/>);
        const forgot_password = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.forgot_password}/>);
        const create_password = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.create_password}/>);
        const database_files = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.database_files}/>);
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.noMatch}/>);
        return (<BrowserRouter>
            <Switch>
                <Route path={pages.login} component={login}/>
                <Route path={pages.logout} component={logout}/>
                <Route path={pages.register} component={register}/>
                <Route path={pages.change_password} component={change_password}/>
                <Route path={pages.forgot_password} component={forgot_password}/>
                <Route path={pages.create_password} component={create_password}/>
                <Route path={pages.login_other_user} component={login_other_user}/>
                <Route path={pages.users_control} component={users_control}/>
                <Route path={pages.permission_control} component={permission_control}/>
                <Route path={pages.compare_control} component={compare_control}/>
                <Route path={pages.database_files} component={database_files}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

