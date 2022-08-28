import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";
import CommonConfig from "../common/app/common/CommonConfig";
import CommonDataHandler from "../common/app/common/CommonDataHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";

AppHandler.setGtag(CommonConfig.gtag);
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "addContainerClass": true,
            "firstTimeDataLoadStatus": "completed",
            "appComponentClassName": "",

            "list1Text": "Select...",
            "list1Data": [],
            "currentList1Id": "",

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
            "dateSelectionRequiredPages": [],
            "enableReloadButton": false,
            "enableFooter": true,
            "toggleClickCount": 0,
            "enableToggleButton": true,
            "enableFooterV2": true,
            "filterOptions": []
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
    gotoPageV2(value) {
        this.childAttribute["history"].push(value);
    }
    // gotoPage(value) {
    //     this.gotoPageV2(DataHandler.getLinkV2(value));
    // }
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
        } else if (name === "footer-filter-toggle") {
            AppHandler.TrackEvent("ToggleClick");
            this.appData.toggleClickCount += 1;
            AppHandler.HandleToggleClick(this.appStateCallback, this.appDataCallback, this.appData.enableFooterV2);
        } else if (name === "view_file.unique_id") {
            DataHandler.ViewFileClick(this.appStateCallback, this.appDataCallback, name, value);
        } else {
            DataHandler.OnClick(this.appStateCallback, this.appDataCallback, name, value);
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
        if (name === "list1-select") {
            this.gotoPageV2(DataHandler.getLinkByIndex(value));
            DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback, name, value);
        } else if (name === "list2-select") {
            this.gotoPageV2(DataHandler.getPageUrlByPageName(value));
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, name, value);
        } else if (name === "list3-select") {
            DataHandler.OnList3Change(this.appStateCallback, this.appDataCallback, name, value);
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
        var currentPageName = arg["currentPageName"];
        var prevPageName = arg["prevPageName"];
        var params = arg["params"];
        var isComponentUpdate = false;
        var oldIndex = DataHandler.getPathParamsData("index");
        var oldIndexPageName = DataHandler.getPathParamsData("pageName");
        if (currentPageName !== prevPageName) {
            isComponentUpdate = true;
            DataHandler.HandleComponentChange("pageName", prevPageName, currentPageName);
        } else {
            if ($S.isObject(params)) {
                if ($S.isStringV2(oldIndex) && $S.isStringV2(params.index) && oldIndex !== params.index) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("index", oldIndex, params.index);
                } else if ($S.isStringV2(oldIndexPageName) && $S.isStringV2(params.pageName) && oldIndexPageName !== params.pageName) {
                    isComponentUpdate = true;
                    DataHandler.HandleComponentChange("indexPageName", oldIndexPageName, params.pageName);
                }
            }
        }
        return isComponentUpdate;
    }
    pageComponentDidMount(pageName, pathParams) {//#1
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
        CommonDataHandler.setData("pathParams", pathParams);
    }
    pageComponentDidUpdate(pageName, pathParams) {//#3
        DataHandler.setData("pageName", pageName);
        DataHandler.setData("pathParams", pathParams);
        CommonDataHandler.setData("pathParams", pathParams);
        DataHandler.PageComponentDidUpdate(this.appStateCallback, this.appDataCallback, pageName);
    }
    componentDidMount() {//#2
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
                <Route exact path={pages.origin}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.origin}/>
                    )}
                />
                <Route exact path={pages.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.home}/>
                    )}
                />
                <Route exact path={pages.projectPage}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.projectPage}/>
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

