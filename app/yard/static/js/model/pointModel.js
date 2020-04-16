(function($M) {

// valid exp = [S], [(S1&&~S2)], [((S1&&~S2)&&S3)]
//             [S1,~S2], [S1,~S2,S3], [(S1&&~S2&&S3)], (S1||~S2||S3)
// invalid exp = [(S)]

var pointExp = {
    "8-ASWR": {
        "op": "||",
        "val": [
            "(8-NLR&&8-NWLR&&~8-NCR)",
            "(8-RLR&&8-RWLR&&~8-RCR)"
        ]
    },
    "8-NCR": {
        "op": "&&",
        "val": [
            {
                "op": "||",
                "val": [
                    "8-ASWR",
                    "(8-WNR&&(NWWNR||RWWNR))",
                    "8-NCR"
                ]
            },
            "(~8-RWLR&&~8-RCR)",
            "(8-NWLR||8-NCR)"
        ]
    },
    "8-RCR": {
        "op": "&&",
        "val": [
            {
                "op": "||",
                "val": [
                    "8-ASWR",
                    "(8-WNR&&(NWWNR||RWWNR))",
                    "8-RCR"
                ]
            },
            "(~8-NWLR&&~8-NCR)",
            "(8-RWLR||8-RCR)"
        ]
    },
    "8-NWKR": {
        "op": "&&",
        "val": [
            "8-WNKR",
            "(8-NCR||(~8-NWLR&&~8-RWLR))",
            "~8-RWKR"
        ]
    },
    "8-RWKR": {
        "op": "&&",
        "val": [
            "8-WRKR",
            "(8-RCR||(~8-NWLR&&~8-RWLR))",
            "~8-NWKR"
        ]
    },
    "8-WNKR": ["(~8-RCR&&~8-WRKR)"],
    "8-WRKR": ["(~8-NCR&&~8-WNKR)"],
    "8-NWLR": [
        "1-ASR", "14/15-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["8-TPR-A", "8-TPR-1", "8-TPR-2", "8-TPR-3", "8-TPR-B",
                            "8-TPR-5", "8-TPR-C", "8-TPR-7", "8-TPR-8",
                            "8-TPR-9", "8-TPR-D"
                    ]
                },
                "8-NWLR",
                "8-RWLR"
            ]
        },
        {
            "op": "&&",
            "val":[
                {
                    "op": "||",
                    "val": [
                        {
                            "op": "&&",
                            "val": [
                                "(~8-NLR&&~8-RLR)",
                                "((8-WNR&&NWWNR)||8-NWLR)"
                            ]
                        },
                        "((~8-WNR||(~NWWNR&&~RWWNR))&&8-NLR)"
                    ]
                },
                "(~8-NWKR&&~8-RWLR)",
                "(~8-WNR||~RWWNR)"
            ]
        }
    ],
    "8-RWLR": [
        "1-ASR", "14/15-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["8-TPR-A", "8-TPR-1", "8-TPR-2", "8-TPR-3", "8-TPR-B",
                            "8-TPR-5", "8-TPR-C", "8-TPR-7", "8-TPR-8",
                            "8-TPR-9", "8-TPR-D"
                    ]
                },
                "8-NWLR",
                "8-RWLR"
            ]
        },
        {
            "op": "&&",
            "val":[
                {
                    "op": "||",
                    "val": [
                        {
                            "op": "&&",
                            "val": [
                                "(~8-NLR&&~8-RLR)",
                                "((8-WNR&&RWWNR)||8-RWLR)"
                            ]
                        },
                        "((~8-WNR||(~NWWNR&&~RWWNR))&&8-RLR)"
                    ]
                },
                "(~8-RWKR&&~8-NWLR)",
                "(~8-WNR||~NWWNR)"
            ]
        }
    ],
    "8-WFK": [
        "1-ASR", "14/15-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["8-TPR-A", "8-TPR-1", "8-TPR-2", "8-TPR-3", "8-TPR-B",
                            "8-TPR-5", "8-TPR-C", "8-TPR-7", "8-TPR-8",
                            "8-TPR-9", "8-TPR-D"
                    ]
                },
                "8-NWLR",
                "8-RWLR"
            ]
        }
    ],
    "8-NLR": {
        op: "&&",
        val: [
            {
                op: "||",
                val: [
                    {
                        "op": "&&",
                        "val": ["S1-MT-NRR", "~S1-MT-NNR"]
                    },
                    {
                        "op": "&&",
                        "val": ["S13-MT-NRR", "~S13-MT-NNR"]
                    },
                    {
                        "op": "&&",
                        "val": ["S13-LT-NRR", "~S13-LT-NNR"]
                    },
                    {
                        "op": "&&",
                        "val": ["S15-NRR", "~S15-NNR"]
                    }
                ]
            },
            {
                op: "&&",
                val: ["~S1-LT-NRR", "~S1-LAT-NRR", "~S13-LAT-NRR",
                    "~S14-NRR", "~8-NWKR", "~8-RLR"]
            }
        ]
    },
    "8-RLR": {
        op: "&&",
        val: [
            {
                op: "||",
                val: ["(S1-LT-NRR&&~S1-LT-NNR)","(S1-LAT-NRR&&~S1-LAT-NNR)",
                        "(S13-LAT-NRR&&~S13-LAT-NNR)","(S14-NRR&&~S14-NNR)"
                ]
            },
            {
                op: "&&",
                val: ["~S1-MT-NRR", "~S13-MT-NRR", "~S13-LT-NRR", "~S15-NRR",
                "~8-RWKR", "~8-NLR"]
            }
        ]
    },
    "9-ASWR": ["((9-NLR&&(9-NWLR&&~9-NCR))||((9-RLR&&9-RWLR)&&~9-RCR))"],
    "9-WNKR": ["(~9-RCR&&~9-WRKR)"],
    "9-WRKR": ["(~9-NCR&&~9-WNKR)"],
    "9-NWKR": ["((9-WNKR&&~9-RWKR)&&((~9-NWLR&&~9-RWLR)||9-NCR))"],
    "9-RWKR": ["((9-WRKR&&~9-NWKR)&&((~9-NWLR&&~9-RWLR)||9-RCR))"],
    "9-NWLR": [
        "1-ASR", "2/3-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["9-TPR-A", "9-TPR-1", "9-TPR-2", "9-TPR-3", "9-TPR-B",
                            "9-TPR-5", "9-TPR-C", "9-TPR-7", "9-TPR-8",
                            "9-TPR-9", "9-TPR-D"
                    ]
                },
                "9-NWLR",
                "9-RWLR"
            ]
        },
        "((((~9-NLR&&~9-RLR)&&((9-WNR&&NWWNR)||9-NWLR))||(~9-WNR&&9-NLR))&&(~9-NWKR&&~9-RWLR))"
    ],
    "9-WFK": [
        "1-ASR", "2/3-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["9-TPR-A", "9-TPR-1", "9-TPR-2", "9-TPR-3", "9-TPR-B",
                            "9-TPR-5", "9-TPR-C", "9-TPR-7", "9-TPR-8",
                            "9-TPR-9", "9-TPR-D"
                    ]
                },
                "9-NWLR",
                "9-RWLR"
            ]
        }
    ],
    "9-RWLR": [
        "1-ASR", "2/3-ASR", "13-ASR",
        {
            "op": "||",
            "val":[
                {
                    "op": "&&",
                    "val": ["9-TPR-A", "9-TPR-1", "9-TPR-2", "9-TPR-3", "9-TPR-B",
                            "9-TPR-5", "9-TPR-C", "9-TPR-7", "9-TPR-8",
                            "9-TPR-9", "9-TPR-D"
                    ]
                },
                "9-NWLR",
                "9-RWLR"
            ]
        },
        "((((~9-NLR&&~9-RLR)&&((9-WNR&&RWWNR)||9-RWLR))||(~9-WNR&&9-RLR))&&(~9-RWKR&&~9-NWLR))"
    ],
    "9-NLR": {
        op: "&&",
        val: [
            {
                op: "||",
                val: ["(S1-MT-NRR&&~S1-MT-NNR)","(S1-LT-NRR&&~S1-LT-NNR)","(S3-NRR&&~S3-NNR)",
                      "(S13-MT-NRR&&~S13-MT-NNR)"]
            },
            {
                op: "&&",
                val: ["~S1-LAT-NRR", "~S2-NRR", "~S13-LT-NRR", "~S13-LAT-NRR",
                      "~9-NWKR", "~9-RLR"]
            }
        ]
    },
    "9-RLR": {
        op: "&&",
        val: [
            {
                op: "||",
                val: ["(S13-LT-NRR&&~S13-LT-NNR)","(S13-LAT-NRR&&~S13-LAT-NNR)","(S1-LAT-NRR&&~S1-LAT-NNR)",
                      "(S2-NRR&&~S2-NNR)"]
            },
            {
                op: "&&",
                val: ["~S1-MT-NRR", "~S1-LT-NRR", "~S13-MT-NRR", "~S3-NRR",
                      "~9-RWKR", "~9-NLR"]
            }
        ]
    },
    "9-NCR": {
        "op": "&&",
        "val": [
            {
                "op": "||",
                "val": ["(9-WNR&&NWWNR)", "(9-ASWR||9-NCR)"]
            },
            "(~9-RWLR&&~9-RCR)",
            "(9-NWLR||9-NCR)"
        ]
    },
    "9-RCR": {
        "op": "&&",
        "val": [
            "((9-WNR&&RWWNR)||(9-ASWR||9-RCR))",
            "(~9-NWLR&&~9-NCR)",
            "(9-RWLR||9-RCR)"
        ]
    }
};

$M.extend({
    getPointExpressionsFromComponentModel: function() {
        return pointExp;
    }
});
})($M);

