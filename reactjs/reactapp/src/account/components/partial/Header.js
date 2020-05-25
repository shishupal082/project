import React from 'react';
import {Link} from 'react-router-dom';
import SelectUser from "./SelectUser";
// import $S from "../../interface/stack.js";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var backIcon = <img className="back-img" src={this.props.data.backIconUrl} alt="back"/>;
        var companyName = this.props.data.companyName;
        return (<div>
                    <div className="row"><div className="col-md-4 col-sm-4"><Link to={this.props.data.pages.home}><h2 className="d-inline-block">{backIcon}Go Back</h2></Link></div>
                    <div className="col-md-7 col-sm-7"><h2>{companyName}</h2></div></div>
                    <div className="row"><div className="offset-md-4 offset-sm-4 col-md-7 col-sm-7"><h2>{this.props.heading}</h2></div></div>
                    <SelectUser data={this.props.data} methods={this.props.methods}/>
            </div>);
    }
}

export default Header;

