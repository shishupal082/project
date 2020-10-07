import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";
// import Api from "../common/Api";


import Home from "./components/Home";
import AppComponent from "./components/AppComponent";

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
            "homeUrl": pages.home,
            "section": "",
            "sectionName": "Loading...",
            "availableSection": [],

            "pageName": "",
            "pageHeading": "",
            "pageTab": [],

            "homeFields": [],
            "dropdownFields": [],
            "renderFieldRow": [],
            "errorsData": [],

            "selectedDateType": "",
            "dateSelection": []
        };
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.addTab = this.addTab.bind(this);
        this.removeTab = this.removeTab.bind(this);
    }
    appStateCallback(stateData) {
        this.setState({isLoaded: true});
    }
    appDataCallback(name, data) {
        DataHandler(this.appData).update(name, data);
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
    render() {
        var methods = {appDataCallback: this.appDataCallback,
                        appStateCallback: this.appStateCallback,
                        addTab: this.addTab,
                        removeTab: this.removeTab,
                    };
        
        var commonData = {};
        commonData["homeUrl"] = this.appData["homeUrl"];
        commonData["pageName"] = this.appData["pageName"];
        commonData["pageHeading"] = this.appData["pageHeading"];
        commonData["pageTab"] = this.appData["pageTab"];

        commonData["section"] = this.appData["section"];
        commonData["sectionName"] = this.appData["sectionName"];
        commonData["availableSection"] = this.appData["availableSection"];

        commonData["dropdownFields"] = this.appData["dropdownFields"];
        commonData["errorsData"] = this.appData["errorsData"];

        commonData["selectedDateType"] = this.appData["selectedDateType"];
        commonData["dateSelection"] = this.appData["dateSelection"];

        const entry = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="entry"/>);

        const entrybydate = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="entrybydate"/>);
        
        const entrybytype = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="entrybytype"/>);
        
        const entrybystation = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="entrybystation"/>);
        
        const entrybydevice = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="entrybydevice"/>);
        
        const summary = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="summary"/>);
        const noMatch = (props) => (<AppComponent {...props} state={this.state} data={commonData} methods={methods}
                    renderFieldRow={this.appData.renderFieldRow} currentPageName="noMatch"/>);

        return (<BrowserRouter>
            <Switch>
                <Route exact path={pages.home}
                    render={props => (
                        <Home {...props} state={this.state} data={commonData} methods={methods} homeFields={this.appData.homeFields} currentPageName="home"/>
                    )}
                />
                <Route path={pages.entry} component={entry}/>
                <Route path={pages.entrybydate} component={entrybydate}/>
                <Route path={pages.entrybytype} component={entrybytype}/>
                <Route path={pages.entrybystation} component={entrybystation}/>
                <Route path={pages.entrybydevice} component={entrybydevice}/>
                <Route path={pages.summary} component={summary}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // <Route render={props => (
        //             <AppComponent {...props} state={this.state} data={commonData} methods={methods}
        //                 renderFieldRow={this.appData.renderFieldRow} currentPageName="noMatch"/>
        //             )}
        //         />
    }
}

export default App;

