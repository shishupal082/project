import React from 'react';
import SelectUser from "./SelectUser";



class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.goBack = this.goBack.bind(this);
    }
    componentDidMount() {
    }
    goBack(e) {
        e.preventDefault();
        this.props.history.push(this.props.data.pages.home);
    }
    render() {
        var backIcon = <img className="back-img" src={this.props.data.backIconUrl} alt="back"/>;
        var goBackLink = <a href={this.props.data.pages.home} onClick={this.goBack}><h2>{backIcon}Back</h2></a>;
        if (this.props.currentPageName === "home") {
            goBackLink = null;
        }
        if (this.props.data.firstTimeDataLoadStatus !== "completed") {
            goBackLink = null;
        }
        return (<div className="HEADER">
                    <div className="container">
                        <div className="position-absolute">{goBackLink}</div>
                        <center><h2>{this.props.data.companyName}</h2></center>
                    </div>
                    <div className="container"><center><h2>{this.props.data.pageHeading}</h2></center></div>
                    <SelectUser data={this.props.data} methods={this.props.methods} currentPageName={this.props.currentPageName} history={this.props.history}/>
            </div>);
    }
}

export default Header;

