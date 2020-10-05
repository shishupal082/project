import React from 'react';
// import DataHandler from "../../common/DataHandler";

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
        var goBackLink = null;
        if (this.props.currentPageName !== "home") {
            goBackLink = <a href={this.props.data.homeUrl} onClick={this.goBack}><h6>Go Back</h6></a>;
        }
        return (<div className="heading">
                <div className="container">
                    <div className="position-absolute">{goBackLink}</div>
                    <center><h1>{this.props.data.sectionName}</h1></center>
                </div>
                <div><center><h3>{pageHeading}</h3></center></div>
            </div>);
    }
}

export default Heading;

