import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";;


var pages = Config.pages;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "firstTimeDataLoadStatus": "",
            "goBackLinkData": [], // Used for back url

            "list1Text": "Select User",
            "list1Data": [],
            "currentList1Id": "",

            "list2Text": "Select Page...",
            "list2Data": [],
            "currentList2Id": "", // same as pageName

            "appHeading": "Loading...",
            "pageHeading": "",
            "pageTab": [],

            "renderFieldRow": [],
            "errorsData": [],

            "selectedDateType": "",
            "dateSelection": [],
            "dateSelectionRequiredPages": [],
            "disableFooter": false
        };
        this.onClick = this.onClick.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        /* methods used in selectFilter */
        this.onList1Select = this.onList1Select.bind(this);
        this.onList2Select = this.onList2Select.bind(this);
        this.onDateSelect = this.onDateSelect.bind(this);
        this.onReloadClick = this.onReloadClick.bind(this);
        this.OpenTab = this.OpenTab.bind(this);
        this.CloseTab = this.CloseTab.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.getTabDisplayText = this.getTabDisplayText.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onList1Select: this.onList1Select,
            onList2Select: this.onList2Select,
            onDateSelect: this.onDateSelect,
            onReloadClick: this.onReloadClick,
            OpenTab: this.OpenTab,
            CloseTab: this.CloseTab,
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
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        if (value === "reload") {
            DataHandler.TrackSectionView("onClick", this.appData.currentList1Id);
            DataHandler.OnSectionChange(this.appStateCallback,
                this.appDataCallback, this.appData.currentList1Id);
        } else if (name === "reset-filter" && value === "reset-filter") {
            // DataHandler.TrackSectionView("onClick", this.appData.currentList1Id);
            DataHandler.OnResetFilter(this.appStateCallback, this.appDataCallback);
        }
    }
    dropDownChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        DataHandler.OnFilterSelect(this.appStateCallback, this.appDataCallback, name, value);
    }
    onList1Select(e) {
        var sectionId = e.currentTarget.value;
        DataHandler.TrackSectionView("dropdownSelect", sectionId);
        DataHandler.OnSectionChange(this.appStateCallback, this.appDataCallback, sectionId);
    }
    onList2Select(e) {
        this.gotoPage(e.currentTarget.value);
    }
    onDateSelect(e) {
        var selectedDateType = e.currentTarget.value;
        DataHandler.TrackDateSelection(selectedDateType);
        DataHandler.OnDateSelection(this.appStateCallback, this.appDataCallback, selectedDateType);
    }
    onReloadClick(e) {
        DataHandler.TrackSectionView("onReloadClick", this.appData.currentList1Id);
        DataHandler.OnSectionChange(this.appStateCallback, this.appDataCallback, this.appData.currentList1Id);
    }
    OpenTab(e) {
        var pageName = e.currentTarget.getAttribute("value");
        if (pageName !== this.appData.currentList2Id) {
            this.gotoPage(pageName);
        }
    }
    CloseTab(e) {
        var pageName = e.currentTarget.getAttribute("value");
        this.removeTab(pageName);
        this.appStateCallback();
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

        const entrybydatefilter = (props) => (<AppComponent {...props} onClick={this.onClick} dropDownChange={this.dropDownChange}
                    data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.entrybydatefilter}/>);
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

