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
Template["addFieldReport"] = [
    {
        "tag": "div.div",
        "className": "form-div",
        "text": {
            "tag": "form",
            "id": "addentry_form",
            "name": "add_field_report",
            "value": "add_field_report",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "name": "addFieldReport.form-heading",
                    "text": "Add Entry"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "div",
                            "className": "d-none",
                            "name": "addFieldReport.dateTime",
                            "text": [
                                {
                                    "tag": "label",
                                    "name": "addFieldReport.subject-text",
                                    "text": [
                                        {
                                            "tag": "span",
                                            "text": "Date Time"
                                        },
                                        {
                                            "tag": "span",
                                            "className": "small",
                                            "text": "  (YYYY-MM-DD hh:mm)"
                                        }
                                    ]
                                },
                                {
                                    "tag": "input",
                                    "className": "form-control",
                                    "name": "addFieldReport.dateTime.field",
                                    "value": ""
                                }
                            ]
                        },
                        {
                            "tag": "div",
                            "className": "",
                            "text": [
                                {
                                    "tag": "label",
                                    "name": "addFieldReport.station-text",
                                    "text": "Station"
                                },
                                {
                                    "tag": "dropdown",
                                    "className": "form-control",
                                    "name": "addFieldReport.station",
                                    "text": [
                                        {
                                            "text": "Select station...",
                                            "value": ""
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "tag": "div",
                            "className": "",
                            "text": [
                                {
                                    "tag": "label",
                                    "name": "addFieldReport.device-text",
                                    "text": "Device"
                                },
                                {
                                    "tag": "dropdown",
                                    "className": "form-control",
                                    "name": "addFieldReport.device",
                                    "text": [
                                        {
                                            "text": "Select device...",
                                            "value": ""
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "tag": "div",
                            "name": "addFieldReport.userId",
                            "className": "d-none",
                            "text": [
                                {
                                    "tag": "label",
                                    "name": "addFieldReport.userId-text",
                                    "text": "UserId"
                                },
                                {
                                    "tag": "dropdown",
                                    "className": "form-control",
                                    "name": "addFieldReport.userId.field",
                                    "text": [
                                        {
                                            "text": "Select user...",
                                            "value": ""
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "name": "addFieldReport.addentry-field",
                    "text": [
                        {
                            "tag": "div",
                            "text": [
                                {
                                    "tag": "label",
                                    "text": "Comment"
                                },
                                {
                                    "tag": "textarea",
                                    "className": "w-100",
                                    "name": "addFieldReport.comment",
                                    "rows": "3",
                                    "id": "comment"
                                },
                                {
                                    "tag": "div.span",
                                    "name": "addFieldReport.comment.message",
                                    "className": "small",
                                    "text": ""
                                }
                            ]
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "button",
                            "className": "btn btn-primary",
                            "name": "addFieldReport.submit",
                            "text": "Submit"
                        },
                        {
                            "tag": "span",
                            "className": "pl-10px text-success",
                            "name": "addFieldReport.complete-status",
                            "text": ""
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
    }
];
Template["footerField"] = [{"tag": "div.center", "name":"footerLink", "text": []}];
export default Template;
