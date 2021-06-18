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
            "goBackLinkData": [], // Used for back url

            "selectFilterComponentClass": "",
            "list1Text": "",
            "list1Data": [],
            "currentList1Id": "",

            "list2Text": "Select Page...",
            "list2Data": [],
            "currentList2Id": "", // same as pageName

            "list3Text": "Select...",
            "list3Data": [],
            "currentList3Id": "",

            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],
            "pageHeading": "",
            "pageTab": [],
            "hidePageTab": true,

            "renderFieldRow": [],
            "errorsData": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": [],
            "disableFooter": true,
            "disableFooterV2": false,
            "enableToggleButton": true,

            "filterOptions": []
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
        var pages = Config.pages;
        var currentAppId = DataHandler.getData("currentList1Id", "0");
        if ($S.isString(pages[pageName])) {
            this.childAttribute["history"].push(Config.basepathname + "/" + currentAppId + "/" +  pageName);
        }
    }
    gotoPageV2(currentAppId) {
        var currentPageName = DataHandler.getData("currentList2Id", "");
        this.childAttribute["history"].push(Config.basepathname + "/" + currentAppId + "/" +  currentPageName);
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (["addentry.submit"].indexOf(name) >= 0) {
            e.preventDefault();
        }
        if (value === "reload") {
            DataHandler.OnReloadClick(this.appStateCallback,
                this.appDataCallback, this.appData.currentList1Id);
        } else if (name === "reset-filter") {
            DataHandler.OnResetClick(this.appStateCallback, this.appDataCallback);
        } else if (name === "date-select") {
            DataHandler.OnDateSelectClick(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "footer-filter-toggle") {
            AppHandler.TrackEvent("ToggleClick");
            AppHandler.HandleToggleClick(this.appStateCallback, this.appDataCallback, this.appData.disableFooterV2);
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
    pageComponentDidMount(pageName, pathParams) {
        var pid = "0";
        if ([Config.projectHome, Config.noMatch].indexOf(pageName) < 0) {
            pageName = Config.home;
            if ($S.isStringV2(pathParams.pageName)) {
                pageName = pathParams.pageName;
            }
            if ($S.isStringV2(pathParams.pid)) {
                pid = pathParams.pid;
            }
        }
        DataHandler.setData("currentList1Id", pid);
        DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback, pageName);
    }
    componentDidMount() {
        $S.log("App:componentDidMount");
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppDidMount(appStateCallback, appDataCallback);
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
        // return DataHandler.GetTabDisplayText(tabName);
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pageUrl = Config.pageUrl;
        // const entry = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.entry}/>);
        // const update = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.update}/>);
        // const summary = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.summary}/>);
        // const ta = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.ta}/>);
        // const dbview = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.dbview}/>);
        // const custom_dbview = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.custom_dbview}/>);
        // const dbview_summary = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.dbview_summary}/>);
        // const add_field_report = (props) => (<AppComponent {...props}
        //                     data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
        //                     currentPageName={Config.add_field_report}/>);
        var pageName = DataHandler.getData("currentList2Id", "");
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.noMatch}/>);

        return (<BrowserRouter>
            <Switch>
                <Route exact path={pageUrl.projectHome}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.projectHome}/>
                    )}
                />
                <Route exact path={pageUrl.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pageName}/>
                    )}
                />
                <Route exact path={pageUrl.page}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pageName}/>
                    )}
                />
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);


                // <Route path={pages.entry} component={entry}/>
                // <Route path={pages.update} component={update}/>
                // <Route path={pages.summary} component={summary}/>
                // <Route path={pages.ta} component={ta}/>
                // <Route path={pages.dbview} component={dbview}/>
                // <Route path={pages.dbview_summary} component={dbview_summary}/>
                // <Route path={pages.custom_dbview} component={custom_dbview}/>
                // <Route path={pages.add_field_report} component={add_field_report}/>

        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

