import $S from "../../interface/stack.js";
import Config from "./Config";
import DataHandler from "./DataHandler";
import DataHandlerV2 from "./DataHandlerV2";
// // import FormHandler from "./forms/FormHandler";
// import TemplateHandler from "./template/TemplateHandler";
// import ApiHandler from "./api/ApiHandler";

// // import Api from "../../common/Api";
// import AppHandler from "../../common/app/common/AppHandler";
// import CommonConfig from "../../common/app/common/CommonConfig";
// import CommonDataHandler from "../../common/app/common/CommonDataHandler";
// import DBViewDataHandler from "../../common/app/common/DBViewDataHandler";
// // import DisplayUploadedFiles from "./pages/DisplayUploadedFiles";
// // import DisplayPage from "./pages/DisplayPage";

var TrackPlan;

(function($S){
TrackPlan = function(arg) {
    return new TrackPlan.fn.init(arg);
};
TrackPlan.fn = TrackPlan.prototype = {
    constructor: TrackPlan,
    init: function(arg) {
        this.arg = arg;
        return this;
    }
};

$S.extendObject(TrackPlan);
TrackPlan.extend({
    _getInputField: function(pageName, cell, track, rowIndex, colIndex) {
        var inputField = [], value;
        if (pageName === Config.edit_image) {
            if ($S.isObject(cell) && $S.isObject(cell["text"]) && $S.isStringV2(cell["text"]["filename"])) {
                value = cell["text"]["filename"].split(".")[0];
            } else {
                value = "";
            }
            inputField.push({"tag": "inputV2", "name": rowIndex+"-"+colIndex, className: "track-plan-input", "value": value});
        }
        return inputField;
    }
});
TrackPlan.extend({
    _getImgPath: function(pathMapping, filename) {
        var pathMappingObj = DataHandler.getAppData("path-mapping", {});
        if (!$S.isStringV2(pathMapping)) {
            return filename;
        }
        if ($S.isObject(pathMappingObj) && $S.isStringV2(pathMappingObj[pathMapping])) {
            return pathMappingObj[pathMapping] + filename;
        }
        return filename;
    },
    _getTdField: function(pageName, track, defaultTrack, rowIndex, colIndex) {
        var tdField = [];
        if ($S.isArray(track) && rowIndex < track.length) {
            if ($S.isArray(track[rowIndex]) && colIndex < track[rowIndex].length) {
                if ($S.isObject(track[rowIndex][colIndex])) {
                    if ($S.isObject(track[rowIndex][colIndex]["text"])) {
                        if (track[rowIndex][colIndex]["text"]["tag"] === "img") {
                            if (track[rowIndex][colIndex]["text"]["filename"]) {
                                track[rowIndex][colIndex]["text"]["src"] = this._getImgPath(track[rowIndex][colIndex]["path-mapping"], track[rowIndex][colIndex]["text"]["filename"]);
                            }
                        }
                        if ($S.isStringV2(track[rowIndex][colIndex]["text"]["text"])) {
                            tdField.push(track[rowIndex][colIndex]["text"], {"tag": "span", "className": "img-text", "text": track[rowIndex][colIndex]["text"]["text"]});
                            tdField.push(this._getInputField(pageName, track[rowIndex][colIndex], track, rowIndex, colIndex));
                            return tdField;
                        }
                    }
                    tdField.push(track[rowIndex][colIndex]["text"]);
                    tdField.push(this._getInputField(pageName, track[rowIndex][colIndex], track, rowIndex, colIndex));
                    return tdField;
                }
            }
        }
        tdField.push(defaultTrack);
        tdField.push(this._getInputField(pageName, null, track, rowIndex, colIndex));
        return tdField;
    },
    _getTdClass: function(pageName, rowIndex, colIndex, width, height) {
        var tdClass = pageName + " track-plan-td r-" + rowIndex + " c-" + colIndex + " w-" + width + "-px h-" + height + "-px";
        return tdClass;
    },
    _getRowSpan: function(track, rowIndex, colIndex) {
        if ($S.isArray(track) && rowIndex < track.length) {
            if ($S.isArray(track[rowIndex]) && colIndex < track[rowIndex].length) {
                if ($S.isObject(track[rowIndex][colIndex]) && $S.isNumeric(track[rowIndex][colIndex]["rowSpan"])) {
                    return track[rowIndex][colIndex]["rowSpan"];
                }
            }
        }
        return 1;
    },
    _getColSpan: function(track, rowIndex, colIndex) {
        if ($S.isArray(track) && rowIndex < track.length) {
            if ($S.isArray(track[rowIndex]) && colIndex < track[rowIndex].length) {
                if ($S.isObject(track[rowIndex][colIndex]) && $S.isNumeric(track[rowIndex][colIndex]["colSpan"])) {
                    return track[rowIndex][colIndex]["colSpan"];
                }
            }
        }
        return 1;
    },
    getTrackPlanData: function(pageName) {
        var renderData = [];
        var dimension = DataHandler.getAppData("dimension", []);
        var cellSize = DataHandler.getAppData("cell-size", []);
        var track = this.getTrackData();
        var defaultTrack = DataHandler.getAppData("defaultCell", {});
        
        var preCheck = false;
        var table, row, col, i, j;
        if ($S.isArray(dimension) && $S.isArray(cellSize) && dimension.length === 2 && cellSize.length === 2) {
            if ($S.isNumber(dimension[0]) && $S.isNumber(dimension[1]) && $S.isNumber(cellSize[0]) && $S.isNumber(cellSize[1])) {
                if (dimension[0] > 0 && dimension[1] > 0 && cellSize[0] > 0 && cellSize[1] > 0) {
                    dimension[0] = Math.trunc(dimension[0]);
                    dimension[1] = Math.trunc(dimension[1]);
                    cellSize[0] = Math.trunc(cellSize[0]);
                    cellSize[1] = Math.trunc(cellSize[1]);
                    preCheck = true;
                }
            }
        }
        if (preCheck) {
            table = {"tag": "table.tbody", "text": []};
            for (i=0; i<dimension[0]; i++) {
                row = {"tag": "tr", "className": "track-plan-tr r-" + i, "text": []};
                for (j=0;j<dimension[1]; j++) {
                    col = {"tag": "td", rowSpan: this._getRowSpan(track, i, j), colSpan: this._getColSpan(track, i, j), "className": this._getTdClass(pageName, i, j, cellSize[0], cellSize[1]), "text": this._getTdField(pageName, track, defaultTrack, i, j)};
                    row.text.push(col);
                }
                table.text.push(row);
            }
            renderData.push(table);
        }
        return renderData;
    },
    generateTrackPlanEditPage: function(pageName) {
        var renderData = [];
        var dimension = DataHandler.getAppData("dimension", []);
        var cellSize = DataHandler.getAppData("cell-size", []);
        var track = this.getTrackData();
        var defaultTrack = DataHandler.getAppData("defaultCell", {});

        var preCheck = false;
        var table, row, col, i, j;
        if ($S.isArray(dimension) && $S.isArray(cellSize) && dimension.length === 2 && cellSize.length === 2) {
            if ($S.isNumber(dimension[0]) && $S.isNumber(dimension[1]) && $S.isNumber(cellSize[0]) && $S.isNumber(cellSize[1])) {
                if (dimension[0] > 0 && dimension[1] > 0 && cellSize[0] > 0 && cellSize[1] > 0) {
                    dimension[0] = Math.trunc(dimension[0]);
                    dimension[1] = Math.trunc(dimension[1]);
                    cellSize[0] = Math.trunc(cellSize[0]);
                    cellSize[1] = Math.trunc(cellSize[1]);
                    preCheck = true;
                }
            }
        }
        if (preCheck) {
            table = {"tag": "table.tbody", "text": []};
            for (i=0; i<dimension[0]; i++) {
                row = {"tag": "tr", "className": "track-plan-tr r-" + i, "text": []};
                for (j=0;j<dimension[1]; j++) {
                    col = {"tag": "td", rowSpan: this._getRowSpan(track, i, j), colSpan: this._getColSpan(track, i, j), "className": this._getTdClass(pageName, i, j, cellSize[0], cellSize[1]), "text": this._getTdField(pageName, track, defaultTrack, i, j)};
                    row.text.push(col);
                }
                table.text.push(row);
            }
            renderData.push(table);
        }
        return renderData;
    },
});
TrackPlan.extend({
    generateTrackPlanPage: function(pageName, renderData) {
        return renderData;
    },
    updateTrackData: function(rowIndex, colIndex, filename) {
        var tableName = DataHandler.getAppData("trackDataTable", "");
        var tableData = DataHandlerV2.getTableData(tableName);
        var isNotFound = true;
        if ($S.isArray(tableData)) {
            for (var i=0; i<tableData.length; i++) {
                if (!$S.isObject(tableData[i])) {
                    continue;
                }
                if (tableData[i]["rowIndex"] === rowIndex && tableData[i]["colIndex"] === colIndex) {
                    tableData[i]["filename"] = filename + ".bmp";
                    isNotFound = false;
                    break;
                }
            }
            if (isNotFound) {
                tableData.push({tableName: tableName, tag: "img", "path-mapping": "bitmap-2", rowIndex: rowIndex, colIndex: colIndex, filename: filename+".bmp"});
            }
        }
        DataHandlerV2.updateTableData(tableName, tableData);
    },
    getTrackData: function() {
        var tableName = DataHandler.getAppData("trackDataTable", "");
        var trackData = [];
        var tableData, i, j, rowData, colData, rowIndex, colIndex, pathMapping;
        var lastColIndex = -1, lastRowIndex = -1;
        if ($S.isStringV2(tableName)) {
            tableData = DataHandlerV2.getTableData(tableName);
            if ($S.isArray(tableData)) {
                for (i=0; i<tableData.length; i++) {
                    if (!$S.isObject(tableData[i])) {
                        continue;
                    }
                    rowIndex = tableData[i]["rowIndex"];
                    colIndex = tableData[i]["colIndex"];
                    pathMapping = tableData[i]["path-mapping"];
                    if ($S.isNumeric(rowIndex)) {
                        rowIndex = Math.trunc(rowIndex * 1);
                        if (colIndex === "auto") {
                            if (lastRowIndex === rowIndex) {
                                colIndex = lastColIndex+1;
                            } else {
                                colIndex = 0;
                            }
                        } else if ($S.isNumeric(colIndex)) {
                            colIndex = Math.trunc(colIndex * 1);
                        }
                        lastRowIndex = rowIndex;
                        lastColIndex = colIndex;
                        if (rowIndex >= trackData.length) {
                            for (j=0; j<rowIndex+1; j++) {
                                trackData.push([]);
                            }
                        }
                        rowData = trackData[rowIndex];
                        if (!$S.isArray(rowData)) {
                            rowData = [];
                        }
                        if (colIndex >= rowData.length) {
                            for (j=0; j<colIndex+1; j++) {
                                rowData.push({});
                            }
                        }
                        colData = rowData[colIndex];
                        if (!$S.isObject(colData)) {
                            colData = {};
                        }
                        colData["path-mapping"] = pathMapping;
                        colData["rowSpan"] = tableData[i]["rowSpan"];
                        colData["colSpan"] = tableData[i]["colSpan"];
                        colData["text"] = {"tag": "img", "filename": tableData[i]["filename"], "text": tableData[i]["text"]};
                        trackData[rowIndex][colIndex] = colData;
                    }
                }
            }
        }
        return trackData;
    }
});

})($S);

export default TrackPlan;
