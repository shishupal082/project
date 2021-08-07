import React from 'react';
// import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";
import Config from "./common/Config";


// var pages = Config.pages;

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
            "disableFooter": true,

            "filterOptions": []
        };
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.dropDownChange = this.dropDownChange.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            onChange: this.onChange,
            dropDownChange: this.dropDownChange,
            pageComponentDidMount: this.pageComponentDidMount,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    gotoPage(pageName) {
        // var pages = Config.pages;
        // if ($S.isString(pages[pageName])) {
        //     this.childAttribute["history"].push(pages[pageName])
        // } else {
        //     alert("page '" + pageName + "' not found");
        // }
        // DataHandler.TrackPageView(pageName);
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
        }
    }
    // for input and textarea
    onChange(e) {
        // var name = e.currentTarget.name;
        // var value = e.currentTarget.value;
        // DataHandler.OnInputChange(this.appStateCallback, this.appDataCallback, name, value);
    }
    // not working ?
    onFormSubmit(e) {
        alert("onFormSubmit");
        e.preventDefault();
    }
    dropDownChange(e) {
        var name = e.currentTarget.name, i;
        var value = e.currentTarget.value;
        var inputSelect = ["addentry.subject", "addentry.heading"];
        var filterOptions = DataHandler.getData("filterOptions", []);
        var filterNames = [];
        for(i=0; i<filterOptions.length; i++) {
            if ($S.isString(filterOptions[i].selectName)) {
                filterNames.push(filterOptions[i].selectName);
            }
        }
        if (name === "list1-select") {
            var sectionId = value;
            // DataHandler.TrackSectionView("dropdownSelect", sectionId);
            DataHandler.OnList1Change(this.appStateCallback, this.appDataCallback, sectionId);
        } else if (name === "list2-select") {
            DataHandler.OnList2Change(this.appStateCallback, this.appDataCallback, value);
        } else if (filterNames.indexOf(name) >= 0) {
            // DataHandler.TrackFilterOperation("select", value, name);
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
        // DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback, pageName);
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
        return (<AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={Config.dataDisplay}/>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

