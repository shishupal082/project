var Template = {};

Template["noMatch"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "Page Not Found"
    }
}];
Template["noDataFound"] = [
    {
        "tag": "center.h1",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "text": "No Data Found"
        }
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
    }
];
Template["templateNotFound"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "Template not Found"
    }
}];
Template["heading"] = [
    {
        "tag": "center.h2",
        "name": "heading-text",
        "text": ""
    },
    {
        "tag": "center",
        "name": "heading-link",
        "text": []
    }
];
Template["loading"] = [
    {
        "tag": "center.h2",
        "name": "loadingText",
        "text": "Loading ..."
    }
];
Template["home"] = [{
    "tag": "div",
    "text": {
        "tag": "div",
        "className": "list-group",
        "name": "home.link",
        "text": []
    }
}];
Template["home.link"] = [
    {
        "tag": "link",
        "name": "home.link.toUrl",
        "href": "",
        "text": {
            "tag": "button",
            "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
            "name": "home.link.toText",
            "text": ""
        }
    }
];
Template["home.a"] = [
    {
        "tag": "a",
        "name": "home.link.toUrl",
        "href": "",
        "text": {
            "tag": "button",
            "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
            "name": "home.link.toText",
            "text": ""
        }
    }
];
Template["footerField"] = [{"tag": "div.center", "name":"footerLink", "text": []}];
export default Template;
