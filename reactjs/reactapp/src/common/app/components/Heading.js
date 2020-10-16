import React from 'react';
import $S from "../../../interface/stack.js";
import Api from "../../Api";
import SelectFilter from './SelectFilter';

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
        var goBackLink = null;
        if (this.props.data.goBackLinkData.length > 0) {
            goBackLink = Api.generateFields(this.props, this.props.data.goBackLinkData, 0);
        }
        return (<div className="HEADING">
                <div>
                    {goBackLink}
                    <center><h2>{this.props.data.appHeading}</h2></center>
                </div>
                <div><center><h2>{this.props.data.pageHeading}</h2></center></div>
                <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
            </div>);
    }
}

export default Heading;

