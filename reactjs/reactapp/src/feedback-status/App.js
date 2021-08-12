import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";

AppHandler.setGtag(Config.gtag);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "addContainerClass": true,
            "firstTimeDataLoadStatus": "completed",

            "list2Text": "Select...",
            "list2Data": [],
            "currentList2Id": "",

            "list3Text": "Select...",
            "list3Data": [],
            "currentList3Id": "",

            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],

            "renderFieldRow": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": []
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.isComponentUpdate = this.isComponentUpdate.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.pageComponentDidUpdate =  this.pageComponentDidUpdate.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            onChange: this.onChange,
            dropDownChange: this.dropDownChange,
            onFormSubmit: this.onFormSubmit,
            isComponentUpdate: this.isComponentUpdate,
            pageComponentDidMount: this.pageComponentDidMount,
            pageComponentDidUpdate: this.pageComponentDidUpdate,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    gotoPage(value) {
        this.childAttribute["history"].push(DataHandler.getLinkV2(value));
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (value === "reload") {
            DataHandler.OnReloadClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "reset-filter") {
            DataHandler.OnResetClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "date-select") {
            DataHandler.OnDateSelectClick(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "sortable") {
            DataHandler.SortClick(this.appStateCallback, this.appDataCallback, value);
        } else {
            DataHandler.OnClick(this.appStateCallback, this.appDataCallback, name, value);
        }
    }
    // for input and textarea
    onChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        // if (name === Config.fieldsKey.UploadFile) {
        //     DataHandler.OnFileUploadChange(this.appStateCallback, this.appDataCallback, name, e.currentTarget.files[0]);
        // } else {
            DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, name, value);
        // }
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
        if (name === "list2-select") {
            this.gotoPage(value);
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, name, value);
        } else if (name === "list3-select") {
            DataHandler.OnList3Change(this.appStateCallback, this.appDataCallback, name, value);
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
    isComponentUpdate(arg) {
        var currentPageName = arg["currentPageName"];
        var prevPageName = arg["prevPageName"];
        var params = arg["params"];
        var isComponentUpdate = false;
        var oldId1 = DataHandler.getPathParamsData("id1");
        var oldId2 = DataHandler.getPathParamsData("id2");
        var oldPageId = DataHandler.getPathParamsData("pageId");
        var oldViewPageName = DataHandler.getPathParamsData("viewPageName");
        if (currentPageName !== prevPageName) {
            isComponentUpdate = true;
            DataHandler.HandleComponentChange("pageName");
        } else {
            if ($S.isObject(params)) {
                if ($S.isStringV2(oldId1) && $S.isStringV2(params.id1) && oldId1 !== params.id1) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("id1");
                } if ($S.isStringV2(oldId2) && $S.isStringV2(params.id2) && oldId2 !== params.id2) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("id2");
                } else if ($S.isStringV2(oldPageId) && $S.isStringV2(params.pageId) && oldPageId !== params.pageId) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("pageId");
                } else if ($S.isStringV2(oldViewPageName) && $S.isStringV2(params.viewPageName) && oldViewPageName !== params.viewPageName) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("viewPageName");
                }
            }
        }
        return isComponentUpdate;
    }
    pageComponentDidMount(pageName, pathParams) {
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
    }
    pageComponentDidUpdate(pageName, pathParams) {
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
        DataHandler.PageComponentDidUpdate(this.appStateCallback, this.appDataCallback);
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
        var pages = Config.pages;
        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.home}/>
                    )}
                />
                <Route exact path={pages.id1Page}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.id1Page}/>
                    )}
                />
                <Route exact path={pages.id2Page}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.id2Page}/>
                    )}
                />
                <Route exact path={pages.viewPage}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.viewPage}/>
                    )}
                />
                <Route exact path={pages.displayPage}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.displayPage}/>
                    )}
                />
                <Route
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.noMatch}/>
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
