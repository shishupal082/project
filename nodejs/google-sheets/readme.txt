Important config data:
copyCellDataIndex: [0,1],
appendCellDataIndex: [[3,10], [12,-1]],
copyOldData: false,
"cellMapping": [
    {
        "gs_index": -1,
        "defaultCellData": "data1"
    },
    {
        "gs_index": 0,
        "defaultCellData": ""
    },
    {
        "gs_index": -1,
        "defaultCellData": "data2"
    },
    {
        "gs_index": -1,
        "defaultCellData": "data3"
    },
    {
        "gs_index": 1,
        "defaultCellData": ""
    },
    {
        "gs_index": 2,
        "defaultCellData": ""
    },
    {
        "gs_index": -1,
        "defaultCellData": "data4"
    },
    {
        "gs_index": -1,
        "defaultCellData": "data5"
    }
]

Sequence of operations:
1) Replace comma (,) with ... and new line (\n) with ; for each cell
2) CopyCellDataIndex: [0]
    It will copy cell no. 0 data previous data into current current row (If current rowData[0] is invalid)
3) cellMappingConfig:
    It will create a new rowData and copy each cell data as per configuration
    [{
        "gs_index": -1,
        "defaultCellData": "data1"
    },
    {
        "gs_index": 0,
        "defaultCellData": ""
    },
    {
        "gs_index": -1,
        "defaultCellData": "data2"
    }]
    As gs_index = -1, hence it will add "data1" for each row at index 0
    next gs_index = 0, hence it will add rowData[0] for each row at index 1
    next gs_index = -1, hence it will add "data2" for each row at index 2

    "cellMapping": [
        {
            "gs_index": -1,
            "defaultCellData": "",
            "mappingData": [
                {
                    "gs_index": 2,
                    "value": "MURI-CNI",
                    "range": ["ILO", "TRAN", "SSIA", "TUL", "LTMD", "JHMR", "GDBR"]
                }
            ]
        }
    ]

4) appendCellDataIndex: [[3,10], [12,-1]]
    It will append into new row data as per original rowData
    Here, After creating new row using cellMappingConfig it will append cell no. 3 to 10 and 12 to end

