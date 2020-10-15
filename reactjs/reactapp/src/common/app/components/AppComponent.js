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
        if ($S.isFunction(this.props.methods.registerChildMethod)) {
            this.props.methods.registerChildMethod("history", this.props.history);
        }
        $S.log("AppComponent:componentDidMount");
        this.props.methods.pageComponentDidMount(this.props.currentPageName);
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        return (<div className="APP-COMPONENT">
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    {pageData}
                </div>);
    }
}

export default AppComponent;

