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
        "url": "",
        "text": {
            "tag": "button",
            "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
            "name": "home.link.toText",
            "text": ""
        }
    }
];
Template["dbviewField"] = [
    {
        "tag": "div",
        "name": "tableView",
        "text": []
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
    }
];
Template["dbViewHeading1-1"] = [
    {
        "tag": "div.h4",
        "text": [
            {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "tableHeading",
                "text": ""
            },
            {
                "tag": "button",
                "className": "btn btn-primary pt-0 pb-0 ml-10px",
                "value": "reload",
                "name": "reload",
                "text": "Reload"
            }
        ]
    }
];
Template["dbViewHeading1-many"] = [
    {
        "tag": "div.h4",
        "text": [
            {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "tableHeading",
                "text": ""
            }
        ]
    }
];
Template["dbViewHeading2-many"] = [
    {
        "tag": "div.h6",
        "text": [
            {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "tableHeading",
                "text": ""
            },
            {
                "tag": "button",
                "className": "btn btn-primary pt-0 pb-0 ml-10px fs-80",
                "value": "reload",
                "name": "reload",
                "text": "Reload"
            }
        ]
    }
];
Template["dbViewHeading3-many"] = [
    {
        "tag": "div.b",
        "text": [
            {
                "tag": "span",
                "className": "badge badge-secondary",
                "name": "tableHeading",
                "text": ""
            }
        ]
    }
];
Template["tableView"] = [
    {
        "tag": "div.h4",
        "text": [
            {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "tableHeading",
                "text": ""
            },
            {
                "tag": "button",
                "className": "btn btn-primary pt-0 pb-0 ml-10px",
                "value": "reload",
                "name": "reload",
                "text": "Reload"
            }
        ]
    },
    {
        "tag": "div",
        "name": "tableData",
        "text":[]
    }
];
Template["tableData"] = [
    {
        "tag": "table.tbody",
        "className": "table-striped table-padded-px-5",
        "name": "tableData.table.tr",
        "text": []
    }
];
Template["tableDataV2"] = [
    {
        "tag": "table.tbody",
        "className": "table-bordered table-bordered-dark table-striped table-padded-px-5",
        "name": "tableData.table.tr",
        "text": []
    }
];
Template["dbviewField.tr"] = [
    {
        "tag": "tr",
        "name": "dbviewField.tr.tds",
        "text": []
    }
];
Template["dbviewSummaryField"] = [
    {
        "tag": "table.tbody",
        "className": "table table-striped table-padded-px-5",
        "name": "dbviewSummaryField",
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
                        "className": "text-center",
                        "text": "Count"
                    }
                ]
            }
        ]
    }
];
Template["dbviewSummaryField.tr"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "dbviewSummaryField.tr.s_no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dbviewSummaryField.tr.description",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dbviewSummaryField.tr.count",
                "className": "text-center",
                "text": ""
            }
        ]
    }
];
Template["footerField"] = [{"tag": "div.center", "name":"footerLink", "text": []}];
export default Template;
