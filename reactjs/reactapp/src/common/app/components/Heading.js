import React from 'react';
import Api from "../../Api";
import SelectFilter from './SelectFilter';

class Heading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount() {}
    goBack(e) {
        e.preventDefault();
        this.props.methods.goBack(e);
    }
    render() {
        var goBackLink = null;
        if (this.props.data.goBackLinkData.length > 0) {
            goBackLink = Api.generateFields(this.props, this.props.data.goBackLinkData, 0);
        }
        return (<div className="HEADING">
                <div className="container">
                    {goBackLink}
                    <center><h2>{this.props.data.appHeading}</h2></center>
                </div>
                <div className="container"><center><h2>{this.props.data.pageHeading}</h2></center></div>
                <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
            </div>);
    }
}

export default Heading;

