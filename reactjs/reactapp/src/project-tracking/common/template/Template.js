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
Template["uploaded_files"] = [
    {
        "tag": "table.tbody",
        "name": "uploaded_files.entry",
        "className": "table-bordered table-bordered-dark table-striped table-padded-px-5",
        "text": []
    }
];
Template["uploaded_files.details.heading"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td.b",
                "text": "S.No."
            },
            {
                "tag": "td.b",
                "text": "Updated By"
            },
            {
                "tag": "td.b",
                "text": "File Details"
            }
        ]
    }
];
Template["uploaded_files.details.fileInfo"] = [
    {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s_no",
                "text": "S.No."
            },
            {
                "tag": "td",
                "name": "updatedBy",
                "text": "Uploaded By"
            },
            {
                "tag": "td",
                "name": "file_details",
                "text": ""
            }
        ]
    }
];
Template["file_details"] = {
    "tag": "div",
    "className": "file_details",
    "text": [
        {
            "tag": "div",
            "name": "subject",
            "text": ""
        },
        {
            "tag": "div",
            "name": "fileName",
            "text": ""
        },
        {
            "tag": "div",
            "name": "file-action-field",
            "text": [
                {
                    "tag": "button",
                    "className": "btn btn-link pt-1px pl-0",
                    "name": "view_file.unique_id",
                    "text": "View"
                },
                {
                    "tag": "a",
                    "isTargetBlank": true,
                    "name": "open_in_new_tab.href",
                    "href": "",
                    "text": "Open in new tab"
                },
                {
                    "tag": "span",
                    "className": "pl-10px",
                    "text": ""
                },
                {
                    "tag": "a",
                    "name": "download.href",
                    "href": "",
                    "text": "Download"
                },
                {
                    "tag": "form",
                    "name": "delete_file.form",
                    "value": "delete_file.form",
                    "className": "list-inline-item",
                    "text": {
                        "tag": "button",
                        "name": "delete_file.form.button",
                        "className": "btn btn-link pt-1px disabled",
                        "text": "Delete"
                    }
                },
            ]
        }
    ]
};
Template["goBackLink"] = [
    {
        "tag": "link",
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
            },
            {
                "tag": "div.table.tbody.tr",
                "className": "projectId-uploadFileDetails",
                "text": [
                    {
                        "tag": "td",
                        "className": "align-top",
                        "text": {
                            "tag": "div",
                            "name": "projectId.uploaded_files",
                            "text": []
                        }
                    },
                    {
                        "tag": "td",
                        "name": "projectId.upload_file",
                        "className": "align-top",
                        "text": []
                    }
                ]
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
                        "className": "pl-10px pr-10px",
                        "text": "--"
                    },
                    {
                        "tag": "span",
                        "name": "projectSupplyStatus.supplyItemName",
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
Template["displaySupplyStatus"] = [
    {
        "tag": "div",
        "name": "displaySupplyStatus.projectSupplyStatus.table",
        "text": []
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
        "tag": "link",
        "name": "link-field.url",
        "className": "list-group-item list-group-item-action list-group-item-primary text-center2",
        "href": "",
        "text": ""
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
                                "name": "supplyDiscription",
                                "text": []
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "span",
                                    "text": "Value"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "input",
                                    "className": "form-control",
                                    "name": "common-value",
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
Template["projectSupplyItems"] = [
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
                        "name": "projectSupplyItems.pName",
                        "text": ""
                    },
                    {
                        "tag": "span",
                        "className": "ml-10px badge badge-primary",
                        "text": "Supply Items"
                    }
                ]
            },
            {
                "tag": "div",
                "name": "projectSupplyItems.table",
                "text": []
            },
            {
                "tag": "div",
                "name": "projectSupplyItems.addNew",
                "text": []
            }
        ]
    }
];
Template["addNewSupplyItem"] = [
    {
        "tag": "form",
        "name": "add-supply-item",
        "value": "add-supply-item",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add Supply Item"
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
                                    "text": "Item Name"
                                }
                            },
                            {
                                "tag": "td",
                                "text": {
                                    "tag": "input",
                                    "className": "form-control w-300px",
                                    "name": "add-supply-item.name",
                                    "text": ""
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
                                        "text": "Details"
                                    }
                                ]
                            },
                            {
                                "tag": "td",
                                "text": [
                                    {
                                        "tag": "textarea",
                                        "className": "form-control",
                                        "name": "add-supply-item.details",
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
                                "colSpan": 2,
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
