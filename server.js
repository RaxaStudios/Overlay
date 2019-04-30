const express = require("express");
const app = express();
const firebase = require("firebase");

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

  // Initialize Firebase
var config = {
  apiKey: "",
  authDomain: "",
  databaseURL: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: ""
};
firebase.initializeApp(config);


function initialiseSSE(req, res) {
  var dataRef = firebase.database().ref("/").child("events");

  const fire = dataRef.on("value", function(snapshot) {
    console.log(`firebase values: ${snapshot.val().key}`);
    res.write(`data: ${snapshot.val().key}\n\n`);
  });
}

app.get("/event-stream", (req, res) => {
  // SSE Setup
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no"
  });
  res.write("\n");

  initialiseSSE(req, res);
});

app.get("/", function(req, res) {
  res.render("index");
});

app.listen(8080, function() {
  console.log("sse app listening on port 8080!");
});
