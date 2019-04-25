const express = require('express');
const mustacheExpress = require("mustache-express");
const bodyParser = require('body-parser');
const app = express();
const request = require('request');

const EventEmitter = require('events');
const WebSocket = require('ws');
const server = new WebSocket.Server({ port: 8081 });

const messageHandler = require('./messageHandler');
const sub = new EventEmitter();

exports.app = app;
module.exports.sub = sub;

server.on('connection', socket => {
  socket.on('message', message => {
    var json = message;
    messageHandler.array.push(json);
    server.clients.forEach(client => {
      client.send(`message sent was:${message}`);
    })
  });
  socket.send('Connected to server at 8081');
});

app.engine('html', mustacheExpress());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs')
app.set('views', './views');


app.get('/api/events', function(req, res){
  initialiseSSE(req, res);
});

app.get('/', function (req, res) {
  res.render('index');
});

function initialiseSSE(req, res) {
  res.writeHead(200, {
		"Content-Type": "text/event-stream",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive"
	});
  sub.on("push", function(event, data){
    res.write("data: " + data.msg + "\n\n");
  });
}

/*test interval to send to browser
setInterval(function(){
  sub.emit("push", "message", { msg: "message 1" });
}, 5000);
*/
app.listen(8080, function () {
  console.log('sse app listening on port 8080!');
});
