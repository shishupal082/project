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
        var self = this;
        var backIcon = <img className="back-img" src={this.props.data.backIconUrl} alt="back"/>;
        var companyName = this.props.data.companyName;
        var goBackLink = <a href={this.props.data.pages.home} onClick={this.goBack}><h2>{backIcon}Back</h2></a>;
        var pageTab = this.props.state.pageTracking.map(function(el, i, arr) {
            return <span className="badge badge-primary" key={i}>{i}:{el}:{self.props.data.trackPageInfo[el]}</span>;
        });
        return (<div>
                    <div className="text-center">
                        <div className="position-absolute">{goBackLink}</div>
                        <div><h2>{companyName}</h2></div>
                    </div>
                    <div className="text-center"><div><h2>{this.props.heading}</h2></div></div>
                    <SelectUser data={this.props.data} methods={this.props.methods} currentPageName={this.props.currentPageName} history={this.props.history}/>
                    <div>{pageTab}</div>
            </div>);
    }
}

export default Header;

