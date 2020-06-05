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
        // this.fetchData();
    }
    render() {
        return (<div className="container">
                    <center><h1>{this.props.data.companyName}</h1></center>
                    <Errors data={this.props.data}/>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                <Link to={this.props.data.pages.journal}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Journal</button>
                                </Link>
                                <Link to={this.props.data.pages.journalbydate}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Journal By Date</button>
                                </Link>
                                <Link to={this.props.data.pages.ledger}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Ledger</button>
                                </Link>
                                <Link to={this.props.data.pages.currentbal}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Current Balance</button>
                                </Link>
                            </div>
                            <div className="list-group">
                                <Link to={this.props.data.pages.currentbalbydate}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Current Balance By Date</button>
                                </Link>
                                <Link to={this.props.data.pages.trail}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Trial Balance</button>
                                </Link>
                                <Link to={this.props.data.pages.summary}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Account Summary</button>
                                </Link>
                                <Link to={this.props.data.pages.accountsummarybydate}>
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Account Summary By Date</button>
                                </Link>
                            </div>
                        </div>
                    </div>
            </div>);
    }
}

export default Home;

