var Template = {};
Template["pageNotFound"] = [
    {
        "tag": "center.h1",
        "text": {
            "tag": "span",
            "className": "",
            "name": "date",
            "text": "Page not found"
        }
    },
    {
        "tag": "div",
        "name": "footer",
        "text": ""
    }
];
Template["noDataFound"] = [
    {
        "tag": "center.h1",
        "text": "No data found"
    },
    {
        "tag": "div",
        "name": "footer",
        "text": ""
    }
];
Template["loading"] = [
    {
        "tag": "div.center",
        "className": "loading",
        "text": "Loading..."
    }
];
Template["dashboard"] = [
    {
        "tag": "div",
        "className": "dashboard",
        "text": [
            {
                "tag": "div",
                "className": "container",
                "text": {
                    "tag": "table.tbody.tr",
                    "className": "table",
                    "text": [
                        {
                            "tag": "td",
                            "text": {
                                "tag": "div",
                                "className": "dashboard-info-col",
                                "text": {
                                    "tag": "table.tbody",
                                    "className": "table table-striped",
                                    "name": "dashboardRow",
                                    "text": []
                                }
                            }
                        },
                        {
                            "tag": "td",
                            "className": "pdf-embed-td",
                            "text": [
                                {
                                    "tag": "div",
                                    "className": "pdf-view",
                                    "name": "dashboard.display.object.div",
                                    "text": {
                                        "tag": "object",
                                        "name": "pdfViewObject",
                                        "type": "application/pdf",
                                        "className": "pdf-embed",
                                        "data": "",
                                        "text": {
                                            "tag": "embed",
                                            "name": "pdfViewEmbed",
                                            "type": "application/pdf",
                                            "src": ""
                                        }
                                    }
                                },
                                {
                                    "tag": "div",
                                    "className": "img-view",
                                    "name": "dashboard.display.img.div",
                                    "text": {
                                        "tag": "img",
                                        "name": "dashboard.display.img",
                                        "src": "",
                                        "alt": "",
                                        "className": "display-img"
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ]
    },
    {
        "tag": "div",
        "name": "footer",
        "text": ""
    }
];
Template["dashboardOrderByOption"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "colSpan": 2,
                "name": "dashboard.orderbydropdown.td",
                "text": {
                    "tag": "div",
                    "text": {
                        "tag": "select",
                        "name": "dashboard.orderbydropdown",
                        "className": "custom-select",
                        "value": "orderByDate",
                        "text": [
                            {
                                "tag": "option",
                                "value": "orderByDate",
                                "text": "Order By Date"
                            },
                            {
                                "tag": "option",
                                "value": "orderByUsername",
                                "text": "Order By Username"
                            }
                        ]
                    }
                }
            }
        ]
    }
];
Template["dashboardRowHeading"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "colSpan": 2,
                "name": "dashboardRowHeading.heading",
                "className": "p-0",
                "text": {
                    "tag": "span",
                    "name": "rowHeading",
                    "className": "badge badge-primary",
                    "text": ""
                }
            }
        ]
    }
];
Template["dashboard1stRow"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "className": "dashboard-s-no",
                "text": "S.No."
            },
            {
                "tag": "th",
                "className": "dashboard1stRow-fileinfo",
                "text": "Fileinfo"
            }
        ]
    }
];
Template["dashboard1stRowByDate"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "className": "dashboard-s-no",
                "text": "S.No."
            },
            {
                "tag": "th",
                "className": "dashboard-orderbydate-username",
                "text": "Username"
            },
            {
                "tag": "th",
                "className": "dashboard1stRowByDate-fileinfo fileinfo-col",
                "text": "Fileinfo"
            }
        ]
    }
];
Template["dashboardRowData"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "dashboardRowData.s.no",
                "className": "dashboard-s-no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dashboardRowData.fileinfo",
                "className": "fileinfo-col",
                "text": ""
            }
        ]
    }
];
Template["dashboardRowDataByDate"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "dashboardRowDataByDate.s.no",
                "className": "dashboard-s-no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dashboardRowDataByDate.username",
                "className": "dashboardRowDataByDate-username",
                "text": ""
            },
            {
                "tag": "td",
                "className": "fileinfo-col",
                "name": "dashboardRowDataByDate.fileinfo",
                "text": ""
            }
        ]
    }
];
Template["dashboard.fileinfo"] = [
    {
        "tag": "div",
        "name": "dashboard.fileinfo.filename",
        "className": "fileinfo-col-filename",
        "text": "Filename"
    },
    {
        "tag": "div",
        "name": "dashboard.fileinfo.subject_heading",
        "text": {
            "tag": "table.tbody",
            "className": "table table-bordered mb-0",
            "text": [
                {
                    "tag": "tr",
                    "text": [
                        {
                            "tag": "td.b",
                            "className": "w-75px",
                            "text": "Subject"
                        },
                        {
                            "tag": "td",
                            "name": "dashboard.fileinfo.subject",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "tr",
                    "text": [
                        {
                            "tag": "td.b",
                            "className": "w-75px",
                            "text": "Heading"
                        },
                        {
                            "tag": "td",
                            "name": "dashboard.fileinfo.heading",
                            "text": ""
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "div",
        "text": [
            {
                "tag": "button",
                "name": "dashboard.fileinfo.view",
                "className": "btn btn-link pdf-view-link",
                "text": "View"
            },
            {
                "tag": "a",
                "href": "open file path",
                "name": "dashboard.fileinfo.open-in-new-tab",
                "isTargetBlank": true,
                "text": "Open in new tab"
            },
            {
                "tag": "span",
                "className": "p-10px"
            },
            {
                "tag": "a",
                "href": "download-link",
                "name": "dashboard.fileinfo.download",
                "text": "Download"
            },
            {
                "tag": "button",
                "name": "dashboard.fileinfo.delete",
                "className": "btn btn-link pdf-delete-link text-danger",
                "text": "Delete"
            }
        ]
    }
];
Template["heading"] = {};;
Template["link"] = {};
Template["footerLinkJson"] = {};
Template["footerLinkJsonAfterLogin"] = {};

export default Template;
