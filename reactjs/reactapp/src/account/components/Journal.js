import React from 'react';
import Api from "../../common/Api";
import Header from "./partial/Header";
// import $S from "../../interface/stack.js";

class Journal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
    }
    render() {
        var self = this;
        var JournalTableTr = this.props.data.journalRowData.map(function(el, i, arr) {
            return Api.generateFields(self.props, el);
        });
        return (<div className="container">
                    <Header data={this.props.data} heading={this.props.heading}/>
                    <div className="row">
                        <table className="table2 table-bordered table-striped"><tbody>
                            {JournalTableTr}
                        </tbody></table>
                    </div>
            </div>);
    }
}

export default Journal;

