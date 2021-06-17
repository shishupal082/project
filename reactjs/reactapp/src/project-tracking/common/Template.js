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
    },
    {
        "tag": "hr"
    }
];
Template["loading"] = [
    {
        "tag": "center.h2",
        "name": "loadingText",
        "text": "Loading ..."
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
Template["goBackLink"] = [
    {
        "tag": "a",
        "name": "goBackLink.a",
        "href": "",
        "text": {
            "tag": "img",
            "name": "goBackLink.img",
            "className": "go-back-link-img pl-10px pr-10px",
            "src": "/assets/static/img/svg/left-arrow.svg",
            "alt": "Back"
        }
    }
];
Template["projectId"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "div.h4",
                "text": [
                    {
                        "tag": "span",
                        "name": "goBackLink",
                        "text": []
                    },
                    {
                        "tag": "span",
                        "name": "projectId.pName",
                        "text": ""
                    }
                ]
            },
            {
                "tag": "div",
                "name": "projectId.sub-link",
                "text": []
            }
        ]
    }
];
Template["projectWorkStatus"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "div.h6",
                "text": [
                    {
                        "tag": "span",
                        "name": "goBackLink",
                        "text": []
                    },
                    {
                        "tag": "span",
                        "name": "projectWorkStatus.pName",
                        "text": ""
                    },
                    {
                        "tag": "span",
                        "className": "ml-10px badge badge-primary",
                        "text": "Work Progress"
                    }
                ]
            },
            {
                "tag": "div",
                "name": "projectWorkStatus.statusTable",
                "text": []
            },
            {
                "tag": "div",
                "name": "projectWorkStatus.addNew",
                "text": []
            }
        ]
    }
];
Template["projectSupplyStatus"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "div.h6",
                "text": [
                    {
                        "tag": "span",
                        "name": "goBackLink",
                        "text": []
                    },
                    {
                        "tag": "span",
                        "name": "projectSupplyStatus.pName",
                        "text": ""
                    },
                    {
                        "tag": "span",
                        "className": "ml-10px badge badge-primary",
                        "text": "Supply Status"
                    }
                ]
            },
            {
                "tag": "div",
                "name": "projectSupplyStatus.statusTable",
                "text": []
            },
            {
                "tag": "div",
                "name": "projectSupplyStatus.addNew",
                "text": []
            }
        ]
    }
];
Template["home"] = [
    {
        "tag": "div",
        "className": "container",
        "text": [
            {
                "tag": "div",
                "className": "list-group",
                "name": "home.link",
                "text": []
            },
            {
                "tag": "div",
                "name": "home.addNewProject",
                "text": []
            }
        ]
    }
];
Template["link-field"] = [
    {
        "tag": "a",
        "name": "link-field.url",
        "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
        "href": "",
        "text": ""
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
    },
    {
        "tag": "div",
        "name": "footer",
        "text": []
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
Template["home.addNewProject"] = [
    {
        "tag": "form",
        "name": "new-project",
        "value": "new-project",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add New Project"
                }
            },
            {
                "tag": "div",
                "text": [
                    {
                        "tag": "span",
                        "text": "Project Name"
                    },
                    {
                        "tag": "input",
                        "className": "form-control",
                        "name": "new-project.name",
                        "value": ""
                    },
                    {
                        "tag": "button",
                        "name": "addentry.submitStatus",
                        "className": "btn btn-primary form-control",
                        "text": "Save"
                    }
                ]

            }
        ]
    }
];
Template["newWorkStatus"] = [
    {
        "tag": "form",
        "name": "new-work-status",
        "value": "new-work-status",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add Work Status"
                }
            },
            {
                "tag": "div.table.tbody",
                "text": [
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Date"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "input",
                                    "className": "form-control",
                                    "name": "date-entry-key",
                                    "value": ""
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Distance"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "input",
                                    "className": "form-control",
                                    "name": "new-work-status.distance",
                                    "value": ""
                                }
                            }
                        ]
                    },
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Section"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "dropdown",
                                    "className": "form-control",
                                    "name": "new-work-status.section",
                                    "text": [
                                        {
                                            "value": "",
                                            "text": "Select section..."
                                        },
                                        {
                                            "value": "MURI-CNI",
                                            "text": "MURI-CNI"
                                        },
                                        {
                                            "value": "HTE-BRGA",
                                            "text": "HTE-BRGA"
                                        },
                                        {
                                            "value": "Others",
                                            "text": "Others"
                                        }
                                    ]
                                }
                            },
                            {
                                "tag": "td",
                                "text": [
                                    {
                                        "tag": "span",
                                        "text": "Remarks"
                                    }
                                ]
                            },
                            {
                                "tag": "td",
                                "text": [
                                    {
                                        "tag": "textarea",
                                        "className": "form-control",
                                        "name": "remark-entry-key",
                                        "value": ""
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "colSpan": 4,
                                "className": "text-center",
                                "text": [
                                    {
                                        "tag": "button",
                                        "name": "addentry.submitStatus",
                                        "className": "btn btn-primary form-control",
                                        "text": "Save"
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        ]
    }
];
Template["addSupplyStatus"] = [
    {
        "tag": "form",
        "name": "add-supply-status",
        "value": "add-supply-status",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add Supply Status"
                }
            },
            {
                "tag": "div.table.tbody",
                "text": [
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Discription"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "dropdown",
                                    "className": "form-control",
                                    "name": "supplyDiscription",
                                    "text": []
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Date"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "input",
                                    "className": "form-control",
                                    "name": "date-entry-key",
                                    "value": ""
                                }
                            }
                        ]
                    },
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "text": [
                                    {
                                        "tag": "span",
                                        "text": "Remarks"
                                    }
                                ]
                            },
                            {
                                "tag": "td",
                                "colSpan": 3,
                                "text": [
                                    {
                                        "tag": "textarea",
                                        "className": "form-control",
                                        "name": "remark-entry-key",
                                        "value": ""
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "tag": "tr",
                        "text": [
                            {
                                "tag": "td",
                                "colSpan": 4,
                                "className": "text-center",
                                "text": [
                                    {
                                        "tag": "button",
                                        "name": "addentry.submitStatus",
                                        "className": "btn btn-primary form-control",
                                        "text": "Save"
                                    }
                                ]
                            }
                        ]
                    }
                ]

            }
        ]
    }
];
Template["footerField"] = [{"tag": "div.center", "name":"footerLink", "text": []}];
export default Template;
