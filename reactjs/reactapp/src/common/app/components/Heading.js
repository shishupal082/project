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
        if ($S.isFunction(this.props.methods.registerChildAttribute)) {
            this.props.methods.registerChildAttribute("history", this.props.history);
        }
        if ($S.isFunction(this.props.methods.pageComponentDidMount)) {
            this.props.methods.pageComponentDidMount(this.props.currentPageName);
        }
    }
    render() {
        var goBackLink = null;
        var goBackLinkData = this.props.data.goBackLinkData;
        if ($S.isArray(goBackLinkData) && goBackLinkData.length > 0) {
            goBackLink = Api.generateFields(this.props, goBackLinkData, 0);
        }
        return (<div className="HEADING">
                <div>
                    {goBackLink}
                    <center><h2>{this.props.data.appHeading}</h2></center>
                </div>
                <div><center><h2>{this.props.data.pageHeading}</h2></center></div>
            </div>);
    }
}

export default Heading;

