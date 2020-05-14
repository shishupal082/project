import React from 'react';
import $S from '../interface/stack.js';
var Api
(function($S) {
Api = function(config) {
    return new Api.fn.init(config);
};
Api.fn = Api.prototype = {
    constructor: Api,
    init: function(config) {
        this.config = config;
        return this;
    }
};

$S.extendObject(Api);

var validTags = [];
var childGenerator = {};

function generateReactChild(props, data, key) {
    var reactChild = "", reactChildText = "";
    if ($S.isString(data)) {
        return data;
    }
    if ($S.isObject(data)) {
        if ($S.isString(data.tag) && data.tag.length > 0) {
            var tags = data.tag.split(".");
            for (var i = tags.length-1; i > 0; i--) {
                data.text = {
                    "tag": tags[i],
                    "text": data.text
                };
            }
            data.tag = tags[0];
        }
        if (validTags.indexOf(data.tag) >= 0) {
            reactChildText = data.text;
            if ($S.isObject(reactChildText)) {
                reactChildText = generateReactChild(props, reactChildText, key);
            } if ($S.isArray(reactChildText)) {
                reactChildText = reactChildText.map(function(item, index, arr) {
                    return generateReactChild(props, item, index);
                });
            }
            reactChild = childGenerator[data.tag](props, data, reactChildText, key);
        } else if ($S.isString(data.text)) {
            reactChild = data.text;
        } else {
            console.log("Invalid tag: " + JSON.stringify(data));
        }
    }
    return reactChild;
}

var ajaxApiCall = function(ajax, callBack) {
        fetch(ajax.url)
            .then(res => res.json())
            .then(
                (result) => {
                    if ($S.isFunction(callBack)) {
                        callBack(ajax, "SUCCESS", result);
                    }
                },
                (error) => {
                    if ($S.isFunction(callBack)) {
                        callBack(ajax, "FAILURE", null);
                    }
                }
            );
};
Api.extend({
    getAjaxApiCallMethod: function() {
        return ajaxApiCall;
    },
    getSpace: function(count) {
        var str = "\u00a0";
        if ($S.isNumber(count) && count > 0) {
            for (var i = 1; i < count; i++) {
                str += "\u00a0";
            }
        }
        return str;
    },
    generateFields: function(props, fieldItems) {
        var fields = "";
        if ($S.isArray(fieldItems)) {
            fields = fieldItems.map(function(item, index, arr) {
                return generateReactChild(props, item, index);
            });
        } else if ($S.isObject(fieldItems)) {
            fields = generateReactChild(props, fieldItems);
        } else if ($S.isString(fieldItems)) {
            fields = fieldItems;
        }
        return fields;
    }
});

childGenerator = {
    "b": function(props, data, reactChildText, key) {
        return <b key={key} className={data.className}>{reactChildText}</b>;
    },
    "p": function(props, data, reactChildText, key) {
        return <p key={key} className={data.className}>{reactChildText}</p>;
    },
    "h6": function(props, data, reactChildText, key) {
        return <h6 key={key} className={data.className}>{reactChildText}</h6>;
    },
    "div": function(props, data, reactChildText, key) {
        return <div key={key} className={data.className}>{reactChildText}</div>;
    },
    "table": function(props, data, reactChildText, key) {
        return <table key={key} id={data.id} className={data.className}>{reactChildText}</table>;
    },
    "tbody": function(props, data, reactChildText, key) {
        return <tbody key={key}>{reactChildText}</tbody>;
    },
    "tr": function(props, data, reactChildText, key) {
        return <tr key={key} id={data.id} className={data.className}>{reactChildText}</tr>;
    },
    "td": function(props, data, reactChildText, key) {
        return <td key={key} id={data.id} rowSpan={data.rowSpan} colSpan={data.colSpan} className={data.className}>{reactChildText}</td>;
    },
    "hr": function(props, data, reactChildText, key) {
        return <hr key={key} className={data.className}/>;
    },
    "br": function(props, data, reactChildText, key) {
        return <br key={key} className={data.className}/>;
    },
    "img": function(props, data, reactChildText, key) {
        return <img src={data.src} alt={data.alt} className={data.className}/>;
    },
    "ol": function(props, data, reactChildText, key) {
        return <ol key={key} type={data.type} className={data.className}>{reactChildText}</ol>;
    },
    "li": function(props, data, reactChildText, key) {
        return <li key={key} className={data.className}>{reactChildText}</li>;
    },
    "span": function(props, data, reactChildText, key) {
        return <span key={key} className={data.className}>{reactChildText}</span>;
    },
    "label": function(props, data, reactChildText, key) {
        return <label htmlFor={data.htmlFor} key={key} className={data.className}>{reactChildText}</label>;
    },
    "button": function(props, data, reactChildText, key) {
        var btnClassName = data.className;
        return <button onClick={props.onClick} name={data.name} className={btnClassName} key={key} value={data.value}>{reactChildText}</button>;
    },
    "input": function(props, data, reactChildText, key) {
        var inputField = <input key={key} type={data.type} name={data.name}
                            placeholder={data.placeholder} className={data.className}
                            value={data.value} defaultValue={data.defaultValue}
                            id={data.id} onChange={props.onChange} />;
        if (data.required) {
            inputField = <input key={key} type={data.type} name={data.name}
                    placeholder={data.placeholder} className={data.className}
                    value={data.value} defaultValue={data.defaultValue}
                    id={data.id} onChange={props.onChange} required/>;
        }
        return inputField;
    }
};

validTags = Object.keys(childGenerator);

})($S);
export default Api;
