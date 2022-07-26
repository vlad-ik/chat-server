//const bodyParser = require("body-parser");
const express = require("express");
const moment = require("moment")
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const storage = {};


app.post("/message", (req, res) => {
    res.setHeader("Content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    const body = req.body;

    storage[body.timestamp] = {username:body.username, message:body.message};

    const result = JSON.stringify({status:"ok"});
    res.end(result);
    console.log(storage);
});


app.get("/message", (req, res) => {
  const timestamp = req.query.timestamp;
  const arr = Object.keys(storage);
  const arr2 = arr.filter(x=>x>timestamp);
  const arr3 = arr2.map(x=>
  {
    var elem = storage[x];
    elem["timestamp"] = moment().format('LTS');
    return elem;
  });
  const result = JSON.stringify(arr3);

  res.setHeader("Content-type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(result);
    console.log(result);
});

const server = app.listen(80, () => {
  console.log("Example app listening on port 80!");
});

function gracefulShutdown(signal) {
  console.log(`${signal} signal received.`);
  server.close(() => {
    //db.close();
  });
}
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
