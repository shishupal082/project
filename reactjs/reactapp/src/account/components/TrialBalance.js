import React from 'react';
import Header from "./partial/Header";

import Api from "../../common/Api";

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
        var trialBalanceTr = Api.generateFields(this.props, this.props.state.trialBalanceFields);
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading} methods={this.props.methods}/>
                    <table className="table table-bordered table-striped"><tbody>{trialBalanceTr}</tbody></table>
            </div>);
    }
}

export default TrialBalance;

