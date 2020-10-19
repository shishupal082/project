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
Template["entrybydatefilter"] = [
    {
        "tag": "div",
        "name": "entrybydatefilter.filter",
        "text": []
    },
    {
        "tag": "div",
        "name": "entrybydatefilter.entrybydate",
        "text": []
    }
];
Template["entrybydatefilter.filter"] = [
    {
        "tag": "table.tbody.tr",
        "text": [
            {
                "tag": "td",
                "text": {
                    "tag": "select",
                    "value": "",
                    "name": "selectedStation",
                    "className": "form-control",
                    "text": [
                        {
                            "tag": "option",
                            "value": "",
                            "text": "All Station"
                        }
                    ]
                }
            },
            {
                "tag": "td",
                "text": {
                    "tag": "select",
                    "value": "",
                    "name": "selectedType",
                    "className": "form-control",
                    "text": [
                        {
                            "tag": "option",
                            "value": "",
                            "text": "All Type"
                        }
                    ]
                }
            },
            {
                "tag": "td",
                "text": {
                    "tag": "select",
                    "value": "",
                    "name": "selectedDevice",
                    "className": "form-control",
                    "text": [
                        {
                            "tag": "option",
                            "value": "",
                            "text": "All Device"
                        }
                    ]
                }
            },
            {
                "tag": "td",
                "text": {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "name": "reset-filter",
                    "value": "reset-filter",
                    "text": "Reset"
                }
            }
        ]
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
        "tag": "div",
        "name": "summary.data",
        "text": []
    }
];
Template["summary.data"] = [
    {
        "tag": "div",
        "text": {
            "tag": "span",
            "className": "badge badge-primary",
            "name": "summary.data.dateHeading",
            "text": ""
        }
    },
    {
        "tag": "div",
        "name": "summary.data.table",
        "text": []
    }
];
Template["summary.data.table"] = [
    {
        "tag": "div",
        "text": {
            "tag": "table",
            "className": "table table-striped table-bordered",
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
                                    "text": "Description"
                                },
                                {
                                    "tag": "th",
                                    "text": "Count"
                                }
                            ]
                        }
                    ]
                },
                {
                    "tag": "tbody",
                    "name": "summary.data.table.tr",
                    "text": []
                }
            ]
        }
    }
];
Template["summary.data.table.tr"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "summary.data.table.tr.s.no.",
                "text": ""
            },
            {
                "tag": "td",
                "name": "summary.data.table.tr.variable",
                "text": ""
            },
            {
                "tag": "td",
                "name": "summary.data.table.tr.count",
                "text": ""
            }
        ]
    }
];
export default Template;
