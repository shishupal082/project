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
        "url": "",
        "text": {
            "tag": "button",
            "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
            "name": "home.link.toText",
            "text": ""
        }
    }
];
Template["entrybydate"] = [
    {
        "tag": "div.h4",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "name": "date",
            "text": ""
        }
    },
    {
        "tag": "div",
        "name": "entrybydate.entry.table",
        "text": []
    }
];
Template["entry.table"] = [
    {
        "tag": "div",
        "text": {
            "tag": "table",
            "className": "table-bordered table-striped",
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
                    ]
                },
                {
                    "tag": "tbody",
                    "name": "entry.table.tr",
                    "text": []
                }
            ]
        }
    }
];
Template["entry.table.tr"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no.",
                "text": ""
            },
            {
                "tag": "td",
                "name": "date",
                "text": ""
            },
            {
                "tag": "td",
                "name": "stationDisplay",
                "text": ""
            },
            {
                "tag": "td",
                "name": "description",
                "text": ""
            },
            {
                "tag": "td",
                "name": "typeDisplay",
                "text": ""
            },
            {
                "tag": "td",
                "name": "deviceDisplay",
                "text": ""
            }
        ]
    }
];
Template["entrybyFieldName"] = [
    {
        "tag": "div.h4",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "name": "entrybyFieldName.fieldName",
            "text": ""
        }
    },
    {
        "tag": "div",
        "name": "entrybyFieldName.items",
        "text": []
    }
];
Template["entrybyFieldName.items"] = [
    {
        "tag": "div",
        "text": [
            {
                "tag": "div.h6",
                "text": [
                    {
                        "tag": "span",
                        "className": "badge badge-primary",
                        "name": "entrybyFieldName.items.date",
                        "text": ""
                    }
                ]
            },
            {
                "tag": "div",
                "name": "entrybyFieldName.items.entry.table",
                "text": []
            }
        ]
    }
];
Template["summary"] = [
    {
        "tag": "div.table",
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
