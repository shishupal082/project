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
            "goBackLinkData": [], // Used for back url

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
            "enableToggleButton": false,

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
        if ($S.isString(pages[pageName])) {
            this.childAttribute["history"].push(pages[pageName]);
        }
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
        if (name === "list2-select") {
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, value);
        } else if (name === "list3-select") {
            DataHandler.OnList3Change(this.appStateCallback, this.appDataCallback, value);
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
        // this.addTab(pageName);
        DataHandler.setData("pathParams", pathParams);
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
    }
    render() {
        var methods = this.methods;
        var commonData = this.appData;
        var pages = Config.pages;
        const projectId = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.projectId}/>);
        const projectStatusWork = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.projectStatusWork}/>);
        const projectStatusSupply = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.projectStatusSupply}/>);
        const updateSupplyStatus = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.updateSupplyStatus}/>);
        const displaySupplyStatus = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.displaySupplyStatus}/>);
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={Config.noMatch}/>);
        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.home}/>
                    )}
                />
                <Route exact path={pages.projectId} component={projectId}/>
                <Route exact path={pages.projectStatusWork} component={projectStatusWork}/>
                <Route exact path={pages.projectStatusSupply} component={projectStatusSupply}/>
                <Route exact path={pages.updateSupplyStatus} component={updateSupplyStatus}/>
                <Route exact path={pages.displaySupplyStatus} component={displaySupplyStatus}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

