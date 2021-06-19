import React from 'react';
import {Link} from 'react-router-dom';

import $S from "../../interface/stack.js";

class Page1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("Page1:componentDidMount");
    }
    render() {
        return (<div className="container">
            <center>
                <div><h1>Page 1 Heading: {this.props.heading}</h1></div>
            </center>
            <div><Link to="/">Go to Home</Link></div>
            <div><Link to="/page-1">
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Page-1</button>
            </Link></div>
            <div><Link to="/page-2">
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Page-2</button>
            </Link></div>
            <div><Link to="/page-3">
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Page-3</button>
            </Link></div>
            <div><Link to="/page-4">
                <button className="list-group-item list-group-item-action list-group-item-primary text-center2">Page-4</button>
            </Link></div>
        </div>);
    }
}

export default Page1;

