import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "addContainerClass": true,
            "firstTimeDataLoadStatus": "",

            "list1Text": "",
            "list1Data": [],
            "currentList1Id": "",

            "list2Text": "",
            "list2Data": [],
            "currentList2Id": "",

            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],

            "renderFieldRow": [],
            "filterOptions": [],
            "enableFooter": true
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            onChange: this.onChange,
            dropDownChange: this.dropDownChange,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (value === "reload") {
            DataHandler.OnReloadClick(this.appStateCallback,
                this.appDataCallback, this.appData.currentList1Id);
        } else if (name === "toggle-display") {
            DataHandler.OnToggleDisplayClick(this.appStateCallback, this.appDataCallback);
        }
    }
    // for input and textarea
    onChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, name, value);
    }
    dropDownChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        var filterNames = ["filter1"];
        if (name === "list1-select") {
            DataHandler.OnAppChange(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "list2-select") {
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, value);
        } else if (filterNames.indexOf(name) >= 0) {
            DataHandler.OnFilterChange(this.appStateCallback, this.appDataCallback, name, value);
        }
    }
    appStateCallback() {
        $S.log("App:appStateCallback");
        this.setState({isLoaded: true});
    }
    appDataCallback(name, data) {
        $S.updateDataObj(this.appData, name, data, "checkType");
    }
    componentDidMount() {
        $S.log("App:componentDidMount");
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppDidMount(appStateCallback, appDataCallback);
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        return (<BrowserRouter>
            <Switch>
                <Route
                    render = {props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
                    )}
                />
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

