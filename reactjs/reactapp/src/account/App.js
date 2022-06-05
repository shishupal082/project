import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";;


var pageUrl = Config.pageUrl;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],
            "addContainerClass": true,
            "firstTimeDataLoadStatus": "",

            "list1Text": "Select App...",
            "list1Data": [],
            "currentList1Id": "",

            "list2Text": "Select Page...",
            "list2Data": [],
            "currentList2Id": "", // same as pageName

            "list3Text": "Select...",
            "list3Data": [],
            "currentList3Id": "",

            "renderFieldRow": [],
            "filterOptions": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": [],
            "enableReloadButton": true,
            "enableToggleButton": true,
            "enableFooter": true,
            "enableFooterV2": true
        };
        this.appData.pageTab = [];
        this.onClick = this.onClick.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.isComponentUpdate = this.isComponentUpdate.bind(this);
        this.pageComponentDidUpdate = this.pageComponentDidUpdate.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.getTabDisplayText = this.getTabDisplayText.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            dropDownChange: this.dropDownChange,
            isComponentUpdate: this.isComponentUpdate,
            pageComponentDidUpdate: this.pageComponentDidUpdate,
            pageComponentDidMount: this.pageComponentDidMount,
            getTabDisplayText: this.getTabDisplayText,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    gotoPage(pageName) {
        var pages = Config.otherPagesList;
        if ($S.isArray(pages) && pages.indexOf(pageName) >= 0) {
            this.childAttribute["history"].push(pageName);
        } else {
            alert("page '" + pageName + "' not found");
        }
    }
    gotoPageV2(appId) {
        var pageName = DataHandler.getPathParamsData("pageName", "");
        var url = Config.basepathname + "/" + appId;
        if ($S.isStringV2(pageName)) {
            this.childAttribute["history"].push(url + "/" + pageName);
        } else {
            this.childAttribute["history"].push(url);
        }
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (value === "reload") {
            DataHandler.TrackSectionView("onClick", this.appData.currentList1Id);
            DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback);
            DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback);
        } else if (name === "reset-filter") {
            AppHandler.TrackEvent("ResetClick");
            DataHandler.OnResetClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "open-tab") {
            if (value !== this.appData.currentList2Id) {
                this.gotoPage(value);// value is page name
            }
        } else if (name === "close-tab") {
            this.removeTab(value);// value is page name
            this.appStateCallback();
        } else if (name === "date-select") {
            var selectedDateType = value;
            DataHandler.TrackDateSelection(selectedDateType);
            DataHandler.DateSelectionChange(this.appStateCallback, this.appDataCallback, selectedDateType);
        } else if (name === "footer-filter-toggle") {
            AppHandler.TrackEvent("ToggleClick");
            AppHandler.HandleToggleClick(this.appStateCallback, this.appDataCallback, this.appData.enableFooterV2);
        }
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
        if (name === "list1-select") {
            DataHandler.TrackSectionView("list1Change", value);
            this.gotoPageV2(value);
        } else if (name === "list2-select") {
            DataHandler.TrackSectionView("list2Change", value);
            this.gotoPage(value);
        } else if (name === "list3-select") {
            DataHandler.TrackSectionView("list3Change", value);
            DataHandler.OnList3Change(this.appStateCallback, this.appDataCallback, value);
        } else if (filterNames.indexOf(name) >= 0) {
            DataHandler.TrackSectionView("filterChange", value);
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
        var oldAppId = DataHandler.getPathParamsData("pid", "");
        var oldPageName = DataHandler.getPathParamsData("pageName");
        var displayLoading = false;
        if (currentPageName !== prevPageName) {
            isComponentUpdate = true;
            if (prevPageName === Config.projectHome && currentPageName === Config.home) {
                displayLoading = true;
            } else if (prevPageName === Config.home && currentPageName === Config.otherPages) {
                displayLoading = true;
            } else {
                /**
                    DataHandler.OnList1Change is required, because
                    When user is on noMatch page like invalid baseurl (metaData will not load) and selected pid, then
                    If this is not used then, metaData reload will not happen
                */
                DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback);
            }
        } else if ($S.isObject(params)) {
            if ($S.isStringV2(params.pid) && params.pid !== oldAppId) {
                isComponentUpdate = true;
                if ($S.isStringV2(params.pageName)) {
                    displayLoading = true;
                }
                /**
                    DataHandler.OnList1Change is required, because
                    When user is on specific page of one pid and went back to different pid of same page (or other page), then
                    If this is not used then, metaData reload will not happen
                */
                DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback);
            } else if ($S.isStringV2(params.pageName) && params.pageName !== oldPageName) {
                DataHandler.FirePageChange();
                isComponentUpdate = true;
            }
        }
        DataHandler.setData("displayLoading", displayLoading);
        return isComponentUpdate;
    }
    pageComponentDidMount(pageName, pathParams) {
        $S.log("App:pageComponentDidMount"); //#1
        this.addTab(pageName);
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
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
    removeTab(pageName) {
        this.appData.pageTab = this.appData.pageTab.filter(function(el, i, arr) {
            if (pageName === el) {
                return false;
            }
            return true;
        });
    }
    addTab(pageName) {
        if (this.appData.pageTab.indexOf(pageName) >= 0) {
            return;
        }
        this.appData.pageTab.push(pageName);
    }
    getTabDisplayText(tabName) {
        return DataHandler.GetMetaDataPageHeading(tabName);
    }
    render() {
        var commonData = this.appData;
        var methods = this.methods;
        return (<BrowserRouter>
            <Switch>
                <Route exact path={pageUrl.projectHome}
                    render={props => (
                        <AppComponent {...props} data={commonData} renderFieldRow={this.appData.renderFieldRow} methods={methods} currentPageName={Config.projectHome}/>
                    )}
                />
                <Route exact path={pageUrl.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} renderFieldRow={this.appData.renderFieldRow} methods={methods} currentPageName={Config.home}/>
                    )}
                />
                <Route exact path={pageUrl.otherPages}
                    render={props => (
                        <AppComponent {...props} data={commonData} renderFieldRow={this.appData.renderFieldRow} methods={methods} currentPageName={Config.otherPages}/>
                    )}
                />
                <Route
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.noMatch}/>
                    )}
                />
            </Switch>
        </BrowserRouter>);
    }
}

export default App;

