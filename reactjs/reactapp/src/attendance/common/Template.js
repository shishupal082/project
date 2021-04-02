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
Template["monthlyTemplate"] = [
    {
        "tag": "div",
        "name": "monthlyTemplate.data",
        "text": []
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
    }
];
Template["monthlyTemplate.data"] = [
    {
        "tag": "div",
        "text": [
            {
                "tag": "h2",
                "className": "badge badge-primary",
                "name": "monthlyTemplate.data.dateHeading",
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
        "name": "monthlyTemplate.data.table",
        "text": []
    }
];
Template["monthlyTemplate.data.table"] = [
    {
        "tag": "table.tbody",
        "className": "table-striped table-padded-px-5",
        "name": "monthlyTemplate.data.table.tr",
        "text": []
    }
];
Template["monthlyTemplate.data.table.tr"] = [
    {
        "tag": "tr",
        "name": "monthlyTemplate.data.table.tr.tds",
        "text": [
            {
                "tag": "td",
                "name": "monthlyTemplate.table.tr.s_no",
                "text": "S.No."
            },
            {
                "tag": "td",
                "name": "monthlyTemplate.table.tr.name",
                "text": "Name"
            }
        ]
    }
];
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
        "name": "footer",
        "text": []
    }
];
Template["tableRowField"] = [
    {
        "tag": "tr",
        "className": "",
        "name": "tableRowEntry",
        "text": [
            {
                "tag": "td",
                "name": "s.no.",
                "text": ""
            }
        ]
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
