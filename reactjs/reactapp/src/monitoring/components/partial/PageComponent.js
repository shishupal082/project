import React from 'react';
import $S from "../../../interface/stack.js";
import DataHandler from "../../common/DataHandler";
import Api from "../../../common/Api";


class PageComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("PageComponent:componentDidMount");
        DataHandler.setData("currentPageName", this.props.currentPageName);
        var appStateCallback = this.props.methods.appStateCallback;
        var appDataCallback = this.props.methods.appDataCallback;
        DataHandler.PageComponentDidMount(appStateCallback, appDataCallback);
    }
    render() {
        var pageData = Api.generateFields(this.props, this.props.renderFieldRow, 0);
        return (<div className="page-component">{pageData}</div>);
    }
}

export default PageComponent;

