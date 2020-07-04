import React from 'react';
import {Link} from 'react-router-dom';
import Errors from "./partial/Errors";


class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        this.props.methods.trackPage(this.props.currentPageName);
    }
    render() {
        var availableLinks = this.props.renderFieldRow.map(function(el, i, arr) {
            return <Link key={i} to={el.toUrl}>
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">{el.toText}</button>
            </Link>;
        });
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

