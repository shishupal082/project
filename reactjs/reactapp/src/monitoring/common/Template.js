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

Template["home"] = [{
    "tag": "div",
    "className": "container",
    "text": {
        "tag": "div",
        "className": "list-group",
        "name": "home.link",
        "text": []
    }
}];
Template["homeLink"] = [
    {
        "tag": "link",
        "name": "homeLink.toUrl",
        "url": "",
        "text": {
            "tag": "button",
            "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
            "name": "homeLink.toText",
            "text": ""
        }
    }
];
Template["entry"] = [{
    "tag": "div",
    "className": "container",
    "text": [
        {
            "tag": "table",
            "className": "table-bordered table-striped",
            "text": [
                {
                    "tag": "thead",
                    "name": "entry.data.firstRow",
                    "text": []
                },
                {
                    "tag": "tbody",
                    "name": "entry.data",
                    "text": []
                }
            ]
        }
    ]
}];

Template["entrybydate"] = [
    {
        "tag": "div.h1",
        "className": "container",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "name": "date",
            "text": ""
        }
    },
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "table",
                "className": "table-bordered table-striped",
                "text": [
                    {
                        "tag": "thead",
                        "name": "entrybydate.data.firstRow",
                        "text": []
                    },
                    {
                        "tag": "tbody",
                        "name": "entrybydate.data",
                        "text": []
                    }
                ]
            }
        ]
    }
];
Template["entry.data.firstRow"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "text": "S.No."
            },
            {
                "tag": "th",
                "text": "Date"
            },
            {
                "tag": "th.span",
                "text": "Station"
            },
            {
                "tag": "th",
                "text": [
                    {
                        "tag": "span",
                        "text": "Description"
                    },
                    {
                        "tag": "span",
                        "className": "pr-10px"
                    },
                    {
                        "tag": "button",
                        "className": "btn btn-primary pt-0 pb-0",
                        "value": "reload",
                        "text": "Reload"
                    }
                ]
            },
            {
                "tag": "th",
                "text": "Type"
            },
            {
                "tag": "th",
                "text": "Device"
            }
        ]
    }
];
Template["entry.data"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no.",
                "text": "S.No."
            },
            {
                "tag": "td",
                "name": "date",
                "text": "Date"
            },
            {
                "tag": "td",
                "name": "displayStation",
                "text": "Station"
            },
            {
                "tag": "td",
                "name": "description",
                "text": "Description"
            },
            {
                "tag": "td",
                "name": "displayType",
                "text": "Type"
            },
            {
                "tag": "td",
                "name": "displayDevice",
                "text": "Device"
            }
        ]
    }
];

Template["entrybytype"] = [{"tag": "center", "text": "Entry by Type"}];
Template["entrybystation"] = [{"tag": "center", "text": "Entry by Station"}];
Template["entrybydevice"] = [{"tag": "center", "text": "Entry by Device"}];
Template["summary"] = [
    {
        "tag": "div.table",
        "className": "container",
        "text": [
            {
                "tag": "thead",
                "text": [
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "th",
                                "text": "S.No."
                            },
                            {
                                "tag": "th",
                                "name": "summary.variable",
                                "text": "Variable"
                            },
                            {
                                "tag": "th",
                                "name": "summary.count",
                                "text": "Count"
                            }
                        ]
                    }
                ]
            }
        ]
    }
];

export default Template;
