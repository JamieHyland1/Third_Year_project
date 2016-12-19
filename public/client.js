	var ws = new WebSocket("ws://localhost:3000");

	ws.onopen = function () {
		console.log("connection established");
	}
	ws.onmessage = function (e) {
		console.log(e.data);
	}
	ws.onclose()
	{
		console.log("1001	CLOSE_GOING_AWAY")
	}
