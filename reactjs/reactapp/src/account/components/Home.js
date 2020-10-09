import React from 'react';
import {Link} from 'react-router-dom';
import $S from "../../interface/stack.js";
import Api from "../../common/Api";

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
        DataHandler.PageComponentMount(this.props.methods.appStateCallback,
            this.props.methods.appDataCallback, this.props.currentPageName);
        this.props.methods.addTab(this.props.currentPageName);
    }
    render() {
        var availableLinks = this.props.data.homeFields.map(function(el, i, arr) {
            return <Link key={i} to={el.toUrl}>
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">{el.toText}</button>
            </Link>;
        });
        if (this.props.data.firstTimeDataLoadStatus !== "completed") {
            availableLinks = Api.generateFields(this.props, DataHandler.getTemplate("loading", null));
        }
        return (<div className="container">
                    <center><h1>{this.props.data.companyName}</h1></center>
                    <Errors data={this.props.data}/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                {availableLinks}
                            </div>
                        </div>
                    </div>
            </div>);
    }
}

export default Home;

