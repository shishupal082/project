import React from 'react';
import Api from "../../Api";


import Heading from "./Heading";
import SelectFilter from './SelectFilter';
import Errors from "./Errors";
import PageFilter from './PageFilter';
import Footer from "./Footer";
import PageTab from './PageTab';


class AppComponentWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        return (<div className="container APP-COMPONENT">
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <PageTab data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <PageFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <div className="APP-COMPONENT.PAGE-DATA">{pageData}</div>
                    <Footer data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                </div>);
    }
}

export default AppComponentWrapper;

