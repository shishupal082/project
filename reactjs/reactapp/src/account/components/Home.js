import React from 'react';
import {Link} from 'react-router-dom';
// import $S from "../../interface/stack.js";

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
                    <center><h1>Account Application</h1></center>
                    <div className="row">
                        <div className="col-md-12">
                            <div className="list-group">
                                <Link to="/journal">
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center">Journal</button>
                                </Link>
                                <Link to="/ledger">
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center">Ledger</button>
                                </Link>
                                <Link to="/trial">
                                    <button className="list-group-item list-group-item-action list-group-item-primary text-center">Trial Balance</button>
                                </Link>
                            </div>
                        </div>
                    </div>
            </div>);
    }
}

export default Home;

