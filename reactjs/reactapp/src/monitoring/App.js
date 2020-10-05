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
            "sectionName": "Loading...",
            "pageHeading": "",
            "homeFields": [],
            "dropdownFields": [],
            "renderFieldRow": [],
            "errorsData": []
        };
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
    }
    appStateCallback(stateData) {
        this.setState(stateData);
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
    render() {
        var methods = {appDataCallback: this.appDataCallback, appStateCallback: this.appStateCallback};
        
        var commonData = {};
        commonData["homeUrl"] = this.appData["homeUrl"];
        commonData["sectionName"] = this.appData["sectionName"];
        commonData["pageHeading"] = this.appData["pageHeading"];
        commonData["errorsData"] = this.appData["errorsData"];

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

