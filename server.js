const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const app = express();
const request = require("request");

const EventEmitter = require("events");
const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 8081 });

const messageHandler = require("./messageHandler");
const sub = new EventEmitter();

exports.app = app;
module.exports.sub = sub;

server.on("connection", socket => {
  socket.on("message", message => {
    var json = message;
    messageHandler.array.push(json);
    server.clients.forEach(client => {
      client.send(`message sent was:${message}`);
    });
  });
  socket.send("Connected to server at 8081");
});

app.engine("html", mustacheExpress());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", "./views");

app.get("/event-stream", (req, res) => {
  // SSE Setup
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write("\n");
  initialiseSSE(req, res);
});

function initialiseSSE(req, res) {
  setInterval(function(){
    sub.emit("push", "message", { msg: "message intervalled" });
  }, 10000);
  req.on("close", () => {
    console.log("request closed");
  });
}

app.get("/", function(req, res) {
  res.render("index");
  sub.on("push", function(event, data){
    console.log("data: " + data + "\n\n");
  });
});

app.listen(8080, function() {
  console.log("sse app listening on port 8080!");
});
