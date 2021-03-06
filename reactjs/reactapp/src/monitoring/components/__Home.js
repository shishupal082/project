import React from 'react';
import {Link} from 'react-router-dom';
import $S from "../../interface/stack.js";
import Heading from "./partial/Heading";
import Errors from "./partial/Errors";

import DataHandler from "../common/DataHandler";

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("Home:componentDidMount");
        this.props.methods.addTab(this.props.currentPageName);
        var appStateCallback = this.props.methods.appStateCallback;
        var appDataCallback = this.props.methods.appDataCallback;
        DataHandler.PageComponentDidMount(appStateCallback, appDataCallback, this.props.currentPageName);
    }
    render() {
        var availableLinks = this.props.homeFields.map(function(el, i, arr) {
            return <Link key={i} to={el.toUrl}>
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">{el.toText}</button>
            </Link>;
        });
        return (<div className="HOME">
                <Heading data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/>
                <Errors data={this.props.data}/>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                {availableLinks}
                            </div>
                        </div>
                    </div>
            </div></div>);
    }
}

export default Home;

