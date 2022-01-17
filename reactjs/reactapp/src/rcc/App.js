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
            "firstTimeDataLoadStatus": "",

            "selectFilterComponentClass": "",
            "list1Text": "Select...",
            "list1Data": [],
            "currentList1Id": "",

            "list2Text": "Select Page...",
            "list2Data": [],
            "currentList2Id": "", // same as pageName

            "list3Text": "Select...",
            "list3Data": [],
            "currentList3Id": "",

            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],

            "renderFieldRow": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": [],
            "isSinglePageApp": false,
            "enableReloadButton": true,
            "enableFooter": true,
            "enableFooterV2": true,
            "enableToggleButton": true,
            "filterOptions": []
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
        /* methods used in selectFilter end */
        this.isComponentUpdate = this.isComponentUpdate.bind(this);
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.pageComponentDidUpdate = this.pageComponentDidUpdate.bind(this);
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
    gotoPage(pageName) {
        if ($S.isBooleanTrue(this.appData.isSinglePageApp)) {
            DataHandler.updatePathParameter("pageName", pageName);
            return;
        }
        var pages = Config.pages;
        if ($S.isString(pages[pageName])) {
            this.childAttribute["history"].push(DataHandler.getPageUrlByPageName(pageName));
        }
    }
    gotoPageV2(currentAppId) {
        if ($S.isBooleanTrue(this.appData.isSinglePageApp)) {
            DataHandler.updatePathParameter("pid", currentAppId);
            return;
        }
        this.childAttribute["history"].push(DataHandler.getPageUrlByAppId(currentAppId));
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (["addentry.submit"].indexOf(name) >= 0) {
            e.preventDefault();
        }
        if (value === "reload") {
            DataHandler.OnReloadClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "reset-filter") {
            DataHandler.OnResetClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "date-select") {
            DataHandler.OnDateSelectClick(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "footer-filter-toggle") {
            AppHandler.TrackEvent("ToggleClick");
            AppHandler.HandleToggleClick(this.appStateCallback, this.appDataCallback, this.appData.enableFooterV2);
        }else if (value === "addentry.submit") {
            DataHandler.SubmitFormClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "sortable") {
            DataHandler.SortClick(this.appStateCallback, this.appDataCallback, value);
        }
    }
    // for input and textarea
    onChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, name, value);
    }
    // not working ?
    onFormSubmit(e) {
        e.preventDefault();
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        DataHandler.OnFormSubmit(this.appStateCallback, this.appDataCallback, name, value);
    }
    dropDownChange(e) {
        var name = e.currentTarget.name, i;
        var value = e.currentTarget.value;
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filterNames = [];
        for(i=0; i<filterOptions.length; i++) {
            if ($S.isString(filterOptions[i].selectName)) {
                filterNames.push(filterOptions[i].selectName);
            }
        }
        if (name === "list1-select") {
            var currentAppId = value;
            this.gotoPageV2(currentAppId);
            DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback, currentAppId);
        } else if (name === "list2-select") {
            this.gotoPage(value);
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "list3-select") {
            DataHandler.OnList3Change(this.appStateCallback, this.appDataCallback, value);
        } else if (filterNames.indexOf(name) >= 0) {
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
    isComponentUpdate(arg) {
        if ($S.isBooleanTrue(this.appData.isSinglePageApp)) {
            return false;
        }
        var currentPageName = arg["currentPageName"];
        var prevPageName = arg["prevPageName"];
        var params = arg["params"];
        var isComponentUpdate = false;
        var oldAppId = DataHandler.getPathParamsData("pid", "");
        var oldPageName = DataHandler.getPathParamsData("pageName");
        var displayLoading = false;
        if (currentPageName !== prevPageName) {
            isComponentUpdate = true;
            if (prevPageName === Config.home && currentPageName === Config.otherPages) {
                displayLoading = true;
            }
        } else if ($S.isObject(params)) {
            if ($S.isStringV2(params.pid) && params.pid !== oldAppId) {
                isComponentUpdate = true;
                if ($S.isStringV2(params.pageName)) {
                    displayLoading = true;
                }
                /**
                    DataHandler.OnList1Change is required, because
                    When user is on specific page of one pid and went back to different pid of same page or other page, then
                    If this is not used then, metaData reload will not happen
                */
                DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback);
            } else if ($S.isStringV2(params.pageName) && params.pageName !== oldPageName) {
                isComponentUpdate = true;
            }
        }
        DataHandler.setData("displayLoading", displayLoading);
        return isComponentUpdate;
    }
    pageComponentDidMount(pageName, pathParams) {
        $S.log("App:pageComponentDidMount"); //#1
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
        // DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback);
    }
    componentDidMount() {
        $S.log("App:componentDidMount"); //#2
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppDidMount(appStateCallback, appDataCallback);
    }
    pageComponentDidUpdate(pageName, pathParams) {
        $S.log("App:pageComponentDidUpdate"); //#3
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
        DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback);
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pageUrl = Config.pageUrl;
        commonData.appComponentClassName = DataHandler.getAppComponentClassName();
        return (<BrowserRouter>
            <Switch>
                <Route exact path={pageUrl.projectHome}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.projectHome}/>
                    )}
                />
                <Route exact path={pageUrl.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.home}/>
                    )}
                />
                <Route exact path={pageUrl.otherPages}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.otherPages}/>
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

