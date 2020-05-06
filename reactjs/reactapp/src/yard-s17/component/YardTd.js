import React from 'react';
import $S from '../../interface/stack';
import $M from '../../interface/model';
import YardTable from './YardTable';


var validTags = ["div", "span", "button"];

var tprClassMapping = {
    "4A-TPR": ["p-4a-r", "p-4a-n", "p-4a-c"],
    "4B-TPR": ["LL-sh-left", "p-4b-n", "p-4b-c", "p-4b-r"],
    "5A-TPR": ["p-5a-r", "p-5a-n", "p-5a-c"],
    "5B-TPR": ["p-5b-n", "p-5b-c", "p-5b-r"],
    "SDG-TPR-A": ["p-6a-c", "p-6a-n"],
    "SDG-TPR-B": ["p-6b-c", "p-6b-n"]
};

var textFilter = $S.getTextFilter();

function getTprClassName(tprClasses, tprName) {
    if (tprClassMapping[tprName]) {
        for (var i = 0; i < tprClassMapping[tprName].length; i++) {
            if (tprClasses.indexOf(tprClassMapping[tprName][i]) >= 0) {
                return tprClassMapping[tprName][i];
            }
        }
    }
    return tprName;
}

function getBtnClass(btnClass, tprName) {
    if ($M.getPossibleValues().length < 1) {
        return btnClass;
    }
    btnClass = textFilter(btnClass).removeClass("btn-warning").removeClass("btn-danger").getClassName();
    tprName = getTprClassName(btnClass.split(" "), tprName);
    if (textFilter(btnClass).contains("tpr")) {
        btnClass = textFilter(btnClass).addClass($M.getTprClass(tprName)).getClassName();
    }
    return btnClass;
}

var childGenerator = {
    "div": function(props, data, reactChildText, key) {
        return <div key={key} className={data.className}>{reactChildText}</div>;
    },
    "temp2": function(props, data, reactChildText, key) {
        return <button>{reactChildText}</button>;
    },
    "span": function(props, data, reactChildText, key) {
        var spanClassName = data.className;
        if (data && data.id && $M.getPossibleValues().length > 0) {
            // For signal class (RED, GREEN, YELLOW) and point indication (WLK)
            if (!textFilter(spanClassName).contains("alert-danger")) {
                var signalClass = $M.isUp(data.id) ? "active" : "";
                spanClassName = textFilter(spanClassName).removeClass("active").addClass(signalClass).getClassName();
            }
        }
        return <span key={key} className={spanClassName}>{reactChildText}</span>;
    },
    "temp3": function(props, data, reactChildText, key) {
        return <button>{reactChildText}</button>;
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
        var btnClassName = getBtnClass(data.className, data.value);
        return <button onClick={props.onClick} key={key} className={btnClassName} value={data.value}>{reactChildText}</button>;
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
    var tdId = props.id;
    if ($S.isArray(tdData)) {
        var tId = tdId + "-0";
        tdData = <YardTable onClick={props.onClick} yardTableContent={tdData}
                                id={tId} state={props.state}/>;
    } else if ($S.isObject(tdData)) {
        tdData = generateReactChild(props, tdData);
    }
    return (
        <td id={tdId}>{tdData}</td>
    );
}

export default YardTd;
