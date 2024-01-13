// Get the canvas and context
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Variables to keep track of the drawing state
let drawing = false;
let x = 0;
let y = 0;
// Set the fill style to yellow

ctx.fillStyle = "black";

// Fill the entire canvas with the fill style
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = "yellow";

// Start a new path
ctx.beginPath();

// Draw a circle
// The parameters are: x, y, radius, start angle, end angle
ctx.arc(canvas.width / 2, canvas.height / 2, 240, 0, Math.PI * 2);

// Close the path
ctx.closePath();

// Fill the circle
ctx.fill();

// Variables for the circle
let circleX = canvas.width / 2;
let circleY = canvas.height / 2;
let circleRadius = 240;

// Function to check if a point is inside the circle
function isInsideCircle(x, y) {
  let dx = circleX - x;
  let dy = circleY - y;
  return dx * dx + dy * dy <= circleRadius * circleRadius;
}

// Modify the mousemove event listener
canvas.addEventListener("mousemove", (e) => {
  if (drawing === true && isInsideCircle(e.offsetX, e.offsetY)) {
    drawLine(ctx, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

// Event listeners for the mousedown, mousemove, and mouseup events
canvas.addEventListener("mousedown", (e) => {
  x = e.offsetX;
  y = e.offsetY;
  drawing = true;
});

canvas.addEventListener("mousemove", (e) => {
  if (
    drawing === true &&
    isInsideCircle(x, y) &&
    isInsideCircle(e.offsetX, e.offsetY)
  ) {
    drawLine(ctx, x, y, e.offsetX, e.offsetY);
    x = e.offsetX;
    y = e.offsetY;
  }
});

window.addEventListener("mouseup", (e) => {
  if (drawing === true && isInsideCircle(e.offsetX, e.offsetY)) {
    drawLine(ctx, x, y, e.offsetX, e.offsetY);
  }
  x = 0;
  y = 0;
  drawing = false;
});

// Function to draw a line on the canvas
function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = "black";
  context.lineWidth = 15;
  context.lineJoin = "round"; // Add this line
  context.lineCap = "round"; // Add this line
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

// Get the "Predict" button
let predictButton = document.getElementById("predict");

// Add a click event listener to the "Predict" button
predictButton.addEventListener("click", function () {
  // Convert the canvas drawing to a data URL
  let dataUrl = canvas.toDataURL();

  // Send the data URL to the server
  fetch("/predict", {
    method: "POST",
    body: JSON.stringify({ image: dataUrl }),
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .then((data) => {
      // Create a new paragraph element
      let outputDiv = document.getElementById("output");

      outputDiv.innerHTML = "";

      let resultParagraph = document.createElement("p");

      // Set the text content of the paragraph to the predicted result
      resultParagraph.textContent = "Predicted emotion: " + data.emotion;

      // Append the paragraph to the body of the document
      outputDiv.appendChild(resultParagraph);
    });
});
let clearButton = document.getElementById("clear");

// Add a click event listener to the "Clear" button
clearButton.addEventListener("click", function () {
  // Set the fill style to white
  ctx.fillStyle = "black";

  // Fill a rectangle that covers the entire canvas
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "yellow";

  // Start a new path
  ctx.beginPath();

  // Draw a circle
  // The parameters are: x, y, radius, start angle, end angle
  ctx.arc(canvas.width / 2, canvas.height / 2, 240, 0, Math.PI * 2);

  // Close the path
  ctx.closePath();

  // Fill the circle
  ctx.fill();
});