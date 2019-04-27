const express = require("express");
const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

function initialiseSSE(req, res) {
  let messageId = 0;

  const intervalId = setInterval(() => {
    res.write(`id: ${messageId}\n`);
    res.write(`data: Test Message -- ${Date.now()}\n\n`);
    messageId += 1;
  }, 1000);

  req.on("close", () => {
    clearInterval(intervalId);
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
