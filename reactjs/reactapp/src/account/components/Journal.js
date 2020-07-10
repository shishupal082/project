import React from 'react';
import Header from "./partial/Header";
import Errors from "./partial/Errors";

import Api from "../../common/Api";
// import $S from "../../interface/stack.js";

class Journal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isValidPage: false
        };
    }
    componentDidMount() {
        if (this.props.methods.isValidCurrentPage(this.props.currentPageName)) {
            this.setState({isValidPage: true});
            this.props.methods.trackPage(this.props.currentPageName);
        } else {
            this.props.methods.trackPage("noMatch");
        }
    }
    render() {
        var self = this, renderFieldRow;
        var pageHeading = this.props.heading;
        if (this.state.isValidPage) {
            renderFieldRow = this.props.renderFieldRow;
        } else {
            pageHeading = null;
            renderFieldRow = this.props.methods.getTemplate("noPageFound", []);
        }
        var JournalTableTr = renderFieldRow.map(function(el, i, arr) {
            return Api.generateFields(self.props, el);
        });
        var disp = JournalTableTr;
        if (this.state.isValidPage) {
            disp = <div className="row"><div className="col">
                        <table className="table2 table-bordered table-striped"><tbody>
                            {JournalTableTr}
                        </tbody></table>
                    </div></div>;
        }
        return (<div className="container">
                    <Header state={this.props.state} data={this.props.data} history={this.props.history}
                            heading={pageHeading} methods={this.props.methods}
                            currentPageName={this.props.currentPageName}
                    />
                    <Errors data={this.props.data}/>
                    {disp}
            </div>);
    }
}

export default Journal;

