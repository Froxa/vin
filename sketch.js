const W = 400;
const H = 400;

let seed;
let seedInput;
let randomSeedButton;

let resFlow;
let resFlowInput;

let resColor;
let resColorInput;

let gap;
let gapInput;

let segment;
let segmentInput;

let startOffset;
let startOffsetInput;

let backgroundColor;
let backgroundInput;

let colors;
let colorsInput;

let colorOffset;
let colorOffsetInput;

let strokeBase;
let strokeBaseInput;

let strokeStep;
let strokeStepInput;

let stepDirection;
let stepDirectionInput;

let strokeHead;
let strokeHeadInput;

function setup() {
  // canvas
  let canvas = createCanvas(W, H);
  canvas.parent("canvasdiv");
  noLoop();

  // color mode
  colorMode(HSB, 360, 120, 100, 255);

  // seed input
  seedInput = select("#seed");
  seed = Math.floor(Math.random() * 2147483646);
  seedInput.value(seed);
  seedInput.changed(() => {
    seed = seedInput.value();
    redraw();
  });

  // random seed button
  randomSeedButton = select("#randomSeed");
  randomSeedButton.mousePressed(() => {
    seed = Math.floor(Math.random() * 2147483646);
    seedInput.value(seed);
    redraw();
  });

  //resFlow input
  resFlowInput = select("#resFlow");
  resFlow = parseFloat(resFlowInput.value());
  resFlowInput.changed(() => {
    resFlow = parseFloat(resFlowInput.value());
    redraw();
  });

  //resColor input
  resColorInput = select("#resColor");
  resColor = parseFloat(resColorInput.value());
  resColorInput.changed(() => {
    resColor = parseFloat(resColorInput.value());
    redraw();
  });

  //gap input
  gapInput = select("#gap");
  gap = parseInt(gapInput.value());
  gapInput.changed(() => {
    gap = parseInt(gapInput.value());
    redraw();
  });

  //segment input
  segmentInput = select("#segment");
  segment = parseInt(segmentInput.value());
  segmentInput.changed(() => {
    segment = parseInt(segmentInput.value());
    redraw();
  });

  //startOffset input
  startOffsetInput = select("#startOffset");
  startOffset = parseInt(startOffsetInput.value());
  startOffsetInput.changed(() => {
    startOffset = parseInt(startOffsetInput.value());
    redraw();
  });

  const parseRGB = (val) => [
    parseInt(val.substring(1, 3), 16),
    parseInt(val.substring(3, 5), 16),
    parseInt(val.substring(5, 7), 16),
  ];

  //colors input
  backgroundInput = select("#backgroundInput");
  backgroundColor = parseRGB(backgroundInput.value());
  backgroundInput.changed(() => {
    backgroundColor = parseRGB(backgroundInput.value());
    redraw();
  });

  //colors input
  colorsInput = select("#colors");
  colors = parseInt(colorsInput.value());
  colorsInput.changed(() => {
    colors = parseInt(colorsInput.value());
    redraw();
  });

  //colorOffset input
  colorOffsetInput = select("#colorOffset");
  colorOffset = parseInt(colorOffsetInput.value());
  colorOffsetInput.changed(() => {
    colorOffset = parseInt(colorOffsetInput.value());
    redraw();
  });

  //strokeBase input
  strokeBaseInput = select("#strokeBase");
  strokeBase = parseFloat(strokeBaseInput.value());
  strokeBaseInput.changed(() => {
    strokeBase = parseFloat(strokeBaseInput.value());
    redraw();
  });

  //strokeStep input
  strokeStepInput = select("#strokeStep");
  strokeStep = parseFloat(strokeStepInput.value());
  strokeStepInput.changed(() => {
    strokeStep = parseFloat(strokeStepInput.value());
    redraw();
  });

  //stepDirection input
  stepDirectionInput = select("#stepDirection");
  stepDirection = parseInt(stepDirectionInput.value());
  stepDirectionInput.changed(() => {
    stepDirection = parseInt(stepDirectionInput.value());
    redraw();
  });

  //strokeHead input
  strokeHeadInput = select("#strokeHead");
  strokeHead = strokeHeadInput.value();
  strokeHeadInput.changed(() => {
    strokeHead = strokeHeadInput.value();
    redraw();
  });

  //save
  saveBtn = select("#saveBtn");
  saveBtn.mousePressed(() => {
    saveCanvas();
  });
}

function draw() {
  // seed
  randomSeed(seed);
  noiseSeed(seed);

  // background
  colorMode(RGB);

  background(...backgroundColor);
  //background();

  colorMode(HSB, 360, 120, 100, 255);

  if (strokeHead == "s") strokeCap(SQUARE);
  else if (strokeHead == "p") strokeCap(PROJECT);
  else if (strokeHead == "c") strokeCap(ROUND);

  for (let i = -W * 0.15; i < W * 1.15; i += gap) {
    for (let j = -H * 0.15; j < H * 1.15; j += gap) {
      const n2 = (noise(i * resColor, j * resColor) - 0.2) * 1.7;
      const hue = (colorOffset + floor(colors * n2) * (360 / colors)) % 360;
      stroke(
        hue + random(-5, 5),
        85 + random(-15, 15),
        80 + random(-15, 15),
        150
      );
      let x = i + random(-startOffset, startOffset);
      let y = j + random(-startOffset, startOffset);

      if (stepDirection == 0) {
        strokeWeight(strokeBase);
        for (let k = 0; k < 10; k++) {
          const n1 = (noise(x * resFlow, y * resFlow) - 0.2) * 1.7;
          const angle = n1 * PI * 2;
          const newX = cos(angle) * segment + x;
          const newY = sin(angle) * segment + y;
          line(x, y, newX, newY);
          x = newX;
          y = newY;
        }
      } else if (stepDirection == 1) {
        for (let k = 0; k < 10; k++) {
          const n1 = (noise(x * resFlow, y * resFlow) - 0.2) * 1.7;
          const angle = n1 * PI * 2;
          const newX = cos(angle) * segment + x;
          const newY = sin(angle) * segment + y;
          strokeWeight(strokeBase + k * strokeStep);
          line(x, y, newX, newY);
          x = newX;
          y = newY;
        }
      } else if (stepDirection == -1) {
        for (let k = 10; k > 0; k--) {
          const n1 = (noise(x * resFlow, y * resFlow) - 0.2) * 1.7;
          const angle = n1 * PI * 2;
          const newX = cos(angle) * segment + x;
          const newY = sin(angle) * segment + y;
          strokeWeight(strokeBase + k * strokeStep);
          line(x, y, newX, newY);
          x = newX;
          y = newY;
        }
      }
    }
  }
}
