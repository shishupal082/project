import React from 'react';
import $S from "../../../interface/stack.js";
import Api from "../../Api";

class Heading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("Heading:componentDidMount");
        if ($S.isFunction(this.props.methods.pageComponentDidMount)) {
            this.props.methods.pageComponentDidMount(this.props.currentPageName);
        }
    }
    render() {
        var goBackLink = null, appHeading = null;
        var goBackLinkData = this.props.data.goBackLinkData;
        var appHeadingData = this.props.data.appHeading;
        if ($S.isArray(goBackLinkData) && goBackLinkData.length > 0) {
            goBackLink = Api.generateFields(this.props, goBackLinkData, 0);
        }
        if ($S.isArray(appHeadingData)) {
            appHeading = Api.generateFields(this.props, appHeadingData, 0);
        }
        return (<div className="HEADING">
                <div>
                    {goBackLink}
                    {appHeading}
                </div>
                <div><center><h2>{this.props.data.pageHeading}</h2></center></div>
            </div>);
    }
}

export default Heading;

