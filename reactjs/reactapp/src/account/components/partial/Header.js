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
                    <div className="text-center">
                        <div className="position-absolute"><Link to={this.props.data.pages.home}><h2>{backIcon}Go Back</h2></Link></div>
                        <div><h2>{companyName}</h2></div>
                    </div>
                    <div className="text-center"><div><h2>{this.props.heading}</h2></div></div>
                    <SelectUser data={this.props.data} methods={this.props.methods}/>
            </div>);
    }
}

export default Header;

