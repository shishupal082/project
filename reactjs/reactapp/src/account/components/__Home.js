import React from 'react';
import {Link} from 'react-router-dom';
import $S from "../../interface/stack.js";

import Errors from "./partial/Errors";
import Header from "./partial/Header";
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
        DataHandler.PageComponentMount(this.props.methods.appStateCallback,
            this.props.methods.appDataCallback, this.props.currentPageName);
    }
    render() {
        var availableLinks = this.props.data.homeFields.map(function(el, i, arr) {
            return <Link key={i} to={el.toUrl}>
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">{el.toText}</button>
            </Link>;
        });
        return (<div className="container HOME">
                    <Header data={this.props.data} methods={this.props.methods}
                            currentPageName={this.props.currentPageName} history={this.props.history}
                    />
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

