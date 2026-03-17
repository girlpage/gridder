let panel, generateButton, fileInput;
let unitSelect, rowsInput, colsInput, gutterInput, marginInput, widthInput, heightInput;
let gridRects = [];
let uploadedImages = []; 

function setup() {
  createCanvas(windowWidth, windowHeight);
  createUI();
}

function createUI() {
  panel = createDiv();
  panel.id("menuPanel");
  panel.style("width", "220px");
  panel.addClass("m-plus-rounded-1c-regular");
  panel.addClass("space-mono-bold");

  createDiv("GRIDDER").parent(panel).style("margin-bottom","10px");

  createDiv("Rows").parent(panel);
  rowsInput = createInput("4", "number");
  rowsInput.parent(panel).style("margin-bottom","10px");

  createDiv("Columns").parent(panel);
  colsInput = createInput("6", "number");
  colsInput.parent(panel).style("margin-bottom","10px");

  createDiv("Gutter").parent(panel);
  gutterInput = createInput("10", "number");
  gutterInput.parent(panel).style("margin-bottom","10px");

  createDiv("Margin").parent(panel);
  marginInput = createInput("20", "number");
  marginInput.parent(panel).style("margin-bottom","10px");

  createDiv("Grid Width").parent(panel);
  widthInput = createInput("800", "number");
  widthInput.parent(panel).style("margin-bottom","10px");

  createDiv("Grid Height").parent(panel);
  heightInput = createInput("600", "number");
  heightInput.parent(panel).style("margin-bottom","20px");

  createDiv("Units").parent(panel);
  unitSelect = createSelect();
  unitSelect.parent(panel);
  unitSelect.option("px");
  unitSelect.option("cm");
  unitSelect.option("mm");
  unitSelect.option("in");
  unitSelect.selected("px");
  unitSelect.style("margin-bottom","20px");

  createDiv("Upload Images").parent(panel);
  fileInput = createFileInput(handleFile);
  fileInput.parent(panel).style("margin-bottom","20px");
  fileInput.attribute("multiple", true);

  generateButton = createButton("Generate Grid");
  generateButton.parent(panel);
  generateButton.mousePressed(generateRandomGrid);

  let exportButton = createButton("Export SVG");
  exportButton.parent(panel);
  exportButton.mousePressed(exportSVG);
}

function handleFile(file) {
  if (file.type === 'image') {
    loadImage(file.data, img => {
      uploadedImages.push(img);
    });
  }
}

function generateRandomGrid() {
  gridRects = [];

  const rows = max(1, parseInt(rowsInput.value()));
  const cols = max(1, parseInt(colsInput.value()));
  const gutter = parseFloat(gutterInput.value());
  const margin = parseFloat(marginInput.value());
  const gridW = parseFloat(widthInput.value());
  const gridH = parseFloat(heightInput.value());

  const cellW = (gridW - 2 * margin - (cols - 1) * gutter) / cols;
  const cellH = (gridH - 2 * margin - (rows - 1) * gutter) / rows;

  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      let x = margin + c * (cellW + gutter);
      let y = margin + r * (cellH + gutter);

      let img = null;
      if (uploadedImages.length > 0) {
        img = random(uploadedImages);
      }

      gridRects.push({x, y, w: cellW, h: cellH, img});
    }
  }
}

function draw() {
  background(255);

  for (let r of gridRects) {
    if (r.img) {
      image(r.img, r.x, r.y, r.w, r.h);
    } else {
      noFill();
      stroke(0);
      strokeWeight(1);
      rect(r.x, r.y, r.w, r.h);
    }
  }
}

function exportSVG() {
  if (gridRects.length === 0) {
    alert("Please generate the grid first!");
    return;
  }

  const unit = unitSelect.value(); 
  const svgWidth = parseFloat(widthInput.value());
  const svgHeight = parseFloat(heightInput.value());

  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgWidth}${unit}" height="${svgHeight}${unit}">`;

  for (let r of gridRects) {
    svgContent += `<rect x="${r.x}${unit}" y="${r.y}${unit}" width="${r.w}${unit}" height="${r.h}${unit}" fill="none" stroke="black" stroke-width="1"/>`;
  }

  svgContent += `</svg>`;

  const blob = new Blob([svgContent], {type:"image/svg+xml"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "grid.svg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}