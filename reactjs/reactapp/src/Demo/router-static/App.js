import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../../interface/stack.js";

import AppHandler from "../../common/app/common/AppHandler";

import AppComponent from "../../common/app/components/AppComponent";

import DataHandler from "../common/DataHandler";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.appData = {
            "addContainerClass": true,
            "appHeading": [{"tag": "center.h2", "text": "Loading..."}],
            "renderFieldRow": [],
            "firstTimeDataLoadStatus": ""
        };
        this.onClick = this.onClick.bind(this);
        /* methods used in selectFilter end */
        this.appStateCallback = this.appStateCallback.bind(this);
        this.appDataCallback = this.appDataCallback.bind(this);
        this.pageComponentDidMount = this.pageComponentDidMount.bind(this);
        this.registerChildAttribute = this.registerChildAttribute.bind(this);
        this.childAttribute = {};
        this.methods = {
            onClick: this.onClick,
            pageComponentDidMount: this.pageComponentDidMount,
            registerChildAttribute: this.registerChildAttribute
        };
    }
    registerChildAttribute(name, method) {
        $S.updateDataObj(this.childAttribute, name, method, "checkUndefined");
    }
    gotoPage(pageName) {
        var pages = {};
        if ($S.isString(pages[pageName])) {
            this.childAttribute["history"].push(DataHandler.getPageUrlByPageName(pageName));
        }
    }
    gotoPageV2(currentAppId) {
        this.childAttribute["history"].push(DataHandler.getPageUrlByAppId(currentAppId));
    }
    onClick(e) {
        var name = AppHandler.getFieldName(e);
        var value = AppHandler.getFieldValue(e);
        $S.log("Button clicked: " + name + ":" + value);
    }
    appStateCallback() {
        $S.log("App:appStateCallback");
        this.setState({isLoaded: true});
    }
    appDataCallback(name, data) {
        $S.updateDataObj(this.appData, name, data, "checkType");
    }
    pageComponentDidMount(pageName) {
        DataHandler.PageComponentDidMount(this.appStateCallback, this.appDataCallback, pageName);
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
        var pageUrl = DataHandler.getPageUrl();
        var pages = DataHandler.getPages();
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={pages.noMatch}/>);
        return (<BrowserRouter>
            <Switch>
                <Route exact path={pageUrl.home}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pages.home}/>
                    )}
                />
                <Route exact path={pageUrl.page1}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pages.page1}/>
                    )}
                />
                <Route exact path={pageUrl.page2}
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pages.page2}/>
                    )}
                />
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
        // return (
        //     <AppComponent data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}/>
        // );
    }
}

export default App;

