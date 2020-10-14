import React from 'react';
import $S from "../../interface/stack.js";
import Api from "../../common/Api";

import DataHandler from "../common/DataHandler";

import Heading from "./partial/Heading";
import Errors from "./partial/Errors";

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("AppComponent:componentDidMount");
        DataHandler.setData("currentPageName", this.props.currentPageName);
        this.props.methods.addTab(this.props.currentPageName);
        var appStateCallback = this.props.methods.appStateCallback;
        var appDataCallback = this.props.methods.appDataCallback;
        DataHandler.PageComponentDidMount(appStateCallback, appDataCallback);
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        return (<div>
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <div className="page-component">{pageData}</div>
                </div>);
    }
}

export default AppComponent;

