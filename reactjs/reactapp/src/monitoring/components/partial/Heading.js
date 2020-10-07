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
        var pageHeading = this.props.data.pageHeading;
        var goBackLink = null, selectFilter = null;
        if (this.props.currentPageName !== "home") {
            goBackLink = <a href={this.props.data.homeUrl} onClick={this.goBack}><h6>Go Back</h6></a>;
            selectFilter = <SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>;
        }
        return (<div className="heading">
                <div className="container">
                    <div className="position-absolute">{goBackLink}</div>
                    <center><h1>{this.props.data.sectionName}</h1></center>
                </div>
                <div><center><h3>{pageHeading}</h3></center></div>
                {selectFilter}
            </div>);
    }
}

export default Heading;

