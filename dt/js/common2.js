var container = document.getElementById("container");
var debugPanel = null;

var downEvent,moveEvent,upEvent;
var factor = 1;
var holdValue = false;
var pageNumber = 0;

window.onload = function (event)
{
	setPage();

	var _customEvent = document.createEvent("HTMLEvents");
	_customEvent.initEvent("PAGE_READY",true,true);
	document.dispatchEvent(_customEvent);

	if (typeof (getPageSetting) == typeof (Function)) getPageSetting();
	if (typeof (eachBrowserSetting) == typeof (Function)) eachBrowserSetting(window.browserInfo.browser);

	var _delay = setTimeout(function ()
	{
		var _customEvent = document.createEvent("HTMLEvents");
		_customEvent.initEvent("PAGE_READY_DELAY",true,true);
		document.dispatchEvent(_customEvent);
		getScale();

		clearTimeout(_delay);
	},500);
}

window.onerror = function (msg,url,line,col,error)
{
	var extra = !col ? '' : '\ncolumn: ' + col;
	extra += !error ? '' : '\nerror: ' + error;

	//alert("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

	var suppressErrorAlert = true;
};

function commonInit()
{
	console.log("commonInit");

	if (window.browserInfo.mobile)
	{
		downEvent = "touchstart";
		moveEvent = "touchmove";
		upEvent = "touchend";
	}
	else
	{
		downEvent = "mousedown";
		moveEvent = "mousemove";
		upEvent = "mouseup";
	}
}

function setPage()
{
	var _container = document.getElementById("container");
	var _page = document.getElementsByClassName("page")[0];
	if (_page)
	{
		var _urlArray = _urlArray = document.URL.split("/");
		pageNumber = parseInt(_urlArray[_urlArray.length - 1].split(".")[0].replace("page",""));

		if (!pageNumber)
		{
			_urlArray = document.URL.split("\\");
			pageNumber = parseInt(_urlArray[_urlArray.length - 1].split(".")[0].replace("page",""));
		}

		_page.innerHTML = pageNumber;
	}

	// if (pageNumber % 2 == 0)
	// {
	// 	_container.className = "leftPage";
	// }
	// else
	// {
	// 	_container.className = "rightPage";
	// }
}

function getScale()
{
	var _bodyWidth = document.body.clientWidth;
	var _bodyHeight = document.body.clientHeight;

	var _containerWidth = container.clientWidth;
	var _containerHeight = container.clientHeight;

	var _zoomVertical = (_bodyHeight / _containerHeight) * 1.0;
	var _zoomHorizontal = (_bodyWidth / _containerWidth) * 1.0;

	if (parent.ZOOMVALUE == undefined) parent.ZOOMVALUE = 1;

	if (_bodyHeight < _bodyWidth)
	{
		factor = parent.ZOOMVALUE;
	}
	else
	{
		factor = _zoomHorizontal;
	}

	if (!window.browserInfo.mobile) factor = parent.ZOOMVALUE;

	console.log("factor : " + factor);
}

function setDebug()
{
	debugPanel = document.createElement("div");
	document.body.appendChild(debugPanel);

	debugPanel.allWaysDebugPanel = document.createElement("div");
	document.body.appendChild(debugPanel.allWaysDebugPanel);

	debugPanel.id = "debugPanel";
	debugPanel.className = "debugPanel";
	debugPanel.style.position = "absolute";
	debugPanel.style.left = "0px";
	debugPanel.style.top = "20px";
	debugPanel.style.width = "auto";
	debugPanel.style.height = "auto";
	debugPanel.style.pointerEvents = "none";
	debugPanel.style.color = "rgba(255, 255, 255, 0.80)";
	debugPanel.style.backgroundColor = "rgba(0, 0, 0, 0.60)";
	debugPanel.style.zIndex = 100;

	debugPanel.allWaysDebugPanel.id = "allWaysDebugPanel";
	debugPanel.allWaysDebugPanel.className = "allWaysDebugPanel";
	debugPanel.allWaysDebugPanel.style.position = "absolute";
	debugPanel.allWaysDebugPanel.style.left = "0px";
	debugPanel.allWaysDebugPanel.style.top = "0px";
	debugPanel.allWaysDebugPanel.style.width = "auto";
	debugPanel.allWaysDebugPanel.style.height = "auto";
	debugPanel.allWaysDebugPanel.style.pointerEvents = "none";
	debugPanel.allWaysDebugPanel.style.color = "rgba(0, 0, 0, 0.80)";
	debugPanel.allWaysDebugPanel.style.backgroundColor = "rgba(255, 255, 255, 0.60)";
	debugPanel.allWaysDebugPanel.style.zIndex = 101;

	debugPanel.debug = function (text)
	{
		debugPanel.innerHTML += text + "<br/>";
	}

	debugPanel.allWaysDebug = function (text)
	{
		debugPanel.allWaysDebugPanel.innerHTML = text;
	}
}

commonInit();
setDebug();