var Template = {
    "journalByDate": [
        {
            "tag": "div.h1",
            "text": {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "date",
                "text": ""
            }
        },
        {
            "tag": "div",
            "text": {
                "tag": "table.tbody",
                "name": "journalEntryTable",
                "className": "table-bordered table-striped",
                "text": []
            }
        }
    ],
    "journalEntry1stRow": [
        {
            "tag": "tr",
            "text": [
                {
                    "tag": "th",
                    "text": "S.No."
                },
                {
                    "tag": "th",
                    "className": "w-120px",
                    "text": "Date"
                },
                {
                    "tag": "th",
                    "className": "p-0",
                    "text": {
                        "tag": "table.tbody.tr",
                        "className": "table table-bordered m-0",
                        "text": [
                            {
                                "tag": "td",
                                "text": "Particulars"
                            },
                            {
                                "tag": "td",
                                "className": "w-120px",
                                "text": "Debit"
                            },
                            {
                                "tag": "td",
                                "className": "w-120px",
                                "text": "Credit"
                            },
                            {
                                "tag": "td",
                                "className": "w-120px",
                                "text": "Account"
                            }
                        ]
                    }
                }
            ]
        }
    ],
    "journalEntry": [
        {
            "tag": "tr",
            "text": [
                {
                    "tag": "td",
                    "name": "s.no",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "date",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "particular",
                    "text": []
                }
            ]
        }
    ],
    "journalEntryParticular": [
        {
            "tag": "table.tbody.tr",
            "className": "table table-bordered m-0",
            "text": [
                {
                    "tag": "td",
                    "name": "particularText",
                    "text": ""
                },
                {
                    "tag": "td",
                    "className": "w-120px",
                    "name": "dr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "className": "w-120px",
                    "name": "cr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "className": "w-120px",
                    "name": "account",
                    "text": ""
                }
            ]
        }
    ],
    "ledgerHeading": {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "name": "debitDate",
                "text": "Date"
            },
            {
                "tag": "th",
                "name": "debitParticular",
                "text": "Debit Particular"
            },
            {
                "tag": "th",
                "name": "debitAmount",
                "text": "Debit Amount"
            },
            {
                "tag": "th",
                "name": "creditDate",
                "text": "Date"
            },
            {
                "tag": "th",
                "name": "creditParticular",
                "text": "Credit Particular"
            },
            {
                "tag": "th",
                "name": "creditAmount",
                "text": "Credit Amount"
            }
        ]
    },
    "ledgerRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "debitDate",
                "text": ""
            },
            {
                "tag": "td",
                "name": "debitParticular",
                "text": ""
            },
            {
                "tag": "td",
                "name": "debitAmount",
                "text": ""
            },
            {
                "tag": "td",
                "name": "creditDate",
                "text": ""
            },
            {
                "tag": "td",
                "name": "creditParticular",
                "text": ""
            },
            {
                "tag": "td",
                "name": "creditAmount",
                "text": ""
            }
        ]
    },
    "trialBalance": [
        {
            "tag": "table.tbody",
            "className": "table table-bordered table-striped",
            "name": "trialBalanceRows",
            "text": []
        }
    ],
    "trialBalance1stRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "text": "S.No."
            },
            {
                "tag": "th",
                "text": "Particular"
            },
            {
                "tag": "th",
                "text": "Dr. Balance"
            },
            {
                "tag": "th",
                "text": "Cr. Balance"
            }
        ]
    },
    "trialBalanceRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "particular",
                "text": ""
            },
            {
                "tag": "td",
                "name": "debitBalance",
                "text": ""
            },
            {
                "tag": "td",
                "name": "creditBalance",
                "text": ""
            }
        ]
    },
    "currentBalByDate": [
        {
            "tag": "div.h4",
            "text": {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "accountDisplayName",
                "text": ""
            }
        },
        {
            "tag": "div",
            "name": "currentBalByDateRow",
            "text": []
        }
    ],
    "currentBalByDateRow": [
        {
            "tag": "div",
            "text": {
                "tag": "span",
                "className": "",
                "name": "dateHeading",
                "text": ""
            }
        },
        {
            "tag": "div",
            "text": {
                "tag": "table.tbody",
                "className": "table table-bordered table-striped",
                "name": "currentBalRow",
                "text": []
            }
        }
    ],
    "currentBal1stRowByDate": {
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
                "tag": "th",
                "text": "Particular"
            },
            {
                "tag": "th",
                "text": "Debit"
            },
            {
                "tag": "th",
                "text": "Credit"
            },
            {
                "tag": "th",
                "text": "Current Bal"
            },
            {
                "tag": "th",
                "text": "Balance"
            }
        ]
    },
    "currentBalRowByDate": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "date",
                "text": ""
            },
            {
                "tag": "td",
                "name": "particularText",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "cr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "currentBal",
                "text": ""
            },
            {
                "tag": "td",
                "name": "balance",
                "text": ""
            }
        ]
    },
    "currentBal1stRow": {
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
                "tag": "th",
                "text": "Particular"
            },
            {
                "tag": "th",
                "text": "Debit"
            },
            {
                "tag": "th",
                "text": "Credit"
            },
            {
                "tag": "th",
                "text": "Balance"
            }
        ]
    },
    "currentBalRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "date",
                "text": ""
            },
            {
                "tag": "td",
                "name": "particularText",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "cr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "balance",
                "text": ""
            }
        ]
    },
    "accountSummary": [
        {
            "tag": "div.h4",
            "text": {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "accountDisplayName",
                "text": ""
            }
        },
        {
            "tag": "div",
            "text": {
                "tag": "table.tbody",
                "className": "table table-bordered table-striped",
                "name": "accountSummaryRow",
                "text": []
            }
        }
    ],
    "accountSummary1stRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "text": "S.No."
            },
            {
                "tag": "th",
                "text": "Date Heading"
            },
            {
                "tag": "th",
                "text": "Debit"
            },
            {
                "tag": "th",
                "text": "Credit"
            },
            {
                "tag": "th",
                "text": "Current Bal"
            },
            {
                "tag": "th",
                "text": "Balance"
            }
        ]
    },
    "accountSummaryRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dateHeading",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "cr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "currentBal",
                "text": ""
            },
            {
                "tag": "td",
                "name": "balance",
                "text": ""
            }
        ]
    },
    "accountSummaryByDate": [
        {
            "tag": "div.h4",
            "text": {
                "tag": "span",
                "className": "badge badge-primary",
                "name": "dateHeading",
                "text": ""
            }
        },
        {
            "tag": "div",
            "text": {
                "tag": "table.tbody",
                "className": "table table-bordered table-striped",
                "name": "accountSummaryByDateRow",
                "text": []
            }
        }
    ],
    "accountSummaryByDate1stRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "text": "S.No."
            },
            {
                "tag": "th",
                "text": "Account"
            },
            {
                "tag": "th",
                "text": "Debit"
            },
            {
                "tag": "th",
                "text": "Credit"
            },
            {
                "tag": "th",
                "text": "Current Bal"
            }
        ]
    },
    "accountSummaryByDateRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "td",
                "name": "s.no",
                "text": ""
            },
            {
                "tag": "td",
                "name": "accountDisplayName",
                "text": ""
            },
            {
                "tag": "td",
                "name": "dr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "cr",
                "text": ""
            },
            {
                "tag": "td",
                "name": "currentBal",
                "text": ""
            }
        ]
    },
    "accountSummaryByCalender": [
        {
            "tag": "div.h4",
            "text": [
                {
                    "tag": "span",
                    "className": "badge badge-primary",
                    "name": "accountDisplayName",
                    "text": ""
                },
                {
                    "tag": "span",
                    "className": "badge badge-pill badge-success",
                    "name": "year",
                    "text": " "
                }
            ]
        },
        {
            "tag": "div",
            "text": {
                "tag": "table.tbody",
                "className": "table table-bordered table-striped",
                "name": "accountSummaryByCalenderRow",
                "text": []
            }
        }
    ],
    "accountSummaryByCalender1stRow": {
        "tag": "tr",
        "text": [
            {
                "tag": "th",
                "name": "accountDisplayName",
                "text": ""
            },
            {
                "tag": "th",
                "name": "janValue",
                "text": "Jan"
            },
            {
                "tag": "th",
                "name": "febValue",
                "text": "Feb"
            },
            {
                "tag": "th",
                "name": "marValue",
                "text": "March"
            },
            {
                "tag": "th",
                "name": "aprValue",
                "text": "April"
            },
            {
                "tag": "th",
                "name": "mayValue",
                "text": "May"
            },
            {
                "tag": "th",
                "name": "junValue",
                "text": "June"
            },
            {
                "tag": "th",
                "name": "julValue",
                "text": "July"
            },
            {
                "tag": "th",
                "name": "augValue",
                "text": "Aug"
            },
            {
                "tag": "th",
                "name": "sepValue",
                "text": "Sep"
            },
            {
                "tag": "th",
                "name": "octValue",
                "text": "Oct"
            },
            {
                "tag": "th",
                "name": "novValue",
                "text": "Nov"
            },
            {
                "tag": "th",
                "name": "decValue",
                "text": "Dec"
            },
            {
                "tag": "th",
                "name": "totalValue",
                "text": "Total"
            }
        ]
    },
    "accountSummaryByCalenderRow": [
        {
            "tag": "tr",
            "text": [
                {
                    "tag": "td",
                    "name": "",
                    "text": "Debit"
                },
                {
                    "tag": "td",
                    "name": "janValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "febValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "marValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "aprValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "mayValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "junValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "julValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "augValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "sepValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "octValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "novValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "decValueDr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "totalValueDr",
                    "text": ""
                }
            ]
        },
        {
            "tag": "tr",
            "text": [
                {
                    "tag": "td",
                    "name": "",
                    "text": "Credit"
                },
                {
                    "tag": "td",
                    "name": "janValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "febValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "marValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "aprValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "mayValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "junValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "julValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "augValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "sepValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "octValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "novValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "decValueCr",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "totalValueCr",
                    "text": ""
                }
            ]
        },
        {
            "tag": "tr",
            "className": "bt-1p5px",
            "text": [
                {
                    "tag": "td.b",
                    "name": "",
                    "text": "Balance"
                },
                {
                    "tag": "td",
                    "name": "janValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "febValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "marValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "aprValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "mayValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "junValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "julValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "augValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "sepValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "octValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "novValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "decValueBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "totalValueBal",
                    "text": ""
                }
            ]
        },
        {
            "tag": "tr",
            "text": [
                {
                    "tag": "td.b",
                    "name": "",
                    "text": "End Balance"
                },
                {
                    "tag": "td",
                    "name": "janValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "febValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "marValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "aprValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "mayValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "junValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "julValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "augValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "sepValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "octValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "novValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "decValueEndBal",
                    "text": ""
                },
                {
                    "tag": "td",
                    "name": "totalValueEndBal",
                    "text": ""
                }
            ]
        }
    ]
};

export default Template;
