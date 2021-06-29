import React from 'react';
import $S from "../../../interface/stack.js";
import SelectFilter from './SelectFilter';

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    componentDidMount() {
        $S.log("Footer:componentDidMount");
    }
    render() {
        var footerClass = "footer-div";
        var footerWithContent = "footer-wrap h-45px";
        var footerWithNoContent = "footer-wrap h-15px";
        if ($S.isBooleanTrue(this.props.data.disableFooter) || $S.isBooleanTrue(this.props.data.disableFooterV2)) {
            footerClass += " d-none";
            footerWithContent += " d-none";
        } else {
            footerWithNoContent += " d-none";
        }
        return (<div className="SELECT-FILTER-FOOTER">
                <div className={footerWithContent}></div>
                <div className={footerWithNoContent}></div>
                <div className={footerClass}><SelectFilter data={this.props.data} methods={this.props.methods} history={this.props.history} currentPageName={this.props.currentPageName}/></div>
            </div>);
    }
}

export default Footer;
