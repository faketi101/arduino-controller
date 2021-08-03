const server_url = "http://localhost:8080";
// var socket = io(server_url);
const light = document.getElementById("light");
const servo_1_dec = document.getElementById("servo_1_dec");
const servo_1_pos = document.getElementById("servo_1_pos");
const servo_1_inc = document.getElementById("servo_1_inc");
let status = true;

let INITIAL_TIME = 400;
let ACCELERATION = 0.5;
let MIN_TIME = 100;

servo_1_inc.addEventListener("mousedown", () => {
  increment(INITIAL_TIME, servo_1_pos);

  // numberManger(servo_1_pos, -10);
});
servo_1_dec.addEventListener("mousedown", () => {
  decrement(INITIAL_TIME, servo_1_pos);

  // numberManger(servo_1_pos, +10);
});

servo_1_pos.addEventListener("change", () => {
  servoPosition(servo_1_pos);
});

light.addEventListener("click", () => {
  // console.log(status)
  if (status) {
    sendData(server_url + "/test", { type: "lights", status: "l01_1" });
    lightOff();
  } else if (!status) {
    sendData(server_url + "/test", { type: "lights", status: "l01_0" });

    lightOn();
  }
});

function numberManger(target, number) {
  let preValue = parseInt(target.value, 10);
  let newValue = preValue + number;
  target.value = newValue;
  servoPosition(target);
}
function servoPosition(target) {
  const min = 0;
  const max = 180;
  let value = target.value;
  if (value >= min && value <= max) {
    console.log(value);

    sendData(server_url + "/test", { type: "servos", status: `s01_${value}` });
  } else if (value < min) {
    target.value = min;
  } else if (value > max) {
    target.value = max;
  }
}

function sendData(url, data) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);

  //Send the proper header information along with the request
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("data", JSON.stringify(data));

  xhr.onreadystatechange = function () {
    // Call a function when the state changes.
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      // Request finished. Do processing here.
    }
  };
  xhr.send(data);
}

function lightOn() {
  light.classList.add("btn_off");
  light.classList.remove("btn_on");
  light.innerText = "LIGHT OFF";
  status = true;
}
function lightOff() {
  light.classList.add("btn_on");
  light.classList.remove("btn_off");
  light.innerText = "LIGHT ON";
  status = false;
}

// Increment the counter
function increment(time, target) {
  // decrease timeout by our acceleration factor, unless it's at the minimum
  time = time * ACCELERATION > MIN_TIME ? time * ACCELERATION : MIN_TIME;
  numberManger(target, +5);

  // set the timeout for the next round, and pass in the new smaller timeout
  timer = setTimeout(function () {
    increment(time, target);
  }, time);
}
// Same as increment only subtracts one instead of adding.
// -- could easily make one function and pass an pos/neg factor instead
function decrement(time, target) {
  time = time * ACCELERATION > MIN_TIME ? time * ACCELERATION : MIN_TIME;
  numberManger(target, -5);
  timer = setTimeout(function () {
    decrement(time, target);
  }, time);
}
document.onmouseup = function () {
  clearTimeout(timer);
};
