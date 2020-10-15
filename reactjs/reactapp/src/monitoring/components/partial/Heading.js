import React from 'react';
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
        this.props.history.push(this.props.data.homeUrl);
    }
    render() {
        var goBackLink = <a href={this.props.data.homeUrl} onClick={this.goBack}><h6>Go Back</h6></a>;
        if (this.props.currentPageName === "home" || this.props.data.firstTimeDataLoadStatus !== "completed") {
            goBackLink = null;
        }
        return (<div className="heading-section HEADING">
                <div className="container">
                    <div className="position-absolute">{goBackLink}</div>
                    <center><h2>{this.props.data.sectionName}</h2></center>
                </div>
                <div className="container"><center><h2>{this.props.data.pageHeading}</h2></center></div>
                <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
            </div>);
    }
}

export default Heading;

