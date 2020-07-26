var Template = {};
Template["heading"] = [
    {
        "tag": "div.center.table.tbody.tr",
        "className": "heading",
        "text": [
            {
                "tag": "td",
                "text": {
                    "tag": "img",
                    "className": "logo",
                    "src": "/assets/static/img/railwayslogo-128.png"
                }
            },
            {
                "tag": "td",
                "className": "text-center pl-10px",
                "text": [
                    {
                        "tag": "div",
                        "text": "Heading Line 1"
                    },
                    {
                        "tag": "div",
                        "text": "Larger Heading Line 2 Row"
                    }
                ]
            }
        ]
    }
];
Template["link"] = [
    {
        "tag": "div.center",
        "text": [
            {
                "tag": "a",
                "href": "/dashboard",
                "name": "link.dashboard",
                "className": "p-10px",
                "text": "Dashboard"
            },
            {
                "tag": "a",
                "href": "/forgot_password",
                "name": "link.forgot_password",
                "className": "p-10px",
                "text": "Forgot Password"
            },
            {
                "tag": "a",
                "href": "/change_password",
                "name": "link.change_password",
                "className": "p-10px",
                "text": "Change Password"
            },
            {
                "tag": "a",
                "href": "/upload_file",
                "name": "link.upload_file",
                "className": "p-10px",
                "text": "Upload File"
            },
            {
                "tag": "a",
                "name": "link.logout",
                "href": "/logout",
                "className": "p-10px",
                "text": "Logout"
            }
        ]
    },
    {
        "tag": "div.center",
        "text": [
            {
                "tag": "span",
                "text": "Login as"
            },
            {
                "tag": "span",
                "className": "small",
                "name": "link.is-admin",
                "text": " (Admin)"
            },
            {
                "tag": "span",
                "className": "",
                "text": ": "
            },
            {
                "tag": "b",
                "name": "link.loginAs",
                "text": ""
            }
        ]
    }
];
Template["login"] = [
    {
        "tag": "div.div",
        "className": "form-div pt-25px",
        "text": {
            "tag": "form",
            "id": "login_form",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Login"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Username"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "login.username",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "login.password",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                },
                {
                    "tag": "a",
                    "href": "/forgot_password",
                    "className": "p-10px",
                    "text": "Forgot Password"
                },
                {
                    "tag": "a",
                    "href": "/register",
                    "className": "p-10px",
                    "text": "Register"
                }
            ]
        }
    }
];
Template["forgot_password"] = [
    {
        "tag": "div.div",
        "className": "form-div pt-25px",
        "text": {
            "tag": "form",
            "id": "forgot_password",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Forgot Password"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "div.label",
                            "className": "pl-10px",
                            "text": "Please contact admin"
                        },
                        {
                            "tag": "div",
                            "text": [
                                {
                                    "tag": "a",
                                    "href": "/login",
                                    "className": "p-10px",
                                    "text": "Login"
                                },
                                {
                                    "tag": "a",
                                    "href": "/register",
                                    "className": "p-10px",
                                    "text": "Register"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
];
Template["register"] = [
    {
        "tag": "div.div",
        "className": "form-div pt-25px",
        "text": {
            "tag": "form",
            "id": "register_form",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Register"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Username"
                        },
                        {
                            "tag": "input",
                            "type": "text",
                            "className": "form-control",
                            "name": "register.username"
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": [
                                {
                                    "tag": "span",
                                    "text": "Passcode"
                                },
                                {
                                    "tag": "span",
                                    "className": "small pl-5px",
                                    "text": "(Receive from admin)"
                                }
                            ]
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "register.passcode",
                            "type": "text",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": [
                                {
                                    "tag": "span",
                                    "text": "New Password"
                                },
                                {
                                    "tag": "span",
                                    "className": "small pl-5px",
                                    "text": "(Do not use gmail password here)"
                                }
                            ]
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "register.password",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Name"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "register.displayName",
                            "type": "text",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                },
                {
                    "tag": "a",
                    "href": "/login",
                    "className": "p-10px",
                    "text": "Login"
                },
                {
                    "tag": "a",
                    "href": "/forgot_password",
                    "className": "p-10px",
                    "text": "Forgot Password"
                }
            ]
        }
    }
];
Template["upload_file"] = [
    {
        "tag": "div.div",
        "className": "form-div",
        "text": {
            "tag": "form",
            "id": "upload_file_form",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Upload File"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "input",
                            "type": "file",
                            "name": "upload_file.file",
                            "id": "file"
                        },
                        {
                            "tag": "div.span",
                            "name": "upload_file.message",
                            "className": "small",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "div",
                            "className": "text-danger pt-10px",
                            "name": "upload_file.message",
                            "text": ""
                        }
                    ]
                }
            ]
        }
    }
];
Template["change_password"] = [
    {
        "tag": "div.div",
        "className": "form-div",
        "text": {
            "tag": "form",
            "id": "change_password",
            "text": [
                {
                    "tag": "div.h1",
                    "className": "p-10px",
                    "text": "Change Password"
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Old Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "change_password.old_password",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": [
                                {
                                    "tag": "span",
                                    "text": "New Password"
                                },
                                {
                                    "tag": "span",
                                    "className": "small pl-5px",
                                    "text": "(Do not use gmail password here)"
                                }
                            ]
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "change_password.new_password",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "div",
                    "className": "form-group",
                    "text": [
                        {
                            "tag": "label",
                            "text": "Confirm Password"
                        },
                        {
                            "tag": "input",
                            "className": "form-control",
                            "name": "change_password.confirm_password",
                            "type": "password",
                            "text": ""
                        }
                    ]
                },
                {
                    "tag": "button",
                    "className": "btn btn-primary",
                    "text": "Submit"
                }
            ]
        }
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
                                "tag": "table.tbody",
                                "className": "table table-striped",
                                "name": "dashboardRow",
                                "text": []
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
                        "value": "orderByFilename",
                        "text": [
                            {
                                "tag": "option",
                                "value": "orderByFilename",
                                "text": "Order By Filename"
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
                "className": "dashboard1stRowByDate-fileinfo",
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
                "name": "s.no",
                "className": "dashboard-s-no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "fileinfo",
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
        "text": "Filename"
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
Template["noPageFound"] = [{
    "tag": "center.h1",
    "text": {
        "tag": "span",
        "className": "",
        "name": "date",
        "text": "Page not found"
    }
}];
Template["noDataFound"] = [{
    "tag": "center.h1",
    "text": "No data found"
}];
Template["loading"] = [
    {
        "tag": "div.center",
        "className": "loading",
        "text": "Loading..."
    }
];

export default Template;
