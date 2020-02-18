var Domino = (function() {
	var maxRow = 3, maxCol = 5, validateDomino = false;
	function isValidIndex(r, c) {
		if (typeof r == "number" && !isNaN(r)) {
			if (typeof c == "number" && !isNaN(c)) {
				if (r >=0 && r<maxRow && c>=0 && c<maxCol) {
					return true;
				}
			}
		}
		return false;
	}
	function isValidDominoData(d) {
		if (validateDomino == false) {
			return true;
		}
		var validRowCount = 0;
		var validColCount = 0, validColCountStatus = false;
		var isRowIncremented = false;
		for (var i = 0; i < d.data.length; i++) {
			validColCount = 0;
			isRowIncremented = false;
			for (var j = 0; j < d.data[i].length; j++) {
				if (d.data[i][j] !== null) {
					validColCount++;
					if (isRowIncremented == false) {
						validRowCount++;
						isRowIncremented = true;
					}
				}
				if (validColCount == 5) {
					validColCountStatus = true;
				}
			}
		}
		if (validRowCount == maxRow && validColCountStatus) {
			return true;
		}
		return false;
	};
	function Domino(name) {
		var data = [];
		for (var i = 0; i < maxRow; i++) {
			data.push([]);
			for (var j = 0; j < maxCol; j++) {
				data[i].push(null);
			}
		}
		this.name = name;
		this.data = data;
		this.isValidData = isValidDominoData(this);
		return this;
	}
	Domino.prototype.setData = function(r, c, data) {
		if (isValidIndex(r,c)) {
			if (this.data[r][c] !== null) {
				var logText = "Data already present.";
				throw logText;
			}
			this.data[r][c] = data;
		} else {
			var logText = "Invalid index: r=" + r+", c="+c;
			console.log("Domino name: " + this.name);
			throw logText;
		}
		this.isValidData = isValidDominoData(this);
		return true;
	};
	Domino.prototype.setRowData = function(r, data) {
		if (typeof data == "object" && !isNaN(data.length)) {
			for (var i = 0; i < data.length; i++) {
				this.setData(r, i, data[i]);
			}
		}
		return true;
	};
	Domino.prototype.getData = function() {
		var response = [];
		for (var i = 0; i < this.data.length; i++) {
			response.push([]);
			for (var j = 0; j < this.data[i].length; j++) {
				if (this.data[i][j] !== null) {
					response[i].push(this.data[i][j]);
				}
			}
		}
		if (this.isValidData) {
			return response;
		}
		console.log("Domino name: " + this.name);
		console.log(this.data);
		var logText = "Invalid Domino Data.";
		throw logText;
	};
	Domino.prototype.isValidDomino = function() {
		return this.isValidData;
	};
	Domino.prototype.enableValidate = function() {
		validateDomino = true;
		return validateDomino;
	};
	Domino.prototype.disableValidate = function() {
		validateDomino = false;
		return validateDomino;
	};
	Domino.prototype.getValidateStatus = function() {
		return validateDomino;
	};
	
	return Domino;
})();
