// Initialize the WebSocket connection
const ws = new WebSocket("ws://localhost:8000/");

// Select the HTML element where the blink count will be displayed
const blinkCountElement = document.getElementById("blink-count");

// When the WebSocket connection is opened, send a message to the server
ws.onopen = () => {
  console.log("WebSocket connection opened");
};

//When a message is received from the server, update the blink count

let rowIdx = 0, colIdx = 0, count = 0;
let isRowSelected = false, isColSelected = false;
let colIteration, rowIteration;

const charSet = [['a', 'b', 'c', 'd', 'e', 'f'],
['g', 'h', 'i', 'j', 'k', 'l'],
['m', 'n', 'o', 'p', 'q', 'r'],
['s', 't', 'u', 'v', 'w', 'x'],
['y', 'z', '1', '2', '3', '4'],
['5', '6', '7', '8', '9', '0'],
[' ', ' ', ' ', ' ', ' ', ' ']];

const takeInput = () => {
  if (rowIdx === 6 && colIdx === 5) document.querySelector('#message').innerHTML = '';
  if (rowIdx === 6 && (colIdx === 3 || colIdx === 4)) document.querySelector('#message').innerHTML = document.querySelector('#message').innerHTML.slice(0, -1);
  document.querySelector('#message').innerHTML += charSet[rowIdx][colIdx];

}
const recogniseBlink = () => {
  if (count % 2 == 0) {
    rowIdx = (rowIdx + 6) % 7;
    clearInterval(rowIteration);
    colIdx = 0;
    colIteration = setInterval(() => {
      const a = document.querySelectorAll('td');
      for (let idx = 0; idx < a.length; idx++) a[idx].style.background = 'white';
      for (let idx = 0; idx < 6; idx++) document.getElementsByClassName('col' + idx.toString())[rowIdx].style.background = 'yellow';
      document.getElementsByClassName('col' + colIdx.toString())[rowIdx].style.background = 'orange';
      colIdx = (colIdx + 1) % 6;
    }, 1200);
  }
  else {
    colIdx = (colIdx + 5) % 6;
    clearInterval(colIteration);
    takeInput();
    rowIdx = 0;
    rowIteration = setInterval(() => {
      const a = document.querySelectorAll('td');
      for (let idx = 0; idx < a.length; idx++) a[idx].style.background = 'white';
      for (let idx = 0; idx < 6; idx++) document.getElementsByClassName('col' + idx.toString())[rowIdx].style.background = 'yellow';
      rowIdx = (rowIdx + 1) % 7;
    }, 1200);

  }
  count = (count + 1) % 2;
}
document.getElementById('enter').addEventListener('click', recogniseBlink);

rowIteration = setInterval(() => {
  const a = document.querySelectorAll('td');
  for (let idx = 0; idx < a.length; idx++) a[idx].style.background = 'white';
  for (let idx = 0; idx < 6; idx++) document.getElementsByClassName('col' + idx.toString())[rowIdx].style.background = 'yellow';
  rowIdx = (rowIdx + 1) % 7;
}, 1200);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(data.type);
  if (data.type === "blink") {
    // const count = data.count;
    // blinkCountElement.textContent = count;
    recogniseBlink();
  }
};

// When the WebSocket connection is closed, log a message to the console
ws.onclose = () => {
  console.log("WebSocket connection closed");
};

