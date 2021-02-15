import Config from "./Config";

var Template = {};
Template["noMatch"] = [{
    "tag": "center.h5",
    "text": {
        "tag": "span",
        "text": {
            "tag": "a",
            "href": Config.pages.home,
            "text": "Goto Home Page"
        }
    }
}];
Template["noMatch"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "No Data Found"
    }
}];
Template["noDataFound"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "No Data Found"
    }
}];
Template["templateNotFound"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "Template not Found"
    }
}];
Template["heading"] = [{
    "tag": "center.h2",
    "name": "heading-text",
    "text": ""
}];
Template["tableField"] = [
    {
        "tag": "div",
        "text": {
            "tag": "table.tbody",
            "className": "table-striped table-padded-px-5",
            "name": "tableEntry",
            "text": []
        }
    },
    {
        "tag": "div",
        "name": "submit",
        "className": "submit-btn",
        "text": {
            "tag": "button",
            "className": "btn btn-primary",
            "name": "addentry.submit",
            "text": "Submit"
        }
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
    }
];
Template["tableRowField"] = [
    {
        "tag": "tr",
        "className": "",
        "name": "tableRowEntry",
        "text": []
    }
];
Template["tableTdField"] = [
    {
        "tag": "td",
        "name": "tdData",
        "text": ""
    }
];

Template["footerField"] = [{"tag": "div.center", "name":"footerLink", "text": []}];

export default Template;
