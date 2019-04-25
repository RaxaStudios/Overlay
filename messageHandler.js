const server = require('./server.js');


var array = new Array();
const Queue = require('better-queue');
/* create and initialize queue and function fu*/
function fu (json, cb) {
  // take in actual text to send
  // send to server's sub object
  server.sub.emit("push", "message", { msg: json });
  cb(null, json);
}
var q = new Queue(fu);
q.on('drain', function(){
  console.log('Drain complete');
});
setTimeout(function(){q.push('{"update":"Delayed push test", "number":"9"}', function(err, result){
  console.log(err);
  console.log(result);
    });
  }, 10000);
setInterval(function(){
  q.push('{"update":"Initial push test", "number":"3"}', function(err, result){
    console.log(err);
    console.log(result);
  });
}, 30000);
setInterval(function(){
  q.push(array.pop(), function(err, result){
  });
}, 12000);
