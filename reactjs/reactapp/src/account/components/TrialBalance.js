import React from 'react';
import Header from "./partial/Header";

class TrialBalance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var trialBalance = null;
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    {trialBalance}
            </div>);
    }
}

export default TrialBalance;

