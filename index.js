var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://192.168.2.20');
var five = require("johnny-five");
var Edison = require("edison-io");
var board = new five.Board({
	  io: new Edison()
});

board.on("ready", function() {
	var lcd = new five.LCD({controller: "JHD1313M1" });

	client.on('connect', function() {
	  client.subscribe('eddy2/lcd');
	  client.publish('presence', 'Eddy LCD Gateway Online');
	});

	client.on('message', function(topic,message) {
	  var sMsg = message.toString();
	  var jsonMsg;
	  try {
	    jsonMsg = JSON.parse(sMsg);
	    lcd.clear().bgColor(jsonMsg.R, jsonMsg.G,jsonMsg.B)
	  	.cursor(0,0).print(jsonMsg.msg1.substring(0,16))
		.cursor(1,0).print(jsonMsg.msg2.substring(0,16));
	  }
	  catch (err) {
	    console.log('Error: ', err);
	    console.log('Topic: ',topic);
	    console.log('Message: ', sMsg);
	  }
	});
});

