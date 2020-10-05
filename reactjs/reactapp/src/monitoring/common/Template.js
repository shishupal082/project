var Template = {};
Template["noMatch"] = [{
    "tag": "center.h5",
    "text": {
        "tag": "span",
        "text": "Please Go Back"
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

Template["entry"] = [{
    "tag": "div",
    "className": "container",
    "text": [
        {
            "tag": "table",
            "className": "table-bordered table-striped",
            "text": [
                {
                    "tag": "thead.tr",
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
                            "tag": "th",
                            "text": "Station"
                        },
                        {
                            "tag": "th",
                            "text": "Description"
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
                "name": "station",
                "text": "Station"
            },
            {
                "tag": "td",
                "name": "description",
                "text": "Description"
            },
            {
                "tag": "td",
                "name": "type",
                "text": "Type"
            },
            {
                "tag": "td",
                "name": "device",
                "text": "Device"
            }
        ]
    }
];

Template["entrybydate"] = ["Entry by Date"];
Template["entrybytype"] = ["Entry by Type"];
Template["entrybystation"] = ["Entry by Station"];
Template["entrybydevice"] = ["Entry by Device"];
Template["summary"] = ["Summary"];

export default Template;
