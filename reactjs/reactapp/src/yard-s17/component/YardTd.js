import React from 'react';
import $S from '../../libs/stack';

var validTags = ["div", "span", "button"];

var childGenerator = {
    "div": function(props, data, reactChildText, key) {
        return <div key={key} className={data.className}>{reactChildText}</div>;
    },
    "span": function(props, data, reactChildText, key) {
        return <span key={key} className={data.className}>{reactChildText}</span>;
    },
    "button": function(props, data, reactChildText, key) {
        if (reactChildText === "$$BTN_SPAN_TEXT") {
            var spanData = {
                "tag": "span",
                "className": "badge",
                "text": "\u00a0"
            };
            reactChildText = childGenerator["span"](props, spanData, spanData.text);
        }
        return <button onClick={props.onClick} key={key} className={data.className} value={data.value}>{reactChildText}</button>;
    },
    "temp": function(props, data, reactChildText, key) {
        return <button>{reactChildText}</button>;
    }
};

function generateReactChild(props, data, key) {
    var reactChild = "";
    if (validTags.indexOf(data.tag) >= 0) {
        var reactChildText = data.text;
        if ($S.isObject(reactChildText)) {
            reactChildText = generateReactChild(props, reactChildText);
        } if ($S.isArray(reactChildText)) {
            reactChildText = reactChildText.map(function(item, index, arr) {
                return generateReactChild(props, item, index);
            });
        }
        reactChild = childGenerator[data.tag](props, data, reactChildText, key);
    }
    return reactChild;
}

function YardTd(props) {
    var tdData = props.tdData;
    if ($S.isObject(tdData)) {
        if (tdData.tag) {
            if (validTags.indexOf(tdData.tag) >= 0) {
                tdData = generateReactChild(props, tdData);
            } else {
                $S.log("Invalid tag:" + tdData.tag + "::" + validTags.toString());
            }
        }
    }
    return (
        <td id={props.id}>{tdData}</td>
    );
}

export default YardTd;
