(this.webpackJsonpreactapp=this.webpackJsonpreactapp||[]).push([[0],{1:function(t,e){(function(e){var n=function t(e,n){return new t.fn.init(e,n)};n.fn=n.prototype={constructor:n,init:function(t,e){return this}};var r,i,o=[],a=0;function u(t){return"string"==typeof t}function s(t){return"undefined"!=typeof t&&null!=t&&"object"==typeof t&&!isNaN(t.length)}function c(t){return"undefined"!=typeof t&&null!=t&&!("object"!=typeof t||!isNaN(t.length))}function l(t){return"number"==typeof t&&!isNaN(t)}function f(t){return"boolean"==typeof t}function h(t){return"undefined"!=typeof t&&"function"==typeof t}function p(t,e,n){var r=null;switch(e){case"+":r=t+n;break;case"-":r=t-n;break;case"*":r=t*n;break;case"/":r=0!=n?t/n:0}return r}function g(t,e,n){var r=null;switch(e){case"*":case"&&":case"&":r=t&&n;break;case"||":case"|":case"#":case"+":r=t||n;break;case"~":r=!t}return r}function d(t,e){return l(t)&&l(e)?Math.floor(Math.random()*(e-t+1))+t:d(1e4,99999)}var v=function(){var t;function e(){t=new Date,this.now=t}return e.prototype.formateDateTime=function(e,n,r){var i="",o=(i=r&&r.constructor&&"Date"==r.constructor.name?r:t).getFullYear(),a=i.getMonth()+1,u=i.getDate(),s=i.getHours(),c=i.getMinutes(),l=i.getSeconds(),f=i.getMilliseconds(),h={};return h.YYYY=o,h.MM=a<=9?"0"+a:a,h.DD=u<=9?"0"+u:u,h.hh=s<=9?"0"+s:s,h.mm=c<=9?"0"+c:c,h.ss=l<=9?"0"+l:l,f<=9?f="00"+f:f<=99&&(f="0"+f),h.ms=f,function(t,e,n){var r="",i=e?e.split(n):[];if(t)for(var o=0;o<i.length;o++)t[i[o]]?r+=t[i[o]]:r+=i[o];return r}(h,e,n)},e.prototype.getDateTime=function(t,e){var n=new Date;return this.formateDateTime(t,e,n)},e.prototype.getDayNumberTimeFromSeconds=function(t,e,n){var r="",i=e?e.split(n):[],o={},a="000"+Math.ceil(t/86400),u="00"+Math.floor(t/3600%24),s="00"+Math.floor(t/60%60),c="00"+Math.floor(t%60);if(o.ddd=a.substring(a.length-3),o.hh=u.substring(u.length-2),o.mm=s.substring(s.length-2),o.ss=c.substring(c.length-2),o)for(var l=0;l<i.length;l++)o[i[l]]?r+=o[i[l]]:r+=i[l];return r},e}(),y=function(){var t=localStorage,e=["item1"],n=["local_storage_support_test","length","key","getItem","setItem","removeItem","clear"];function r(t){return!(n.indexOf(t)>=0||e.indexOf(t)<0)}function i(e){var n={status:!1,value:null};if(t&&e&&r(e)){var i=t.getItem(e);i&&(n.status=!0,n.value=i)}return n}return{getAll:function(){var e={status:!0,count:0,value:{}};for(var n in t)if(r(n)){var o=i(n);o.status&&(e.value[n]=o.value,e.count++)}return e},get:i,set:function(e,n){var i={status:!1};return t&&e&&r(e)&&(t.setItem(e,n),i.status=!0),i},remove:function(e){var n={status:!1};return t&&e&&r(e)&&(t.removeItem(e),n.status=!0),n},clear:function(){var n={status:!1};if(t){for(var r=0;r<e.length;r++)t.removeItem(e[r]);n.status=!0}return n}}},m=function t(){return new t.fn.init};m.fn=m.prototype={constructor:m,init:function(){return this}},function(t){t.fn.init.prototype=t.fn,t.extend=t.fn.extend=function(e){if("object"==typeof e&&isNaN(e.length))for(var n in e)"function"==typeof e[n]&&("function"==typeof t[n]&&console.log('Method "'+t.name+"."+n+'" is overwritten.'),t[n]=e[n]);return t}}(m),m.extend({getOrigin:function(t){var e="";try{e=t.origin}catch(n){}return e}});var O=function(){var t={};function e(e){var n=e.split("?");if(n.length&&(t.hrefPath=n[0]),n.length>1){var r=n[1].split("&");if(r.length>0)for(var i=0;i<r.length;i++){var o=r[i].split("=");o.length>1&&(t[o[0]]=o[1])}}}return e.prototype.getData=function(e,n){return t[e]?t[e]:n},e}(),T=function(){var t=Date.now();function e(){this.dateTimeEnable=!1,this.format="",this.splitter="",this.logKey=d(1e4,99999)}return e.prototype.getLoggerId=function(){return t},e.prototype.resetLoggerKey=function(t){return this.logKey=n.getRandomNumber(1e4,99999),this.logKey},e.prototype.updateLoggerKey=function(t){return this.logKey=t,this.logKey},e.prototype.setLoggerKeyUnique=function(){return this.logKey=n.getUniqueNumber(),this.logKey},e.prototype.setDateTimeState=function(t,e,n){this.format=e,this.splitter=n,this.dateTimeEnable=1==t},e.prototype.logInApi=function(t,e){console.log(this.logKey+":"+t)},e.prototype.log=function(t,e){var n=this.logKey+":";u(e)&&(n+=e+":"),this.dateTimeEnable&&(n+=(new v).getDateTime(this.format,this.splitter)+":"),console.log(n+t)},e}(),_=new T,N=function(){var t=[];function e(e){this._STACK="boolean"==typeof e&&e?t:[],this._TOP=-1}return e.prototype.reset=function(){this._STACK=[],this._TOP=-1;for(var t=0;t<5e5;t++)this._STACK.push(0);return!0},e.prototype.push=function(t){if(this._TOP>=499999)throw _.log("stack over flow"),"stack over flow";return this._TOP=this._TOP+1,this._STACK[this._TOP]=t,1},e.prototype.pop=function(){var t=0;if(this._TOP<0)throw _.log("stack under flow"),"stack under flow";return t=this._STACK[this._TOP],this._TOP=this._TOP-1,t},e.prototype.getTop=function(){return this._TOP},e.prototype.getAll=function(){for(var t=[],e=0;e<=this._TOP;e++)t.push(this._STACK[e]);return t},e.prototype.print=function(){for(var t=0;t<=this._TOP;t++)_.log(t+"-"+this._STACK[t]);return 0},e}(),b=function(){var t=[];function e(){this._FRONT=-1,this._BACK=-1}return e.prototype.Enque=function(e){return 499999==this._BACK?(_.log("Que full"),0):(-1==this._FRONT&&(this._FRONT=0),this._BACK++,t[this._BACK]=e,1)},e.prototype.Deque=function(){var e;return-1==this._FRONT||this._FRONT>this._BACK?(_.log("Que under flow"),0):(e=t[this._FRONT],this._FRONT++,e)},e.prototype.clear=function(){return this._FRONT=-1,this._BACK=-1,1},e.prototype.getAll=function(){for(var e=[],n=this._FRONT;n<=this._BACK;n++)e.push(t[n]);return e},e.prototype.getSize=function(){return this._BACK-this._FRONT+1},e}(),w=function(){function t(t){this.capacity=50,this.que=[],l(t)&&t>0&&t<=5e5&&(this.capacity=t);for(var e=0;e<this.capacity;e++)this.que.push(0);this._FRONT=-1,this._BACK=-1}return t.prototype.clear=function(){return this._FRONT=-1,this._BACK=-1,1},t.prototype.isFull=function(){return this._FRONT==this._BACK+1||0==this._FRONT&&this._BACK==this.capacity-1},t.prototype.isEmpty=function(){return-1==this._FRONT},t.prototype.Enque=function(t){return this.isFull()?(_.log("CirQue full"),0):(-1==this._FRONT?(this._FRONT=0,this._BACK=0):this._BACK==this.capacity-1&&0!=this._FRONT?this._BACK=0:this._BACK++,this.que[this._BACK]=t,1)},t.prototype.EnqueV2=function(t){return-1==this._FRONT?(this._FRONT=0,this._BACK=0):this._BACK==this.capacity-1&&0!=this._FRONT?this._BACK=0:this.isFull()?(this._BACK=this._FRONT,this._FRONT=(this._FRONT+1)%this.capacity):this._BACK++,this.que[this._BACK]=t,1},t.prototype.Deque=function(){var t;return this.isEmpty()?(_.log("CirQue under flow"),-1):(t=this.que[this._FRONT],this._FRONT==this._BACK?(this._FRONT=-1,this._BACK=-1):this._FRONT=(this._FRONT+1)%this.capacity,n.clone(t))},t.prototype.getAll=function(){var t=[];if(this.isEmpty())return t;if(this._BACK>=this._FRONT)for(var e=this._FRONT;e<=this._BACK;e++)t.push(this.que[e]);else{for(var r=this._FRONT;r<this.capacity;r++)t.push(this.que[r]);for(var i=0;i<=this._BACK;i++)t.push(this.que[i])}return n.clone(t)},t.prototype.getSize=function(){return this.isEmpty()?0:this._BACK>=this._FRONT?this._BACK-this._FRONT+1:this.capacity-this._FRONT+this._BACK+1},t.prototype.getDetails=function(){var t={};return t.capacity=this.capacity,t.size=this.getSize(),t.front=this._FRONT,t.back=this._BACK,t.isFull=this.isFull(),t.isEmpty=this.isEmpty(),t.items=this.getAll(),t.que=n.clone(this.que),t},t}(),C=function(){function t(t){this.data=t,this.right=null,this.left=null}return t.prototype.insertData=function(e,n){return 0==l(n)?e:0==l(e.data)?(e.data=n,e):n<e.data?null===e.left?(e.left=new t(n),e.left):this.insertData(e.left,n):null===e.right?(e.right=new t(n),e.right):this.insertData(e.right,n)},t.prototype.getInOrder=function(t,e){return null!=t&&(this.getInOrder(t.left,e),e.push(t),this.getInOrder(t.right,e)),e},t.prototype.getPostOrder=function(t,e){return null!=t&&(this.getInOrder(t.left,e),this.getInOrder(t.right,e),e.push(t)),e},t.prototype.getPreOrder=function(t,e){return null!=t&&(e.push(t),this.getInOrder(t.left,e),this.getInOrder(t.right,e)),e},t}(),A=function(){function t(t){this.data=t,this.left=null,this.right=null}return t.prototype.insertLeft=function(e,n){var r=new t(n);e?e.left=r:e=r},t.prototype.insertNodeInLeft=function(t,e){t?t.left=e:t=e},t.prototype.insertRight=function(e,n){var r=new t(n);e?e.right=r:e=r},t.prototype.getLeftChild=function(t){return t&&t.left?t.left:t},t.prototype.getRightChild=function(t){return t&&t.right?t.right:t},t.prototype.getPostOrder=function(t){var e=[];return null==t||(e=(e=e.concat(this.getPostOrder(t.left))).concat(this.getPostOrder(t.right))).push(t.data),e},t.prototype.getInOrder=function(t){var e=[];return null==t?e:((e=e.concat(this.getInOrder(t.left))).push(t.data),e=e.concat(this.getInOrder(t.right)))},t.prototype.getPreOrder=function(t){var e=[];return null==t?e:(e.push(t.data),e=(e=e.concat(this.getPreOrder(t.left))).concat(this.getPreOrder(t.right)))},t.prototype.createBinaryTree=function(e){var n,r=new N,i=new t("");r.push(i),n=i;for(var o=0;o<e.length;o++)if("("==e[o])this.insertLeft(n,""),r.push(n),n=this.getLeftChild(n);else if(")"==e[o])n=r.pop();else if(["+","-","*","/","&&","&","||","|","#"].indexOf(e[o])>=0){var a=e[o];if(""!=n.data){var u=n.right;this.insertRight(n,a),n=this.getRightChild(n),this.insertNodeInLeft(n,u)}else n.data=a;this.insertRight(n,""),r.push(n),n=this.getRightChild(n)}else["~"].indexOf(e[o])>=0?(n.data=e[o],o<e.length-1&&(o++,this.insertLeft(n,e[o])),n=r.pop()):(n.data=e[o],n=r.pop());return i},t}(),F=function(){function t(t){for(var e=0,n=0,r=!1,i=!1,o=0;o<t.data.length;o++){n=0,i=!1;for(var a=0;a<t.data[o].length;a++)null!==t.data[o][a]&&(n++,0==i&&(e++,i=!0)),5==n&&(r=!0)}return!(3!=e||!r)}function e(e){for(var n=[],r=0;r<3;r++){n.push([]);for(var i=0;i<5;i++)n[r].push(null)}return this.name=e,this.data=n,this.isValidData=t(this),this}return e.prototype.setData=function(e,n,r){var i;if(!function(t,e){return"number"==typeof t&&!isNaN(t)&&"number"==typeof e&&!isNaN(e)&&t>=0&&t<3&&e>=0&&e<5}(e,n))throw i="Invalid index: r="+e+", c="+n,console.log("Domino name: "+this.name),i;if(null!==this.data[e][n])throw i="Data already present.";return this.data[e][n]=r,this.isValidData=t(this),!0},e.prototype.setRowData=function(t,e){if("object"==typeof e&&!isNaN(e.length))for(var n=0;n<e.length;n++)this.setData(t,n,e[n]);return!0},e.prototype.getData=function(){for(var t=[],e=0;e<this.data.length;e++){t.push([]);for(var n=0;n<this.data[e].length;n++)null!==this.data[e][n]&&t[e].push(this.data[e][n])}if(this.isValidData)return t;throw console.log("Domino name: "+this.name),console.log(this.data),"Invalid Domino Data."},e.prototype.isValidDomino=function(){return this.isValidData},e}();n.fn.init.prototype=n.fn,n.extend=n.fn.extend=function(t){if(c(t))for(var e in t)h(t[e])&&(h(this[e])&&_.log("Method "+e+" is overwritten."),this[e]=t[e]);return this},n.extend({getScriptFileName:function(t){var n="";if("Window"==e){var r=document.getElementsByTagName("script");n=r[r.length-1].src;var i=m.getOrigin(t),o=n.split(i);o.length>1&&(o=(n=o[1]).split("?")).length>1&&(n=o[0])}return n},getScriptFileNameRef:function(t){var e=[];return(e=(e=n.getScriptFileName(t).split("/").filter((function(t,e,n){return""!=t}))).map((function(t,e,n){return e==this.lastIndex?t:t.charAt(0).toUpperCase()}),{lastIndex:e.length-1})).join(".")}}),i=new w(1e3),n.extend({getQue:function(t){return new b},getCirQue:function(t){return new w(t)},getRequestId:function(){return a},getRandomNumber:function(t,e){return d(t,e)},getUniqueNumber:function(){var t=Date.now();return t+=n.getRandomNumber(10,99),i.getAll().indexOf(t)>=0?t=n.getUniqueNumber():i.EnqueV2(t),t}}),r=n.getScriptFileNameRef(),a=n.getUniqueNumber();var R=function(){var t=0,e=0,r=[],i="",o=[];function a(){if("string"!=typeof i){var t=Math.floor(9e3*Math.random())+1e3;i=t.toString()}return function t(e){var n="";if("string"==typeof e&&(n=e),o.indexOf(n)>=0){if(n+="--"+(Math.floor(9*Math.random())+1),o.indexOf(n)>=0)return t(n);o.push(n)}else o.push(n);return n}(i)}function u(t,e,n){var r="";if(["string","number"].indexOf(typeof t)>=0)return t;if(c(t)){var i=t.attr?t.attr:"",o=t.tag?"<"+t.tag+" "+i+">":"",a=t.tag?"</"+t.tag+">":"";r+=o,r+=u(t.text,e,n),r+=a}else if(s(t))for(var l=0;l<t.length;l++)r+=u(t[l],e,n);return r}function f(n,o){var a;if(r=[],t=0,e=0,n&&n.length){for(t=n.length,a=0;a<n.length;a++)r.push([]),n[a]&&n[a].length>e&&(e=n[a].length);for(a=0;a<n.length;a++)for(var u=0;u<e;u++)u>=n[a].length?r[a].push(""):r[a].push(n[a][u])}i=o}return f.prototype.addRowIndex=function(n){l(n)||(n=1),n*=1;for(var i=!1,o=0;o<t;o++)r[o].splice(0,0,n++),i=!0;return i&&e++,n},f.prototype.addColIndex=function(n){r.splice(0,0,[]),l(n)||(n=1),n*=1;for(var i=!1,o=0;o<e;o++)r[0].push(n++),i=!0;return i&&t++,n},f.prototype.updateTableContent=function(n,i,o){return!!(l(n)&&l(i)&&n>=0&&i>=0&&n<t&&i<e)&&(r[n][i]=o,!0)},f.prototype.getHtml=function(){for(var n=a(),i='<table id="'+n+'">',o=0;o<t;o++){i+='<tr id="'+[n,o].join("-")+'" class="'+(o%2?"odd":"even")+'">';for(var s=0;s<e;s++)i+='<td id="'+[n,o,s].join("-")+'" '+(r[o][s]&&r[o][s].parentAttr?r[o][s].parentAttr:"")+">"+u(r[o][s],o,s)+"</td>";i+="</tr>"}return i+="</table>"},f.prototype.getContent=function(){return n.clone(r)},f.prototype.getProcessedTids=function(){for(var t=[],e=0;e<o.length;e++)t.push(o[e]);return t},f.prototype.setProcessedTids=function(t){if(!s(t))return!1;o=[];for(var e=0;e<t.length;e++)"string"==typeof t[e]&&o.push(t[e]);return!0},f.prototype.clearProcessedTids=function(){return this.setProcessedTids([])},f}();n.extend({getStack:function(t){return new N(t)},getLocalStorage:function(){return new y},getDT:function(){return new v},getBT:function(t){return new A(t)},getBST:function(t){return new C(t)},getTable:function(t,e){return new R(t,e)},getDomino:function(t){return new F(t)},getLogger:function(){return new T},log:function(t,e){return _.log(t,e)},logV2:function(t,e){return _.log(e,t)},updateLoggerKey:function(t){_.updateLoggerKey(t)},setLoggerDateTimeState:function(t,e,n){_.setDateTimeState(t,e,n)},isString:function(t){return u(t)},isArray:function(t){return s(t)},isObject:function(t){return c(t)},isFunction:function(t){return h(t)},isNumber:function(t){return l(t)},isNumeric:function(t){return function(t){return!isNaN(t)&&"object"!=typeof t}(t)},isBoolean:function(t){return f(t)},isBooleanTrue:function(t){return f(t)&&1==t},addElAt:function(t,e,n){return function(t,e,n){return s(t)&&l(e)?(e>=t.length?t.push(n):t.splice(e,0,n),1):0}(t,e,n)},isMethodDefined:function(t){return this.isFunction(this[t])},getUrlAttribute:function(t,e,n){return new O(t).getData(e,n)},getPlatform:function(){return e}}),n.extend({clone26032020:function(t){var e=t;if(s(t))e=[].concat(t);else if(c(t))for(var r in e={},t)e[r]=n.clone26032020(t[r]);return e},clone:function(t){if(s(t))return t.map(n.clone);if(c(t)){for(var e={},r=Object.keys(t),i=r.length,o=0;o<i;o++)e[r[o]]=n.clone(t[r[o]]);return e}return t}}),n.extend({calNumerical:function(t){for(var e,n,r,i=new N,o=0;o<t.length;o++)if(n=t[o],isNaN(t[o])){if(!(["+","-","*","/"].indexOf(n)>=0)){var a="Invalid operator or value for numerical calculation: "+n;throw a+=", in postfix:"+t.toString(),_.log(a),a}e=1*i.pop(),r=p(1*i.pop(),n,e),i.push(r)}else i.push(1*t[o]);return i.pop()},calBinary:function(t){for(var e,n,r,i=new N,o=0;o<t.length;o++)if(n=t[o],"boolean"==typeof t[o])i.push(t[o]);else if(["&&","&","*","||","|","#","+"].indexOf(n)>=0)e=i.pop(),r=g(i.pop(),n,e),i.push(r);else{if(!(["~"].indexOf(n)>=0)){var a="Invalid operator or value for binary calculation: "+n;throw a+=", in postfix: "+t.toString(),_.log(a),a}r=g(e=i.pop(),n),i.push(r)}return i.pop()},createPreOrderTree:function(t){var e=new A(""),n=e.createBinaryTree(t);return e.getPreOrder(n)},createInOrderTree:function(t){var e=new A(""),n=e.createBinaryTree(t);return e.getInOrder(n)},createPostOrderTree:function(t){var e=new A(""),n=e.createBinaryTree(t);return e.getPostOrder(n)},generateExpression:function(t){var e,r,i,o,a=new N;if(c(t)){i=t.op,o=t.val;for(var u=0;u<o.length;u++)a.push(o[u]);for(;a.getTop()>0;)(e=a.pop()).val&&(n.generateExpression(e),e=e.exp),(r=a.pop()).val&&(n.generateExpression(r),r=r.exp),a.push("("+r+i+e+")");t.exp=a.pop()}return t},evaluateNumerical:function(t){var e=n.tokenize(t,["(",")","+","-","*","/"]),r=n.createPosixTree(e);return n.calNumerical(r)},evaluateBinary:function(t){for(var e=n.tokenize(t,["(",")","&&","*","||","#","+","~"]),r=n.createPosixTree(e),i=0;i<r.length;i++)if("true"==r[i])r[i]=!0;else{if("false"!=r[i])continue;r[i]=!1}return n.calBinary(r)},evaluateBinaryV2:function(t){for(var e=n.tokenize(t,["(",")","&","*","|","#","+","~"]),r=n.createPosixTree(e),i=0;i<r.length;i++)if("true"==r[i])r[i]=!0;else{if("false"!=r[i])continue;r[i]=!1}return n.calBinary(r)},tokenize:function(t,e){var n=[];if(e&&e.length)for(var r=0;r<e.length;r++)t=t.split(e[r]).join(","+e[r]+",");for(var i,o=t.split(","),a=0;a<o.length;a++)""!=(i=o[a].trim())&&n.push(i);return n}}),n.extend({setSkipValuesFromPosixResult:function(t){if(s(t)){o=[];for(var e=0;e<t.length;e++)["string","number"].indexOf(typeof t[e])>=0&&o.push(t[e])}return!0},createPosixTree:function(t){for(var e=[],r=n.createPostOrderTree(t),i=0;i<r.length;i++)o.indexOf(r[i])>=0||e.push(r[i]);return e}}),n.extend({callMethod:function(t){return n.isFunction(t)?(t(),1):0},loadJsonData:function(t,e,i,o,a,u){if(n.isFunction(t)&&n.isFunction(t.ajax)&&(u=function(e,n){t.ajax({url:e.url,type:"GET",success:function(t,r){n(e,"SUCCESS",t)},error:function(t,r,i){n(e,"FAILURE",null)}})}),!1===s(e)||e.length<1||!1===h(u))return h(i)&&i(null,a),n.callMethod(o),!1;for(var c=e.length,l=0,f=0;f<e.length;f++){var p={type:"json",dataType:"json"};p.url=e[f],p.apiName=a,u(p,(function(t,e,a){l++,"FAILURE"===e&&n.log("Error in api: "+t.url,r),h(i)&&i(a,p.apiName),c===l&&n.callMethod(o)}))}return!0}}),"Window"===e?window.$S=n:"Node.js"===e&&(t.exports=n)})(function(n){var r=[],i=!0;r.push("undefined"!==typeof n),r.push("undefined"!=typeof n.constructor);var o=[],a=!0;o.push("object"===typeof e),o.push("undefined"!==typeof t);for(var u=0;u<r.length;u++)r[u]||(i=!1);for(var s=0;s<o.length;s++)o[s]||(a=!1);return i&&"Window"==n.constructor.name?"Window":a?"Node.js":""}(this))},14:function(t,e,n){},15:function(t,e,n){"use strict";n.r(e);var r=n(0),i=n.n(r),o=n(4),a=n.n(o),u=n(5),s=n(6),c=n(2),l=n(8),f=n(7),h=(n(14),n(1)),p=n.n(h);var g=function(t){var e=t.item;return"url"===t.type&&t.url&&(e=i.a.createElement("a",{href:t.url},t.item)),i.a.createElement("td",{id:t.id},e)};var d=function(t){var e=t.item.map((function(e,n,r){var o=t.id+"-"+n,a=i.a.createElement(g,{id:o,key:o,item:e});if(2===n&&t.index>0&&r.length>3){var u=r[3];a=i.a.createElement(g,{id:o,key:o,item:e,type:"url",url:u})}return a}));return i.a.createElement("tr",{id:t.id},e)};var v=function(t){var e,n;e=t.tId?t.tId:"tid",n=t.cName?t.cName:"cname";var r=(t.tData?t.tData:[]).map((function(t,n,r){var o=e+"-"+n;return i.a.createElement(d,{id:o,key:o,item:t,index:n})}));return i.a.createElement("table",{id:e,className:n},i.a.createElement("tbody",null,r))},y={api:window.GLOBAL.api}.api,m=function(t){Object(l.a)(n,t);var e=Object(f.a)(n);function n(t){var r;return Object(u.a)(this,n),(r=e.call(this,t)).state={error:null,isLoaded:!1,items:[],btnActive:!0},r.handleClick=r.handleClick.bind(Object(c.a)(r)),r}return Object(s.a)(n,[{key:"componentDidMount",value:function(){this.fetchData()}},{key:"fetchData",value:function(){var t=this;fetch(y+"?"+p.a.getUniqueNumber()).then((function(t){return t.json()})).then((function(e){t.setState({isLoaded:!0,items:e,error:null}),p.a.log(t.state.items)}),(function(e){t.setState({isLoaded:!0,items:[],error:e.toString()}),p.a.log(t.state.error)}))}},{key:"handleClick",value:function(){this.setState({btnActive:!this.state.btnActive}),this.fetchData()}},{key:"render",value:function(){var t=[];p.a.isArray(this.state.items)&&(t=this.state.items);var e=i.a.createElement("center",null,"Loading...");if(this.state.isLoaded)if(t.length){var n=p.a.getTable(t,"dashboard");n.addColIndex(1),n.addRowIndex(0),n.updateTableContent(0,0,""),t=n.getContent(),e=i.a.createElement(v,{tId:"dashboard",cName:"table table-bordered",tData:t})}else{var r=this.state.error;e=i.a.createElement("center",null,r)}var o=this.state.btnActive?"btn btn-primary":"btn btn-success";return i.a.createElement("div",{className:"container"},i.a.createElement("div",null,i.a.createElement("center",null,i.a.createElement("h2",null,"React App \xa0",i.a.createElement("button",{onClick:this.handleClick,className:o},"Click to reload")))),i.a.createElement("hr",null),i.a.createElement("div",{id:"tableHtml"},e))}}]),n}(i.a.Component);Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a.a.render(i.a.createElement(i.a.StrictMode,null,i.a.createElement(m,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(t){t.unregister()})).catch((function(t){console.error(t.message)}))},9:function(t,e,n){t.exports=n(15)}},[[9,1,2]]]);

