import React from 'react';
import Header from "./partial/Header";
// import $S from "../../interface/stack.js";

class LedgerBook extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        // var self = this;
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
            </div>);
    }
}

export default LedgerBook;

