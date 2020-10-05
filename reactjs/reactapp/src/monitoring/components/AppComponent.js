import React from 'react';
// import {Link} from 'react-router-dom';
import $S from "../../interface/stack.js";
import Heading from "./partial/Heading";
import Errors from "./partial/Errors";
import PageComponent from "./partial/PageComponent";

// import DataHandler from "../common/DataHandler";

class AppComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("AppComponent:componentDidMount");
        // DataHandler.setData("currentPageHeading", DataHandler.getPageHeadingV2(this.props.currentPageName));
        // this.props.methods.trackPage(this.props.currentPageName);
    }
    render() {
        return (<div>
                    <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                    <Errors data={this.props.data}/>
                    <PageComponent state={this.props.state} data={this.props.data}
                        methods={this.props.methods} currentPageName={this.props.currentPageName}
                        renderFieldRow={this.props.renderFieldRow}
                    />
                </div>);
    }
}

export default AppComponent;

