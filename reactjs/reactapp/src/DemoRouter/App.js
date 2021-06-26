import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import $S from "../interface/stack.js";

import AppHandler from "../common/app/common/AppHandler";

import AppComponent from "../common/app/components/AppComponent";

import DataHandler from "./common/DataHandler";

import Page1 from "./components/Page1";

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
        $S.log("App:pageComponentDidMount");
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
        var pages = DataHandler.getPages();
        const noMatch = (props) => (<AppComponent {...props}
                            data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow}
                            currentPageName={pages.noMatch}/>);
        const page3 = (props) => (<Page1 {...props} heading="Page 3" currentPageName="page3"/>);
        const page4 = (props) => (<Page1 {...props} heading="Page 4" currentPageName="page4"/>);
        /**
        When going from home to page-1 or page-2 --> page-1 componentDidMount will fire
        When going from page-1 to page-2 --> page-1 componentDidMount will not fire
            To force fire componentDidMount
                - define each component seprately and pass as props.parameter in Route component like page-3
        When going from page-1 or page-2 to page-3 or page-4 --> page-1 componentDidMount will fire
        When toggeling b/w page-1 and page-2 --> page-1 componentDidUpdate will fire
        Note: At a time either componentDidMount or componentDidUpdate will fire but not both
        **/
        return (<BrowserRouter>
            <Switch>
                <Route exact path="/"
                    render={props => (
                        <AppComponent {...props} data={commonData} methods={methods} renderFieldRow={this.appData.renderFieldRow} currentPageName={pages.home}/>
                    )}
                />
                <Route exact path="/page-1"
                    render={props => (
                        <Page1 {...props} heading="Page 1" currentPageName="page1"/>
                    )}
                />
                <Route exact path="/page-2"
                    render={props => (
                        <Page1 {...props} heading="Page 2" currentPageName="page2"/>
                    )}
                />
                <Route exact path="/page-3" component={page3}/>
                <Route exact path="/page-4" component={page4}/>
                <Route component={noMatch}/>
            </Switch>
        </BrowserRouter>);
    }
}

export default App;

