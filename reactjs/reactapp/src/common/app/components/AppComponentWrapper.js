import React from 'react';
import Api from "../../Api";
import $S from "../../../interface/stack.js";

import Heading from "./Heading";
import SelectFilter from './SelectFilter';
// import Errors from "./Errors";
import PageFilter from './PageFilter';
import Footer from "./Footer";
// import PageTab from './PageTab';


class AppComponentWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("AppComponentWrapper:componentDidMount");
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        var appComponentClassName = this.props.currentPageName;
        var pageComponentClass = "PAGE-DATA";
        var addContainerClass = this.props.data.addContainerClass;
        if ($S.isString(appComponentClassName)) {
            appComponentClassName += " APP-COMPONENT";
        } else {
            appComponentClassName = "APP-COMPONENT";
        }
        if ($S.isBooleanTrue(addContainerClass)) {
            pageComponentClass += " container";
        }
        return (<div className={appComponentClassName}>
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <div className={pageComponentClass}>
                        <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                        <PageFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                        <div className="PAGE-FIELDS">{pageData}</div>
                    </div>
                    <Footer data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                </div>);
    }
}

/*

return (<div className={appComponentClassName}>
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <PageTab data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <PageFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <div className="APP-COMPONENT.PAGE-DATA">{pageData}</div>
                    <Footer data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                </div>);

*/
export default AppComponentWrapper;

