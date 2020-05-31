import React from 'react';
import $S from "../../../interface/stack.js";


class Errors extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        };
    }
    render() {
        var errors = this.props.data.errorsData.map(function(el, i, arr) {
            var alertComponent;
            if ($S.isString(el) || $S.isNumeric(el)) {
                alertComponent = <div key={i} className="alert alert-danger" role="alert">{el}</div>
            } else if ($S.isObject(el) && $S.isString(el.href)) {
                alertComponent = <div key={i} className="alert alert-danger" role="alert">
                  Erorr in <a href={el.href} className="alert-link">{el.text}</a></div>
            } else if ($S.isObject(el) && $S.isString(el.code)) {
                alertComponent = <div key={i} className="alert alert-danger" role="alert">
                  <code>{el.code}</code></div>
            } else {
                alertComponent = <div key={i} className="alert alert-danger" role="alert">Unknown error</div>
            }
            return alertComponent;
        });
        return (errors);
    }
}

export default Errors;
