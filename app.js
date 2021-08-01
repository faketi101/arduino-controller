const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const port = process.env.PORT || 8080;
const httpServer = require("http").createServer(app);
app.listen(port, () =>
  console.log(`Arduino controller server started at port: ${port}`)
);

app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(cors());
const htmlfile = path.join(__dirname, "./public/index.html");

// setting port
const serialPort = require("serialport");
const { json } = require("express");
const parsers = serialPort.parsers;
const parser = new parsers.Readline({
  delimiter: "\r\n",
});

const arduinoPort = new serialPort("COM3", {
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});
arduinoPort.pipe(parser);

// sending controller html file
app.post("/test", async (req, res) => {
  const data = JSON.parse(req.headers.data);
  // console.log(data);
  arduinoPort.write(data.status);

  res.send(req.body);
});
app.get("/", async (req, res) => {
  // res.sendFile(htmlfile);
  res.render("index");
});
