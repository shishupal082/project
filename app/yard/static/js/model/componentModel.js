(function($M) {
//Initially ASR will be up with timer
var currentValues = {
    "SMR": 1,
    "8-WNKR": 1,
    "9-WNKR": 1,
    "1-TPR": 1,
    "16-TPR": 1,
    "8-TPR": 1,
    "8-TPR-A": 1,
    "8-TPR-1": 1,
    "8-TPR-2": 1,
    "8-TPR-3": 1,
    "8-TPR-B": 1,
    "8-TPR-5": 1,
    "8-TPR-C": 1,
    "8-TPR-7": 1,
    "8-TPR-8": 1,
    "8-TPR-9": 1,
    "8-TPR-D": 1,
    "M-TPR": 1,
    "M-TPR-1": 1,
    "M-TPR-2": 1,
    "M-TPR-3": 1,
    "L-TPR": 1,
    "L-TPR-1": 1,
    "L-TPR-2": 1,
    "L-TPR-3": 1,
    "9-TPR": 1,
    "9-TPR-A": 1,
    "9-TPR-1": 1,
    "9-TPR-2": 1,
    "9-TPR-3": 1,
    "9-TPR-B": 1,
    "9-TPR-5": 1,
    "9-TPR-C": 1,
    "9-TPR-7": 1,
    "9-TPR-8": 1,
    "9-TPR-9": 1,
    "9-TPR-D": 1,
    "4-TPR": 1,
    "13-TPR": 1,
    "1-ASR": 1,
    "2/3-ASR": 1,
    "S4-UYR": 1,
    "13-ASR": 1,
    "14/15-ASR": 1,
    "S16-UYR": 1
};

var possibleValues = [];
var availableGNRs = ["S1-GNR", "S2-GNR", "S3-GNR", "S4-GNR", "S13-GNR", "S14-GNR", "S15-GNR", "S16-GNR"];
var availableUNRs = ["LT-UNR", "LAT-UNR", "MT-UNR", "8-UNR", "9-UNR", "4-UNR", "16-UNR"];

var availableNNRs = ["S1-MT-NNR", "S1-LT-NNR", "S1-LAT-NNR", "S2-NNR", "S3-NNR", "S4-NNR",
            "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR", "S14-NNR", "S15-NNR", "S16-NNR"];

var availableNRRs = ["S1-MT-NRR", "S1-LT-NRR", "S1-LAT-NRR", "S2-NRR", "S3-NRR", "S4-NRR",
            "S13-MT-NRR", "S13-LT-NRR", "S13-LAT-NRR", "S14-NRR", "S15-NRR", "S16-NRR"];

var availableASRs = ["1-ASR", "2/3-ASR", "13-ASR", "14/15-ASR"];
var availableTSRs = ["1/16-TSR", "2/3-TSR", "4/13-TSR", "14/15-TSR"];
var point8Info = ["8-NLR", "8-RLR", "8-NCR", "8-RCR", "8-ASWR", "8-WNR"];
var point9Info = ["9-NLR", "9-RLR", "9-NCR", "9-RCR", "9-ASWR", "9-WNR"];
var uyrs = ["S1-UYR1", "S1-UYR2", "S1-UYR3",
            "S2/3-UYR1", "S2/3-UYR2",
            "S4-UYR",
            "S13-UYR1", "S13-UYR2", "S13-UYR3",
            "S14/15-UYR1", "S14/15-UYR2",
            "S16-UYR"];
var miscs = ["NWWNR", "RWWNR", "S1-UCR", "S2-UCR", "S3-UCR", "S13-UCR", "S14-UCR", "S15-UCR"];
// var availableTSRs = ["1/16-TSR", "2-TSR", "3-TSR", "4/13-TSR", "14/15-TSR"];
//8-TPR / 9-TPR method defined for calculating all value of TPR for point 8
var availableTPRs = ["1-TPR", "16-TPR", "8-TPR",
                        "8-TPR-A","8-TPR-1","8-TPR-2","8-TPR-3","8-TPR-B",
                        "8-TPR-5",
                        "8-TPR-C", "8-TPR-7", "8-TPR-8", "8-TPR-9", "8-TPR-D",
                        "9-TPR",
                        "9-TPR-A","9-TPR-1","9-TPR-2","9-TPR-3","9-TPR-B",
                        "9-TPR-5",
                        "9-TPR-C", "9-TPR-7", "9-TPR-8", "9-TPR-9", "9-TPR-D",
                        "M-TPR", "M-TPR-1", "M-TPR-2", "M-TPR-3",
                        "L-TPR", "L-TPR-1", "L-TPR-2", "L-TPR-3", 
                        "4-TPR", "13-TPR"];


var point9InfoExt = ["9-WFK", "9-NWKR", "9-RWKR", "9-WNKR", "9-WRKR", "9-NWLR", "9-RWLR"];
var point8InfoExt = ["8-WFK", "8-NWKR", "8-RWKR", "8-WNKR", "8-WRKR", "8-NWLR", "8-RWLR"];
var miscsExt = ["SMR",
                "S1-HR", "S1-DR", "S1-UGR",
                "S1-RECR", "S1-HECR", "S1-DECR",
                "S2-HR", "S2-RECR", "S2-HECR",
                "S3-HR", "S3-DR", "S3-RECR", "S3-HECR", "S3-DECR",
                "S4-HR", "S4-RECR", "S4-HECR",
                "S13-HR", "S13-DR", "S13-UGR",
                "S13-RECR", "S13-HECR", "S13-DECR",
                "S14-HR", "S14-RECR", "S14-HECR",
                "S15-HR", "S15-DR", "S15-RECR", "S15-HECR", "S15-DECR",
                "S16-HR", "S16-RECR", "S16-HECR"];

possibleValues = possibleValues.concat(availableASRs);
possibleValues = possibleValues.concat(availableTSRs);
possibleValues = possibleValues.concat(availableNRRs);
possibleValues = possibleValues.concat(availableNNRs);
possibleValues = possibleValues.concat(availableTPRs);
possibleValues = possibleValues.concat(availableGNRs);
possibleValues = possibleValues.concat(availableUNRs);
possibleValues = possibleValues.concat(miscs);
possibleValues = possibleValues.concat(miscsExt);
possibleValues = possibleValues.concat(uyrs);
possibleValues = possibleValues.concat(point8Info);
possibleValues = possibleValues.concat(point9Info);
possibleValues = possibleValues.concat(point8InfoExt);
possibleValues = possibleValues.concat(point9InfoExt);


// valid exp = [S], [(S1&&~S2)], [((S1&&~S2)&&S3)]
//             [S1,~S2], [S1,~S2,S3]
// invalid exp = [(S)], [(S1&&~S2&&S3)]

//advStarter (S4 and S16) does not have UCR and ASR
var exps = {
    "S4-NNR": ["((~S4-HR&&~S4-NRR)&&(S4-NNR||((4-TPR&&S4-UYR)&&~4/13-TSR)))"],
    "S4-UYR": ["((~S4-HR&&~S4-NNR)&&(S4-UYR||((~9-TPR&&~4-TPR)&&13-TPR)))"],
    "S16-NNR": ["(~S16-HR&&~S16-NRR)", "(S16-NNR||((16-TPR&&S16-UYR)&&~1/16-TSR))"],
    "S16-UYR": ["((~S16-HR&&~S16-NNR)&&(S16-UYR||((~8-TPR&&~16-TPR)&&1-TPR)))"],
    "S4-HR": ["(((4/13-TSR&&13-ASR)&&~S4-NNR)&&(S4-NRR&&4-TPR)"],
    "S16-HR": ["(((1/16-TSR&&1-ASR)&&~S16-NNR)&&(S16-NRR&&16-TPR)"],
    "S16-NRR": ["(((S1-MT-NNR&&S1-LT-NNR)&&(S1-LAT-NNR&&~S16-UYR))&&(S16-NRR||((S16-GNR&&16-UNR)&&S16-NNR)))"],
    "S4-NRR": ["(((S13-MT-NNR&&S13-LT-NNR)&&(S13-LAT-NNR&&~S4-UYR))&&(S4-NRR||((S4-GNR&&4-UNR)&&S4-NNR)))"]
};
//advStarter (S4 and S16) does not have UCR and ASR
var ucrExp = {
    "S1-UCR": ["(14/15-ASR&&(13-ASR&&(((S1-MT-NRR&&8-NWKR)&&9-NWKR)||(((S1-LT-NRR&&8-RWKR)&&9-NWKR)||((S1-LAT-NRR&&8-RWKR)&&9-RWKR)))))"],
    "S2-UCR": ["((13-ASR&&S2-NRR)&&9-RWKR)"],
    "S3-UCR": ["((13-ASR&&S3-NRR)&&9-NWKR)"],
    "S13-UCR": {
        "op": "&&",
        "val": [
            "(2/3-ASR&&1-ASR)",
            {
                "op": "||",
                "val": [
                    "((S13-MT-NRR&&~S13-MT-NNR)&&(9-NWKR&&8-NWKR))",
                    "((S13-LT-NRR&&~S13-LT-NNR)&&(9-RWKR&&8-NWKR))",
                    "((S13-LAT-NRR&&~S13-LAT-NNR)&&(9-RWKR&&8-RWKR))"
                ]
            }

        ]
    },
    "S14-UCR": ["((1-ASR&&~S15-UCR)&&(S14-NRR&&8-RWKR))"],
    "S15-UCR": ["((1-ASR&&~S14-UCR)&&(S15-NRR&&8-NWKR))"]
};
var asrExp = {
    "S1-MT-NNR": ["(~S1-MT-NRR&&(S1-MT-NNR||1-ASR))"],
    "S1-LT-NNR": ["(~S1-LT-NRR&&(S1-LT-NNR||1-ASR))"],
    "S1-LAT-NNR": ["(~S1-LAT-NRR&&(S1-LAT-NNR||1-ASR))"],
    "S2-NNR": ["(~S2-NRR&&(S2-NNR||2/3-ASR))"],
    "S3-NNR": ["(~S3-NRR&&(S3-NNR||2/3-ASR))"],
    "S13-MT-NNR": ["(~S13-MT-NRR&&(S13-MT-NNR||13-ASR))"],
    "S13-LT-NNR": ["(~S13-LT-NRR&&(S13-LT-NNR||13-ASR))"],
    "S13-LAT-NNR": ["(~S13-LAT-NRR&&(S13-LAT-NNR||13-ASR))"],
    "S14-NNR": ["(~S14-NRR&&(S14-NNR||14/15-ASR))"],
    "S15-NNR": ["(~S15-NRR&&(S15-NNR||14/15-ASR))"],
    "1/16-TSR": {
        "op": "&&",
        "val": [
            "(1-TPR&&16-TPR)",
            "(1/16-TSR||((S16-NNR&&S1-MT-NNR)&&(S1-LT-NNR&&S1-LAT-NNR)))"
        ]
    },
    "4/13-TSR": {
        "op": "&&",
        "val": [
            "(4-TPR&&13-TPR)",
            "(4/13-TSR||((S4-NNR&&S13-MT-NNR)&&(S13-LT-NNR&&S13-LAT-NNR)))"
        ]
    },
    "2/3-TSR": {
        "op": "&&",
        "val": [
            "((9-TPR-A||9-NWKR)&&(9-TPR-C||9-RWKR))",
            "(2/3-TSR||(S2-NNR&&S3-NNR))"
        ]
    },
    "14/15-TSR": {
        "op": "&&",
        "val": [
            "((8-TPR-B||8-NWKR)&&(8-TPR-D||8-RWKR))",
            "(14/15-TSR||(S14-NNR&&S15-NNR))"
        ]
    },
    "1-ASR": {
        "op": "&&",
        "val": [
            "~S1-HR", "~S1-DR", "~S1-UGR", //Indication locking
            "~S1-UCR",
            {
                "op": "||",
                "val": [
                    "1-ASR",
                    {
                        "op": "&&",
                        "val": [
                            "~S1-MT-NRR", "~S1-LT-NRR", "~S1-LAT-NRR", //Back locking
                            "1-TPR", "16-TPR", "8-TPR", "8-TPR-C", "8-TPR-7", //Approach locking
                            {
                                "op": "||",
                                "val": [
                                    "(8-NWKR&&((8-TPR-8&&8-TPR-9)&&8-TPR-D))",
                                    "(8-RWKR&&((8-TPR-5&&8-TPR-3)&&8-TPR-B))",
                                ]
                            },
                            "S1-UYR1", "S1-UYR2", "S1-UYR3"
                        ]
                    }
                ]
            }

        ]
    },
    "S1-UYR1": [
        "~S1-HR", "~S1-DR", "~S1-UGR",
        "~1-ASR", "~1/16-TSR",
        "(S1-UYR1||((~1-TPR&&~16-TPR)&&8-TPR))"
    ],
    "S1-UYR2": [
        "~S1-HR", "~S1-DR", "~S1-UGR",
        "~1-ASR", "S1-UYR1",
        "(S1-UYR2||((~8-TPR&&~8-TPR-C)&&8-TPR-7))"
    ],
    "S1-UYR3": [
        "~S1-HR", "~S1-DR", "~S1-UGR",
        "~1-ASR", "S1-UYR2",
        "(S1-UYR3||((8-NWKR&&((~8-TPR-D&&~M-TPR)&&8-TPR-9))||(8-RWKR&&((~8-TPR-B&&~L-TPR)&&8-TPR-3))))"
    ],
    "13-ASR": {
        "op": "&&",
        "val": [
            "~S13-HR", "~S13-DR", "~S13-UGR", //Indication locking
            "~S13-UCR",
            {
                "op": "||",
                "val": [
                    "13-ASR",
                    {
                        "op": "&&",
                        "val": [
                            "~S13-MT-NRR", "~S13-LT-NRR", "~S13-LAT-NRR", //Back locking
                            "13-TPR", "4-TPR", "9-TPR", "9-TPR-D", "9-TPR-9", //Approach locking
                            {
                                "op": "||",
                                "val": [
                                    "(9-NWKR&&((9-TPR-8&&9-TPR-7)&&9-TPR-C))",
                                    "(9-RWKR&&((9-TPR-1&&9-TPR-5)&&9-TPR-A))",
                                ]
                            },
                            "S13-UYR1", "S13-UYR2", "S13-UYR3"
                        ]
                    }
                ]
            }

        ]
    },
    "S13-UYR1": [
        "~S13-HR", "~S13-DR", "~S13-UGR",
        "~13-ASR", "~4/13-TSR",
        "(S13-UYR1||((~13-TPR&&~4-TPR)&&9-TPR))"
    ],
    "S13-UYR2": [
        "~S13-HR", "~S13-DR", "~S13-UGR",
        "~13-ASR", "S13-UYR1",
        "(S13-UYR2||((~9-TPR&&~9-TPR-D)&&9-TPR-9))"
    ],
    "S13-UYR3": [
        "~S13-HR", "~S13-DR", "~S13-UGR",
        "~13-ASR", "S13-UYR2",
        "(S13-UYR3||((9-NWKR&&((~9-TPR-C&&~M-TPR)&&9-TPR-7))||(9-RWKR&&((~9-TPR-A&&~L-TPR)&&9-TPR-1))))"
    ],
    "2/3-ASR": {
        "op": "&&",
        "val": [ 
            {
                "op": "&&",
                "val": [
                    "(~S2-HR&&(~S3-HR&&~S3-DR))", //Indication locking
                    "(~S2-UCR&&~S3-UCR)"
                ]
            },
            {
                "op": "||",
                "val": [
                    "2/3-ASR",
                    {
                        "op": "&&",
                        "val": [
                            "(~S2-NRR&&~S3-NRR)",//Back locking
                            "(((9-NWKR&&9-TPR-C)&&(9-TPR-7&&9-TPR-8))||((9-RWKR&&9-TPR-A)&&(9-TPR-1&&9-TPR-5)))",
                            "((9-TPR-9&&9-TPR-D)&&9-TPR)",//Approach locking
                            "(S2/3-UYR1&&S2/3-UYR2)"
                        ]
                    }
                ]
            }
        ]
    },
    "S2/3-UYR1": {
        "op": "&&",
        "val": [
            "(~S2-HR&&(~S3-HR&&~S3-DR))", //Indication locking
            "(~2/3-ASR&&~2/3-TSR)",
            {
                "op": "||",
                "val": [
                    "S2/3-UYR1",
                    "(9-NWKR&&(9-TPR-8&&(~9-TPR-C&&~9-TPR-7)))",
                    "(9-RWKR&&(9-TPR-5&&(~9-TPR-A&&~9-TPR-1)))"
                ]
            }
        ]
    },
    "S2/3-UYR2": {
        "op": "&&",
        "val": [
            "(~S2-HR&&(~S3-HR&&~S3-DR))", //Indication locking
            "~2/3-ASR",
            {
                "op": "||",
                "val": [
                    "S2/3-UYR2",
                    "(S2/3-UYR1&&(9-TPR&&(~4-TPR&&~13-TPR)))"
                ]
            }
        ]
    },
    "14/15-ASR": {
        "op": "&&",
        "val": [ 
            {
                "op": "&&",
                "val": [
                    "(~S14-HR&&(~S15-HR&&~S15-DR))", //Indication locking
                    "(~S14-UCR&&~S15-UCR)"
                ]
            },
            {
                "op": "||",
                "val": [
                    "14/15-ASR",
                    {
                        "op": "&&",
                        "val": [
                            "(~S14-NRR&&~S15-NRR)",//Back locking
                            "(((8-NWKR&&8-TPR-D)&&(8-TPR-9&&8-TPR-8))||((8-RWKR&&8-TPR-B)&&(8-TPR-3&&8-TPR-5)))",
                            "((8-TPR-7&&8-TPR-C)&&8-TPR)",//Approach locking
                            "(S14/15-UYR1&&S14/15-UYR2)"
                        ]
                    }
                ]
            }
        ]
    },
    "S14/15-UYR1": {
        "op": "&&",
        "val": [
            "(~S14-HR&&(~S15-HR&&~S15-DR))", //Indication locking
            "(~14/15-ASR&&~14/15-TSR)",
            {
                "op": "||",
                "val": [
                    "S14/15-UYR1",
                    "(8-NWKR&&(8-TPR-8&&(~8-TPR-D&&~8-TPR-9)))",
                    "(8-RWKR&&(8-TPR-5&&(~8-TPR-B&&~8-TPR-3)))"
                ]
            }
        ]
    },
    "S14/15-UYR2": {
        "op": "&&",
        "val": [
            "(~S14-HR&&(~S15-HR&&~S15-DR))", //Indication locking
            "~14/15-ASR",
            {
                "op": "||",
                "val": [
                    "S14/15-UYR2",
                    "(S14/15-UYR1&&(8-TPR&&(~16-TPR&&~1-TPR)))"
                ]
            }
        ]
    },
    "S1-MT-NRR": [
        "S1-LT-NNR", "S1-LAT-NNR", "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR",
        "S14-NNR", "S15-NNR", "S16-NNR", "S2-NNR",
        "(S1-MT-NRR||((S1-GNR&&MT-UNR)&&1-ASR))",
        "~S1-UYR1"
    ],
    "S1-LT-NRR": [
        "S1-MT-NNR", "S1-LAT-NNR", "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR",
        "S14-NNR", "S15-NNR", "S16-NNR", "S2-NNR",
        "(S1-LT-NRR||((S1-GNR&&LT-UNR)&&1-ASR))",
        "~S1-UYR1"
    ],
    "S1-LAT-NRR": [
        "S1-MT-NNR", "S1-LT-NNR", "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR",
        "S14-NNR", "S15-NNR", "S16-NNR", "S3-NNR",
        "(S1-LAT-NRR||((S1-GNR&&LAT-UNR)&&1-ASR))",
        "~S1-UYR1"
    ],
    "S2-NRR": [
        "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR",
        "S14-NNR", "S3-NNR", "S1-MT-NNR", "S1-LT-NNR",
        "(S2-NRR||((S2-GNR&&9-UNR)&&2/3-ASR))",
        "~S2/3-UYR1"
    ],
    "S3-NRR": [
        "S13-MT-NNR", "S13-LT-NNR", "S13-LAT-NNR",
        "S15-NNR", "S2-NNR", "S1-LAT-NNR",
        "(S3-NRR||((S3-GNR&&9-UNR)&&2/3-ASR))",
        "~S2/3-UYR1"
    ],
    "S13-MT-NRR": ["S1-MT-NNR", "S1-LT-NNR", "S1-LAT-NNR", "S2-NNR", "S3-NNR",
                    "S4-NNR", "S13-LT-NNR", "S13-LAT-NNR", "S14-NNR",
                    "(S13-MT-NRR||((S13-GNR&&MT-UNR)&&13-ASR))",
                    "~S13-UYR1"],
    "S13-LT-NRR": ["S1-MT-NNR", "S1-LT-NNR", "S1-LAT-NNR", "S2-NNR", "S3-NNR",
                    "S4-NNR", "S13-MT-NNR", "S13-LAT-NNR", "S14-NNR",
                    "(S13-LT-NRR||((S13-GNR&&LT-UNR)&&13-ASR))",
                    "~S13-UYR1"],
    "S13-LAT-NRR": ["S1-MT-NNR", "S1-LT-NNR", "S1-LAT-NNR", "S2-NNR", "S3-NNR",
                    "S4-NNR", "S13-MT-NNR", "S13-LT-NNR", "S15-NNR",
                    "(S13-LAT-NRR||((S13-GNR&&LAT-UNR)&&13-ASR))",
                    "~S13-UYR1"],
    "S14-NRR": ["S1-MT-NNR", "S1-LT-NNR", "S1-LAT-NNR",
                "S15-NNR", "S2-NNR", "S13-MT-NNR", "S13-LT-NNR",
                "(S14-NRR||((S14-GNR&&8-UNR)&&14/15-ASR))",
                "~S14/15-UYR1"],
    "S15-NRR": ["((S1-MT-NNR&&S1-LT-NNR)&&(S1-LAT-NNR&&S13-LAT-NNR))",
                "(S14-NNR&&S3-NNR)",
                "(S15-NRR||((S15-GNR&&8-UNR)&&14/15-ASR))",
                "~S14/15-UYR1"]
};
var hrExpression = {
    "S1-HR": {
        "op": "&&",
        "val": [
            "(~S13-UYR1&&(~S13-UYR2&&~S13-UYR3))",
            "(14/15-ASR&&13-ASR)",
            "(S1-UCR&&(1/16-TSR&&~1-ASR))",
            "(1-TPR&&((16-TPR&&8-TPR)&&(8-TPR-C&&8-TPR-7)))",
            {
                "op": "||",
                "val": [
                    {
                        "op": "&&",
                        "val": [
                            "S1-MT-NRR","8-NWKR","9-NWKR",
                            "8-TPR-8", "8-TPR-9", "8-TPR-D", "M-TPR",
                            "9-TPR-C", "9-TPR-7", "9-TPR-8", "9-TPR-9",
                            "9-TPR-D", "9-TPR"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S1-LT-NRR","8-RWKR","9-NWKR",
                            "8-TPR-5", "8-TPR-3", "8-TPR-B", "L-TPR",
                            "9-TPR-A", "9-TPR-1", "9-TPR-2", "9-TPR-3",
                            "9-TPR-B"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S1-LAT-NRR","8-RWKR","9-RWKR",
                            "8-TPR-5", "8-TPR-3", "8-TPR-B", "L-TPR",
                            "9-TPR-A", "9-TPR-1", "9-TPR-5", "9-TPR-9",
                            "9-TPR-D", "9-TPR"
                        ]
                    }
                ]
            },
            "(~S1-GNR||S1-HR)",
            "((8-NWKR&&~S1-UGR)||(8-RWKR&&S1-UGR))"
        ]
    },
    "S1-UGR": {
        "op": "&&",
        "val": [
            "(~S13-UYR1&&(~S13-UYR2&&~S13-UYR3))",
            "(14/15-ASR&&13-ASR)",
            "(S1-UCR&&(1/16-TSR&&~1-ASR))",
            "(1-TPR&&((16-TPR&&8-TPR)&&(8-TPR-C&&8-TPR-7)))",
            {
                "op": "||",
                "val": [
                    {
                        "op": "&&",
                        "val": [
                            "S1-MT-NRR","8-NWKR","9-NWKR",
                            "8-TPR-8", "8-TPR-9", "8-TPR-D", "M-TPR",
                            "9-TPR-C", "9-TPR-7", "9-TPR-8", "9-TPR-9",
                            "9-TPR-D", "9-TPR"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S1-LT-NRR","8-RWKR","9-NWKR",
                            "8-TPR-5", "8-TPR-3", "8-TPR-B", "L-TPR",
                            "9-TPR-A", "9-TPR-1", "9-TPR-2", "9-TPR-3",
                            "9-TPR-B"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S1-LAT-NRR","8-RWKR","9-RWKR",
                            "8-TPR-5", "8-TPR-3", "8-TPR-B", "L-TPR",
                            "9-TPR-A", "9-TPR-1", "9-TPR-5", "9-TPR-9",
                            "9-TPR-D", "9-TPR"
                        ]
                    }
                ]
            },
            "(~S1-GNR||S1-HR)",
            "(8-RWKR&&8-RWKR)"
        ]
    },
    "S1-DR": [
        "(((S1-HR&&~S1-UGR)&&8-NWKR)&&(S3-HR&&S3-DR))"
    ],
    "S2-HR": [
        "13-ASR", "~S3-UCR",
        "S2-UCR", "2/3-TSR",  "~2/3-ASR",
        "S2-NRR", "9-RWKR",
        "9-TPR-A", "9-TPR-1", "9-TPR-5", "9-TPR-9", "9-TPR-D", "9-TPR"
    ],
    "S3-HR": [
        "13-ASR", "~S2-UCR",
        "S3-UCR", "2/3-TSR",  "~2/3-ASR",
        "S3-NRR", "9-NWKR",
        "9-TPR-C", "9-TPR-7", "9-TPR-8", "9-TPR-9", "9-TPR"
    ],
    "S3-DR": ["(S4-HR&&S3-HR)"],
    "S13-HR": {
        "op": "&&",
        "val": [
            "(~S13-UYR1&&(~S13-UYR2&&~S13-UYR3))",
            "(2/3-ASR&&1-ASR)",
            "(S13-UCR&&(4/13-TSR&&~13-ASR))",
            "(13-TPR&&((4-TPR&&9-TPR)&&(9-TPR-D&&9-TPR-9)))",
            {
                "op": "||",
                "val": [
                    {
                        "op": "&&",
                        "val": [
                            "S13-MT-NRR","9-NWKR","8-NWKR",
                            "9-TPR-8", "9-TPR-7", "9-TPR-C", "M-TPR",
                            "8-TPR-D", "8-TPR-9", "8-TPR-8", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LT-NRR","9-RWKR","8-NWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-2", "8-TPR-1",
                            "8-TPR-A"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LAT-NRR","9-RWKR","8-RWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-5", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    }
                ]
            },
            "(~S13-GNR||S13-HR)",
            "((9-NWKR&&~S13-UGR)||(9-RWKR&&S13-UGR))"
        ]
    },
    "S13-UGR": {
        "op": "&&",
        "val": [
            "(~S13-UYR1&&(~S13-UYR2&&~S13-UYR3))",
            "(2/3-ASR&&1-ASR)",
            "(S13-UCR&&(4/13-TSR&&~13-ASR))",
            "(13-TPR&&((4-TPR&&9-TPR)&&(9-TPR-D&&9-TPR-9)))",
            {
                "op": "||",
                "val": [
                    {
                        "op": "&&",
                        "val": [
                            "S13-MT-NRR","9-NWKR","8-NWKR",
                            "9-TPR-8", "9-TPR-7", "9-TPR-C", "M-TPR",
                            "8-TPR-D", "8-TPR-9", "8-TPR-8", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LT-NRR","9-RWKR","8-NWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-2", "8-TPR-1",
                            "8-TPR-A"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LAT-NRR","9-RWKR","8-RWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-5", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    }
                ]
            },
            "(~S13-GNR||S13-HR)",
            "(9-RWKR&&9-RWKR)"
        ]
    },
    "S13-DR": {
        "op": "&&",
        "val": [
            "(~S13-UYR1&&~S13-UYR2&&~S13-UYR3)",
            "(2/3-ASR&&1-ASR)",
            "(S13-UCR&&(4/13-TSR&&~13-ASR))",
            "(13-TPR&&((4-TPR&&9-TPR)&&(9-TPR-D&&9-TPR-9)))",
            {
                "op": "||",
                "val": [
                    {
                        "op": "&&",
                        "val": [
                            "S13-MT-NRR","9-NWKR","8-NWKR",
                            "9-TPR-8", "9-TPR-7", "9-TPR-C", "M-TPR",
                            "8-TPR-D", "8-TPR-9", "8-TPR-8", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LT-NRR","9-RWKR","8-NWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-2", "8-TPR-1",
                            "8-TPR-A"
                        ]
                    },
                    {
                        "op": "&&",
                        "val": [
                            "S13-LAT-NRR","9-RWKR","8-RWKR",
                            "9-TPR-5", "9-TPR-1", "9-TPR-A", "L-TPR",
                            "8-TPR-B", "8-TPR-3", "8-TPR-5", "8-TPR-7",
                            "8-TPR-C", "8-TPR"
                        ]
                    }
                ]
            },
            "(~S13-GNR||S13-HR)",
            "((9-NWKR&&~S13-UGR)&&(S13-HR&&S15-DR))"
        ]
    },
    "S14-HR": {
        "op": "&&",
        "val": [
            "1-ASR","~S15-UCR",
            "14/15-TSR","~14/15-ASR","S14-UCR",
            "S14-NRR","8-RWKR",
            "8-TPR-B","8-TPR-3","8-TPR-5","8-TPR-7","8-TPR-C","8-TPR"
        ]
    },
    "S15-HR": {
        "op": "&&",
        "val": [
            "1-ASR","~S14-UCR",
            "14/15-TSR","~14/15-ASR","S15-UCR",
            "S15-NRR","8-NWKR",
            "8-TPR-D","8-TPR-9","8-TPR-8","8-TPR-7","8-TPR-C","8-TPR"
        ]
    },
    "S15-DR": ["(S16-HR&&S15-HR)"]
};
var tprExp = {
    "M-TPR-1": ["M-TPR"],
    "M-TPR-2": ["M-TPR"],
    "M-TPR-3": ["M-TPR"],
    "L-TPR-1": ["L-TPR"],
    "L-TPR-2": ["L-TPR"],
    "L-TPR-3": ["L-TPR"],
    "S1-HECR": ["(S1-HR&&~S1-DR)"],
    "S1-DECR": ["(S1-HR&&S1-DR)"],
    "S2-RECR": ["~S2-HR"],
    "S2-HECR": ["S2-HR"],
    "S3-RECR": ["~S3-HR"],
    "S3-HECR": ["(S3-HR&&~S3-DR)"],
    "S3-DECR": ["(S3-HR&&S3-DR)"],
    "S4-RECR": ["~S4-HR"],
    "S4-HECR": ["(S4-HR&&S4-HR)"],
    "S13-RECR": ["~S13-HR"],
    "S13-HECR": ["(S13-HR&&~S13-DR)"],
    "S13-DECR": ["(S13-HR&&S13-DR)"],
    "S14-RECR": ["~S14-HR"],
    "S14-HECR": ["S14-HR"],
    "S15-RECR": ["~S15-HR"],
    "S15-HECR": ["(S15-HR&&~S15-DR)"],
    "S15-DECR": ["(S15-HR&&S15-DR)"],
    "S16-RECR": ["~S16-HR"],
    "S16-HECR": ["S16-HR"]
};
var tprLockExpression = {
    "1-TPR": ["(~1-ASR||~S16-NNR)"],
    "16-TPR": ["(~1-ASR||~S16-NNR)"],
    "8-TPR": {
        "op": "||",
        "val": [
            "~1-ASR","~14/15-ASR",
            "(~13-ASR&&(9-NWKR||(9-RWKR&&8-RWKR)))"
        ]
    },
    "8-TPR-A": ["(~13-ASR&&(9-RWKR&&8-NWKR))"],
    "8-TPR-B": {
        "op": "||",
        "val": [
            "(~1-ASR&&8-RWKR)",
            "(~13-ASR&&9-RWKR)",
            "(~14/15-ASR&&8-RWKR)"
        ]
    },
    "8-TPR-C": {
        "op": "||",
        "val": [
            "~1-ASR","~14/15-ASR",
            "(~13-ASR&&(9-NWKR||(9-RWKR&&8-RWKR)))"
        ]
    },
    "8-TPR-D": {
        "op": "||",
        "val": [
            "(8-NWKR&&(~1-ASR||~14/15-ASR))",
            "(~13-ASR&&9-NWKR)"
        ]
    },
    "8-TPR-1": ["8-NWKR"],
    "8-TPR-2": ["8-NWKR"],
    "8-TPR-3": ["(8-NWKR||8-RWKR)"],
    "8-TPR-5": ["8-RWKR"],
    "8-TPR-7": ["(8-NWKR||8-RWKR)"],
    "8-TPR-8": ["8-NWKR"],
    "8-TPR-9": ["8-NWKR"],
    "9-TPR": {
        "op": "||",
        "val": [
            "~13-ASR","~2/3-ASR",
            "(~1-ASR&&(8-NWKR||(8-RWKR&&9-RWKR)))"
        ]
    },
    "9-TPR-A": {
        "op": "||",
        "val": [
            "(~1-ASR&&8-RWKR)",
            "(~2/3-ASR&&9-RWKR)",
            "(~13-ASR&&9-RWKR)"
        ]
    },
    "9-TPR-B": ["(~1-ASR&&(8-RWKR&&9-NWKR))"],
    "9-TPR-C": {
        "op": "||",
        "val": [
            "(~1-ASR&&8-NWKR)","(~2/3-ASR&&9-NWKR)",
            "(~13-ASR&&9-NWKR)"
        ]
    },
    "9-TPR-D": {
        "op": "||",
        "val": [
            "~13-ASR","~2/3-ASR",
            "(~1-ASR&&(8-NWKR||(8-RWKR&&9-RWKR)))"
        ]
    },
    "9-TPR-1": ["(9-NWKR||9-RWKR)"],
    "9-TPR-2": ["9-NWKR"],
    "9-TPR-3": ["9-NWKR"],
    "9-TPR-5": ["9-RWKR"],
    "9-TPR-7": ["9-NWKR"],
    "9-TPR-8": ["9-NWKR"],
    "9-TPR-9": ["(9-NWKR||9-RWKR)"],
    "4-TPR": ["(~13-ASR||~S4-NNR)"],
    "13-TPR": ["(~13-ASR||~S4-NNR)"],
    "M-TPR-1": ["((8-NWKR&&~1-ASR)||(9-NWKR&&~13-ASR))"],
    "M-TPR-2": ["((8-NWKR&&~1-ASR)||(9-NWKR&&~13-ASR))"],
    "M-TPR-3": ["((8-NWKR&&~1-ASR)||(9-NWKR&&~13-ASR))"],
    "L-TPR-1": ["((8-RWKR&&~1-ASR)||(9-RWKR&&~13-ASR))"],
    "L-TPR-2": ["((8-RWKR&&~1-ASR)||(9-RWKR&&~13-ASR))"],
    "L-TPR-3": ["((8-RWKR&&~1-ASR)||(9-RWKR&&~13-ASR))"]
};
Object.assign(exps, ucrExp);
Object.assign(exps, tprExp);
Object.assign(exps, asrExp);
Object.assign(exps, hrExpression);
$M.extend({
    getTprLockExpressionFromComponentModel: function() {
        return tprLockExpression;
    },
    getPossibleValuesFromComponentModel: function() {
        return possibleValues;
    },
    getCurrentValuesFromComponentModel: function() {
        return currentValues;
    },
    getSignalExpressionsFromComponentModel: function() {
        return exps;
    }
    
});
// $M("14/15-ASR").addDebug();
})($M);

