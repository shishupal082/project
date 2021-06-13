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
    }
    render() {
        var goBackLink = null, appHeading = null;
        var goBackLinkData = this.props.data.goBackLinkData;
        var appHeadingData = this.props.data.appHeading;
        var pageHeading = this.props.data.pageHeading;
        if ($S.isArray(goBackLinkData) && goBackLinkData.length > 0) {
            goBackLink = Api.generateFields(this.props, goBackLinkData, 0);
        }
        if ($S.isArray(appHeadingData)) {
            appHeading = Api.generateFields(this.props, appHeadingData, 0);
        }
        if ($S.isString(pageHeading) && pageHeading.length > 0) {
            pageHeading = <div><center><h2>{pageHeading}</h2></center></div>;
        } else {
            pageHeading = null;
        }
        return (<div className="HEADING">
                <div>
                    {goBackLink}
                    {appHeading}
                </div>
                {pageHeading}
            </div>);
    }
}

export default Heading;

