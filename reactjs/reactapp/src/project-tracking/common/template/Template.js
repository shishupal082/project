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
Template["loading"] = [
    {
        "tag": "center.h2",
        "name": "loadingText",
        "text": "Loading..."
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
Template["file_details"] = {
    "tag": "div",
    "className": "file_details",
    "text": [
        {
            "tag": "div",
            "text": {
                "tag": "b",
                "name": "subject",
                "text": ""
            }
        },
        {
            "tag": "div",
            "name": "heading",
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
                }
            ]
        }
    ]
};
Template["file_details_as_comment_or_link"] = {
    "tag": "div",
    "className": "file_details",
    "text": [
        {
            "tag": "div",
            "text": {
                "tag": "b",
                "name": "subject",
                "text": ""
            }
        },
        {
            "tag": "div",
            "name": "heading",
            "text": ""
        },
        {
            "tag": "div",
            "className": "d-none",
            "name": "file-action-field",
            "text": [
                {
                    "tag": "a",
                    "isTargetBlank": true,
                    "name": "open_in_new_tab.href",
                    "href": "",
                    "text": "Open Link in new tab"
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
                }
            ]
        }
    ]
};
Template["deleteFileTemplate"] = [
    {
        "tag": "form",
        "name": "delete_file.form",
        "value": "delete_file.form",
        "className": "list-inline-item",
        "text": {
            "tag": "button",
            "name": "delete_file.form.button",
            "className": "btn btn-link pt-1px disabled",
            "text": "Remove"
        }
    }
];
Template["addCommentProjectTemplate"] = [
    {
        "tag": "form",
        "name": "add-project-comment-form",
        "value": "add-project-comment-form",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add Project Comment"
                }
            },
            {
                "tag": "div",
                "text": [
                    {
                        "tag": "span",
                        "text": "Comment"
                    },
                    {
                        "tag": "textarea",
                        "className": "form-control",
                        "name": "add-project-comment-form.comment",
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
Template["addProjectFilesTemplate"] = [
    {
        "tag": "form",
        "name": "add-project-files-form",
        "value": "add-project-files-form",
        "text": [
            {
                "tag": "div",
                "text": {
                    "tag": "span",
                    "className": "badge badge-secondary",
                    "text": "Add Files to Project"
                }
            },
            {
                "tag": "div",
                "text": [
                    {
                        "tag": "dropdown",
                        "className": "form-control",
                        "name": "add-project-files-form.project",
                        "text": []
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
        "className": "page-data",
        "text": [
            {
                "tag": "div.table.tbody.tr",
                "name": "projectId.goBackRow",
                "className": "d-none",
                "text": [
                    {
                        "tag": "td",
                        "className": "v-align-initial",
                        "name": "goBackRow.goBackLink",
                        "text": []
                    },
                    {
                        "tag": "td.h4",
                        "name": "projectId.pName",
                        "text": ""
                    }
                ]
            },
            {
                "tag": "div",
                "name": "projectId.generic1-table",
                "text": []
            },
            {
                "tag": "div.table.tbody.tr",
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
            },
            {
                "tag": "div",
                "name": "pageName:projectId.otherTemplate",
                "text": []
            }
        ]
    }
];
Template["id1Page"] = [
    {
        "tag": "div",
        "className": "page-data",
        "text": [
            {
                "tag": "div.table.tbody.tr",
                "name": "id1Page.goBackRow",
                "className": "d-none",
                "text": [
                    {
                        "tag": "td",
                        "className": "v-align-initial",
                        "name": "goBackRow.goBackLink",
                        "text": []
                    },
                    {
                        "tag": "td.h4",
                        "name": "id1Page.pName",
                        "text": ""
                    }
                ]
            },
            {
                "tag": "div",
                "name": "id1Page.preDefinedPattern",
                "text": []
            },
            {
                "tag": "div",
                "name": "id1Page.generic2-table",
                "text": []
            },
            {
                "tag": "div",
                "name": "pageName:id1Page.formTemplate",
                "text": []
            }
        ]
    }
];
Template["projectSupplyStatus"] = [
    {
        "tag": "div",
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
                        "name": "pageName:badgeText",
                        "text": ""
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
                    "name": "pageName:formBadgeText",
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
                                "name": "new-work-status.date.text",
                                "text": "Date"
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
                                "name": "new-work-status.distance.text",
                                "text": "Distance"
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
                                "name": "new-work-status.section.text",
                                "text": "Section"
                            },
                            {
                                "tag": "td",
                                "name": "new-work-status.section",
                                "text": []
                            },
                            {
                                "tag": "td",
                                "name": "new-work-status.remarks.text",
                                "text": "Remarks"
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
                    "name": "pageName:formBadgeText",
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
                        "name": "pageName:badgeText",
                        "text": ""
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
                    "name": "pageName:formBadgeText",
                    "text": ""
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
Template["displayPage"] = [
    {
        "tag": "div",
        "name": "displayPage.field",
        "text": []
    }
];
Template["viewPage"] = [
    {
        "tag": "div",
        "name": "viewPage.field",
        "text": []
    }
];
export default Template;
