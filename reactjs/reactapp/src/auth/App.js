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
            "addContainerClass": false,
            "firstTimeDataLoadStatus": "",
            "appHeading": [{"tag": "div", "text": ""}],
            "hidePageTab": true,
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
        this.getTabDisplayText = this.getTabDisplayText.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            onChange: this.onChange,
            dropDownChange: this.dropDownChange,
            onFormSubmit: this.onFormSubmit,
            pageComponentDidMount: this.pageComponentDidMount,
            getTabDisplayText: this.getTabDisplayText,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    gotoPage(pageName) {
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        DataHandler.OnButtonClick(this.appStateCallback, this.appDataCallback, name, value);
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
        DataHandler.OnDropdownChange(this.appStateCallback, this.appDataCallback, name, value);
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
    getTabDisplayText(tabName) {
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pages = Config.pages;
        const login = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.login}/>);
        const login_other_user = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.login_other_user}/>);
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
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.noMatch}/>);

        return (<BrowserRouter>
            <Switch>
                <Route path={pages.login} component={login}/>
                <Route path={pages.login_other_user} component={login_other_user}/>
                <Route path={pages.logout} component={logout}/>
                <Route path={pages.register} component={register}/>
                <Route path={pages.change_password} component={change_password}/>
                <Route path={pages.forgot_password} component={forgot_password}/>
                <Route path={pages.create_password} component={create_password}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

