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
        "tag": "center.h1",
        "text": {
            "tag": "span",
            "text": "App Heading"
        }
    }
];
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
Template["page1"] = [
    {
        "tag": "center.h1",
        "text": "Page 1"
    }
];
Template["page2-bcp"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "link",
                "name": "home.link.toUrl",
                "href": "/",
                "text": {
                    "tag": "button",
                    "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
                    "name": "home.link.toText",
                    "text": "Home"
                }
            },
            {
                "tag": "link",
                "name": "home.link.toUrl",
                "href": "/page-1",
                "text": {
                    "tag": "button",
                    "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
                    "name": "home.link.toText",
                    "text": "Page 1"
                }
            }
        ]
    }
];
Template["page2"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "link",
                "name": "home.link.toUrl",
                "href": "/",
                "text": "Home"
            },
            {
                "tag": "link",
                "name": "home.link.toUrl",
                "href": "/page-1",
                "text": "Page 1"
            }
        ]
    }
];
export default Template;
