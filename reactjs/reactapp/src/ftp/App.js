import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppComponent from "../common/app/components/AppComponent";
import DataHandler from "./common/DataHandler";
import Config from "./common/Config";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],
            "pageHeading": "",
            "renderFieldRow": [],
            "disableFooter": true
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
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        var appStateCallback = this.appStateCallback;
        var appDataCallback = this.appDataCallback;
        DataHandler.OnButtonClick(appStateCallback, appDataCallback, name, value);
    }
    // for input and textarea
    onChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        var appStateCallback = this.appStateCallback;
        var appDataCallback = this.appDataCallback;
        if (name === "upload_file.file") {
            DataHandler.OnFileUploadChange(appStateCallback, appDataCallback, name, e.currentTarget.files[0]);
        } else {
            DataHandler.OnInputChange(appStateCallback, appDataCallback, name, value);
        }
    }
    // not working ?
    onFormSubmit(e) {
        e.preventDefault();
        DataHandler.OnFormSubmit(this.appStateCallback, this.appDataCallback);
        return false;
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
    getTabDisplayText(tabName) {
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pages = Config.pages;
        const dashboard = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.dashboard}/>);
        const upload_file = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.upload_file}/>);
        const users_control = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.users_control}/>);
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.noMatch}/>);

        return (<BrowserRouter>
            <Switch>
                <Route path={pages.dashboard} component={dashboard}/>
                <Route path={pages.upload_file} component={upload_file}/>
                <Route path={pages.users_control} component={users_control}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

