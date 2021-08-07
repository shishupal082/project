import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import DataHandlerV2 from "./common/DataHandlerV2";
import Config from "./common/Config";;


var pages = Config.pages;

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

            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],
            "pageHeading": "",

            "renderFieldRow": [],
            "errorsData": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": [],
            "disableFooter": false,

            "filterOptions": []
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
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
        if ($S.isString(pages[pageName])) {
            this.childAttribute["history"].push(pages[pageName])
        } else {
            alert("page '" + pageName + "' not found");
        }
        DataHandler.TrackPageView(pageName);
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        if (["addentry.submit"].indexOf(name) >= 0) {
            // it is required for home link redirect click
            e.preventDefault();
        }
        if (value === "reload") {
            DataHandler.TrackSectionView("reload", this.appData.currentList1Id);
            DataHandler.OnReloadClick(this.appStateCallback,
                this.appDataCallback, this.appData.currentList1Id);
        } else if (name === "reset-filter" && value === "reset-filter") {
            DataHandler.TrackFilterOperation("click", this.appData.currentList1Id);
            DataHandler.OnResetFilter(this.appStateCallback, this.appDataCallback);
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
            DataHandler.OnDateSelection(this.appStateCallback, this.appDataCallback, selectedDateType);
        } else if (name === "addentry.submit") {
            DataHandlerV2.SubmitFormClick(this.appStateCallback, this.appDataCallback);
        }
    }
    // for input and textarea
    onChange(e) {
        DataHandler.handleInputChange(e);
    }
    // not working ?
    onFormSubmit(e) {
        alert("onFormSubmit");
        e.preventDefault();
    }
    dropDownChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        var fiterNames = ["stationSelected", "typeSelected", "deviceSelected", "usernameSelected"];
        var inputSelect = ["addentry.subject", "addentry.heading"];
        if (name === "list1-select") {
            var sectionId = value;
            DataHandler.TrackSectionView("dropdownSelect", sectionId);
            DataHandler.OnSectionChange(this.appStateCallback, this.appDataCallback, sectionId);
        } else if (name === "list2-select") {
            this.gotoPage(value);
        } else if (fiterNames.indexOf(name) >= 0) {
            DataHandler.TrackFilterOperation("select", value, name);
            DataHandler.OnFilterChange(this.appStateCallback, this.appDataCallback, name, value);
        } else if (inputSelect.indexOf(name) >= 0) {
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
        this.addTab(pageName);
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
        return DataHandler.GetTabDisplayText(tabName);
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;

        const entry = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entry}/>);

        const entrybydate = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybydate}/>);
        
        const entrybytype = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybytype}/>);

        const entrybystation = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybystation}/>);

        const entrybydevice = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybydevice}/>);

        const summary = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.summary}/>);

        const entrybydatefilter = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods} dropDownChange={this.dropDownChange}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybydatefilter}/>);

        const addentry = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods} dropDownChange={this.dropDownChange}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.addentry}/>);

        const uploadfile = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods} dropDownChange={this.dropDownChange}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.uploadfile}/>);

        const noMatch = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.noMatch}/>);

        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.home}/>
                    )}
                />
                <Route path={pages.entry} component={entry}/>
                <Route path={pages.entrybydate} component={entrybydate}/>
                <Route path={pages.entrybytype} component={entrybytype}/>
                <Route path={pages.entrybystation} component={entrybystation}/>
                <Route path={pages.entrybydevice} component={entrybydevice}/>
                <Route path={pages.summary} component={summary}/>
                <Route path={pages.entrybydatefilter} component={entrybydatefilter}/>
                <Route path={pages.addentry} component={addentry}/>
                <Route path={pages.uploadfile} component={uploadfile}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // If we use this then this.props.history is not assessible for goBackLink
        // <Route render={props => (
        //             <AppComponent {...props} data={commonData} methods={methods}
        //                 renderFieldRow={this.appData.renderFieldRow} currentPageName="noMatch"/>
        //             )}
        //         />
    }
}

export default App;

