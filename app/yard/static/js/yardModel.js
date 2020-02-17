(function($M) {
var yardComponent = {
	"tc": [
		[
			'<button class="btn'+'">1</button>',
			'<button class="btn'+'">2</button>',
			'<button class="btn'+'">3</button>',
			'<button class="btn'+'">4</button>',
			'<button class="btn'+'">5</button>'
		],
		[
			'<button class="btn'+'">6</button>',
			'<button class="btn'+'">7</button>',
			'<button class="btn'+'">8</button>',
			'<button class="btn'+'">9</button>',
			'<button class="btn'+'">10</button>'
		],
		[
			'<button class="btn'+'">11</button>',
			'<button class="btn'+'">12</button>',
			'<button class="btn'+'">13</button>',
			'<button class="btn'+'">14</button>',
			'<button class="btn'+'">15</button>'
		]
	]
};
var firstRow = {
	"left-top": [
		[
			'','','','',
			'<span class="label label-primary">|</span>'
		],
		[
			'','','','',
			'<span class="label label-primary">|</span>'
		],
		[
			'','','','',
			'<span class="label label-primary">|</span>'
		]
	],
	"8-point-top": [
		[
			'<span class="label label-primary">--</span>'
		],
		[
			'<button class="evt btn slat tpr 8-TPR-A" value="8-TPR-A"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn slat tpr 8-TPR-A" value="8-TPR-A"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn point-change-request" value="8-WNR=1,RWWNR=1"><span class="badge">R</span></button>',
			'<button class="evt btn pink tpr 8-TPR-1" value="8-TPR-1"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn slat tpr 8-TPR-2" value="8-TPR-2"><span class="badge">&nbsp;</span></button>'
		],
		[
			'<span class="label label-primary">--</span>',
			'',
			'',
			'<span class="badge label label-default indication 8-WFK">&nbsp;</span>',
			'<button class="evt btn tpr circle 8-TPR-5" value="8-TPR-5"><span class="badge">&nbsp;</span></button>'
		]
	],
	"s14-tpr": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt pink btn tpr 8-TPR-3" value="8-TPR-3"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 8-TPR-B" value="8-TPR-B"><span class="badge">&nbsp;</span></button>',
			'<button class="btn'+'"><span class="badge">S14</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			'',
			'',
			'<span id="s14-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>',
			'<span id="s14-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span class="signal-no">S14</span>'
		]
	],
	"l-tpr-1": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn'+'"><span class="badge">L2</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"l-tpr-2": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn'+'"><span class="badge">L3</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr L-TPR-1" value="L-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"s2-tpr": [
		[
			'<span class="signal-no">S2</span>',
			'<span id="s2-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span id="s2-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>'
		],
		[
			'<button class="evt slat btn tpr 9-TPR-A" value="9-TPR-A"><span class="badge">&nbsp;</span></button>',
			'<button class="btn'+'"><span class="badge">S2</span></button>',
			'<button class="evt pink btn tpr 9-TPR-1" value="9-TPR-1"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 9-TPR-2" value="9-TPR-2"><span class="badge">&nbsp;</span></button>',
			'<button class="evt pink btn tpr 9-TPR-3" value="9-TPR-3"><span class="badge">&nbsp;</span></button>'
		],
		[
			'','','',
			'<button class="evt btn tpr circle 9-TPR-5" value="9-TPR-5"><span class="badge">&nbsp;</span></button>',
			'<span class="badge label label-default indication 9-WFK">&nbsp;</span>'
		]
	],
	"right-top": [
		[
			'','',
			'<span class="label label-primary">--</span>',
			'<span class="label label-primary">|</span>'
		],
		[
			'<button class="evt btn point-change-request" value="9-WNR=1,RWWNR=1"><span class="badge">R</span></button>',
			'<button class="evt slat btn tpr 9-TPR-B" value="9-TPR-B"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 9-TPR-B" value="9-TPR-B"><span class="badge">&nbsp;</span></button>',
			'<span class="label label-primary">|</span>',
			''
		],
		[
			'','',
			'<span class="label label-primary">--</span>',
			'<span class="label label-primary">|</span>'
		]
	]
};
var secondRow = {
	"8-point-mid": [
		[
			'','','',
			'<button class="evt btn tpr circle 8-TPR-5" value="8-TPR-5"><span class="badge">&nbsp;</span></button>',
			''
		],
		[
			'',
			'',
			'<button class="evt btn tpr circle" value="8-TPR-5"><span class="badge">8</span></button>'
		],
		[
			'',
			'<button class="evt btn tpr circle 8-TPR-5" value="8-TPR-5"><span class="badge">&nbsp;</span></button>',
		]
	],
	"9-point-mid-1": [
		[
			'','','','',
			'<button class="evt btn tpr circle 9-TPR-5" value="9-TPR-5"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		],
		[
			''
		]
	],
	"9-point-mid": [
		[
			''
		],
		[
			'<button class="evt btn tpr circle" value="9-TPR-5"><span class="badge">9</span></button>',
			'','','',''
		],
		[
			'',
			'<button class="evt btn tpr circle 9-TPR-5" value="9-TPR-5"><span class="badge">&nbsp;</span></button>'
		]
	]
};
var thirdRow = {
	"1-tpr": [
		[
			'<span class="signal-no">S1</span>',
			'<span id="s1-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span id="s1-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>',
			'<span id="s1-green" class="badge  signal signal-green alert-success">&nbsp;</span>',
			''
		],
		[
			'<button class="evt blue btn tpr 1-TPR" value="1-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr 1-TPR" value="1-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn"><span class="badge">S1</span></button>',
			'<button class="evt blue btn tpr 1-TPR" value="1-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr 1-TPR" value="1-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			'<button class="btn'+'"></button>'
		]
	],
	"16-tpr": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt green btn tpr 16-TPR" value="16-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt green btn tpr 16-TPR" value="16-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn"><span class="badge">S16</span></button>',
			'<button class="evt green btn tpr 16-TPR" value="16-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt green btn tpr 16-TPR" value="16-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			'',
			'',
			'<span id="s16-green" class="badge  signal signal-green alert-success">&nbsp;</span>',
			'<span id="s16-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span class="signal-no">S16</span>'
		]
	],
	"8-tpr": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt btn blue tpr 8-TPR" value="8-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn blue tpr 8-TPR" value="8-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn"><span class="badge">8</span></button>',
			'<button class="evt btn slat tpr 8-TPR-C" value="8-TPR-C"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn pink tpr 8-TPR-7" value="8-TPR-7"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"8c-tpr": [
		[
			'<button class="evt btn tpr circle 8-TPR-5" value="8-TPR-5"><span class="badge">&nbsp;</span></button>',
			'<span class="badge label label-default indication 8-WFK">&nbsp;</span>'
		],
		[
			'<button class="evt btn slat tpr 8-TPR-8" value="8-TPR-8"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn pink tpr 8-TPR-9" value="8-TPR-9"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn point-change-request" value="8-WNR=1,NWWNR=1"><span class="badge">N</span></button>',
			'<button class="evt btn slat tpr 8-TPR-D" value="8-TPR-D"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn blue tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"s15-tpr": [
		[
			''
		],
		[
			'<button class="evt btn blue tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn blue tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr circle M-TPR-1" value="M-TPR"><span class="badge">S15</span></button>',
			'<button class="evt btn blue tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt btn blue tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			'<span id="s15-green" class="badge  signal signal-green alert-success">&nbsp;</span>',
			'<span id="s15-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>',
			'<span id="s15-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span class="signal-no">S15</span>'
		]
	],
	"m-tpr-1": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr circle M-TPR-1" value="M-TPR"><span class="badge">M2</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"m-tpr-2": [
		[
			'<button class="btn'+'"></button>'
		],
		[
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr circle M-TPR-1" value="M-TPR"><span class="badge">M3</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"s3-tpr": [
		[
			'<span class="signal-no">S3</span>',
			'<span id="s3-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span id="s3-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>',
			'<span id="s3-green" class="badge  signal signal-green alert-success">&nbsp;</span>',
		],
		[
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr circle M-TPR-1" value="M-TPR"><span class="badge">S3</span></button>',
			'<button class="evt blue btn tpr M-TPR-1" value="M-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 9-TPR-C" value="9-TPR-C"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"9d-tpr": [
		[
			'',
			'<span class="badge label label-default indication 9-WFK">&nbsp;</span>',
			'<button class="evt btn tpr circle 9-TPR-5" value="9-TPR-5"><span class="badge">&nbsp;</span></button>',
		],
		[
			'<button class="evt btn point-change-request" value="9-WNR=1,NWWNR=1"><span class="badge">N</span></button>',
			'<button class="evt pink btn tpr 9-TPR-7" value="9-TPR-7"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 9-TPR-8" value="9-TPR-8"><span class="badge">&nbsp;</span></button>',
			'<button class="evt pink btn tpr 9-TPR-9" value="9-TPR-9"><span class="badge">&nbsp;</span></button>',
			'<button class="evt slat btn tpr 9-TPR-D" value="9-TPR-D"><span class="badge">&nbsp;</span></button>'
		],
		[
			''
		]
	],
	"9-tpr": [
		[
			'','','',
			'<span class="signal-no">S4</span>',
			'<span id="s4-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
		],
		[
			'<button class="evt blue btn tpr 9-TPR" value="9-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn"><span class="badge">9</span></button>',
			'<button class="evt blue btn tpr 9-TPR" value="9-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt green btn tpr 4-TPR" value="4-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn"><span class="badge">4</span></button>'
		],
		[
			''
		]
	],
	"4-tpr": [
		[
			'<span id="s4-green" class="badge  signal signal-green alert-success">&nbsp;</span>'
		],
		[
			'<button class="evt green btn tpr 4-TPR" value="4-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr 13-TPR" value="13-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="btn'+'"><span class="badge">13</span></button>',
			'<button class="evt blue btn tpr 13-TPR" value="13-TPR"><span class="badge">&nbsp;</span></button>',
			'<button class="evt blue btn tpr 13-TPR" value="13-TPR"><span class="badge">&nbsp;</span></button>'
		],
		[
			'',
			'<span id="s13-green" class="badge  signal signal-green alert-success">&nbsp;</span>',
			'<span id="s13-yellow" class="badge  signal signal-yellow alert-warning">&nbsp;</span>',
			'<span id="s13-red" class="badge  signal signal-red alert-danger">&nbsp;</span>',
			'<span class="signal-no">S13</span>'
		]
	]
};
Object.assign(yardComponent, firstRow);
Object.assign(yardComponent, secondRow);
Object.assign(yardComponent, thirdRow);

var YardModel = (function() {
	function Model() {}
	Model.prototype.getYardComponent = function(name) {
		if (yardComponent[name]) {
			return yardComponent[name];
		}
		return [];
	};
	Model.prototype.getTableHtml = function(name) {
		var yardData = this.getYardComponent(name);
		var table = $M.getTable(yardData, name);
		return table.getHtml();
	};
	Model.prototype.enableDomino = function () {
		var domino = new Domino();
		domino.enableValidate();
		Model.prototype.getTableHtml = function(name) {
			var yardData = this.getYardComponent(name);
			/* Checking data intigrity.*/
			var d = new Domino(name);
			for (var i = 0; i < yardData.length; i++) {
				d.setRowData(i, yardData[i]);
			}
			yardData = d.getData();
			/* Checking data intigrity End.*/
			var table = $M.getTable(yardData, name);
			return table.getHtml();
		};
	};
	return Model;
})();
var YM = new YardModel();
var verifyFromDomino = true;
if (verifyFromDomino) {
	YM.enableDomino();
}
$M.extend({
    getYardModel: function() {
    	return YM;
    }
});
})($M);
