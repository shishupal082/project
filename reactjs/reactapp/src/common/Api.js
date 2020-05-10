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
        reactChild = data;
    } else if ($S.isObject(data) && validTags.indexOf(data.tag) >= 0) {
        reactChildText = data.text;
        if ($S.isObject(reactChildText)) {
            reactChildText = generateReactChild(props, reactChildText, key);
        } if ($S.isArray(reactChildText)) {
            reactChildText = reactChildText.map(function(item, index, arr) {
                return generateReactChild(props, item, index);
            });
        }
        reactChild = childGenerator[data.tag](props, data, reactChildText, key);
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
    "div": function(props, data, reactChildText, key) {
        return <div key={key} className={data.className}>{reactChildText}</div>;
    },
    "hr": function(props, data, reactChildText, key) {
        return <hr key={key} className={data.className}/>;
    },
    "br": function(props, data, reactChildText, key) {
        return <br key={key} className={data.className}/>;
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
                            id={data.id} />;
        if (data.required) {
            inputField = <input key={key} type={data.type} name={data.name}
                    placeholder={data.placeholder} className={data.className}
                    value={data.value} defaultValue={data.defaultValue}
                    id={data.id} required/>;
        }
        return inputField;
    }
};

validTags = Object.keys(childGenerator);

})($S);
export default Api;
