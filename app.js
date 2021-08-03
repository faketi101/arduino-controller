const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log(`Arduino controller server started at port: ${port}`)
);

app.use(express.static(__dirname));
app.use(express.static("public"));
app.use(cors());

// setting port
const serialPort = require("serialport");
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
  console.log(data);
  arduinoPort.write(data.status);

  res.send(req.body);
});
app.get("/", async (req, res) => {
  // res.sendFile(htmlfile);
  res.render("index");
});
