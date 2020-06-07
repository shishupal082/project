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
                "text": "1"
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
    }
};

export default Template;