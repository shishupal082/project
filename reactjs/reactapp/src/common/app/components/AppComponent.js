import React from 'react';
import $S from "../../../interface/stack.js";
import Api from "../../Api";


import Heading from "./Heading";
import Errors from "./Errors";

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("AppComponent:componentDidMount");
        if ($S.isFunction(this.props.methods.registerChildAttribute)) {
            this.props.methods.registerChildAttribute("history", this.props.history);
        }
        if ($S.isFunction(this.props.methods.pageComponentDidMount)) {
            this.props.methods.pageComponentDidMount(this.props.currentPageName);
        }
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        return (<div className="container APP-COMPONENT">
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <div className="APP-COMPONENT.PAGE-DATA">{pageData}</div>
                </div>);
    }
}

export default AppComponent;

