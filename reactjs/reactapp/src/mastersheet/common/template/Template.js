var Template = {};

Template["noMatch"] = [
    {
        "tag": "center.h1",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "text": "Page Not Found"
        }
    },
    {
        "tag": "center",
        "text": {
            "tag": "a",
            "href": "/",
            "text": "Go To Home"
        }
    }
];
Template["noDataFound"] = [
    {
        "tag": "center.h1",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "text": "No Data Found"
        }
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
Template["invalidPageType"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "badge badge-primary",
        "text": "Invalid pageType"
    }
}];
Template["loading"] = [
    {
        "tag": "center.h2",
        "name": "loadingText",
        "text": "Loading..."
    }
];
Template["invalid-data"] = [
    {
        "tag": "center.h2",
        "name": "invalid-data.text",
        "text": ""
    },
    {
        "tag": "center",
        "text": {
            "tag": "a",
            "href": "/",
            "text": "Go To Home"
        }
    }
];
Template["home"] = [
    {
        "tag": "div",
        "name": "home.template",
        "text": [
            {
                "tag": "div",
                "className": "list-group",
                "name": "home.link",
                "text": []
            }
        ]
    }
];
Template["link-field"] = [
    {
        "tag": "link",
        "name": "link-field.url",
        "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
        "href": "",
        "text": ""
    }
];
Template["viewPage"] = [
    {
        "tag": "div",
        "name": "viewPage.field",
        "text": []
    }
];
export default Template;
