import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";
import LedgerBook from "./components/LedgerBook";

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
            "disableFooter": true
        };
        this.onClick = this.onClick.bind(this);
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
        if (value === "reload") {
            DataHandler.TrackSectionView("onClick", this.appData.currentList1Id);
            DataHandler.UserChange(this.appStateCallback,
                this.appDataCallback, this.appData.currentList1Id);
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
        }
    }
    dropDownChange(e) {
        var name = e.currentTarget.name;
        var value = e.currentTarget.value;
        if (name === "list1-select") {
            var currentUserName = value;
            DataHandler.TrackSectionView("dropdownSelect", currentUserName);
            DataHandler.UserChange(this.appStateCallback, this.appDataCallback, currentUserName);
        } else if (name === "list2-select") {
            this.gotoPage(value);
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
        DataHandler.PageComponentMount(this.appStateCallback, this.appDataCallback, pageName);
    }
    componentDidMount() {
        $S.log("App:componentDidMount");
        var appDataCallback = this.appDataCallback;
        var appStateCallback = this.appStateCallback;
        DataHandler.AppComponentDidMount(appStateCallback, appDataCallback);
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

        const journal = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                        renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.journal}/>);

        const trial = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                            renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.trialbalance}/>);

        const journalbydate = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.journalbydate}/>);

        const ledger = (props) => (<LedgerBook {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.ledger}/>);

        const currentbal = (props) => (<LedgerBook {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.currentbal}/>);

        const currentbalbydate = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.currentbalbydate}/>);

        const summary = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.summary}/>);

        const summaryByDate = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.accountsummarybydate}/>);

        const accountsummarybycalander = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.accountsummarybycalander}/>);

        const customisedebit = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.customisedebit}/>);

        const customisecredit = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.customisecredit}/>);

        const custompage = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.custompage}/>);

        const profitandloss = (props) => (<AppComponent {...props} onClick={this.onClick} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.profitandloss}/>);
        const noMatch = (props) => (<AppComponent {...props} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.noMatch}/>);

        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} renderFieldRow={this.appData.renderFieldRow} methods={methods} currentPageName={Config.home}/>
                    )}
                />
                <Route path={pages.journal} component={journal}/>
                <Route path={pages.journalbydate} component={journalbydate}/>
                <Route path={pages.currentbal} component={currentbal}/>
                <Route path={pages.currentbalbydate} component={currentbalbydate}/>
                <Route path={pages.ledger} component={ledger}/>
                <Route path={pages.summary} component={summary}/>
                <Route path={pages.accountsummarybydate} component={summaryByDate}/>
                <Route path={pages.trialbalance} component={trial} />
                <Route path={pages.accountsummarybycalander} component={accountsummarybycalander} />
                <Route path={pages.customisedebit} component={customisedebit} />
                <Route path={pages.customisecredit} component={customisecredit} />
                <Route path={pages.custompage} component={custompage} />
                <Route path={pages.profitandloss} component={profitandloss} />
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
    }
}

export default App;

