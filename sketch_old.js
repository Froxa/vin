const W = 600 + 1;
const H = 400 + 1;
const PPS = 25;
let vecs = [];
const noiseScale = 0.1;

//gui
let showGridToggle;
let showVectorsToggle;

function setup() {
  createCanvas(W, H);
  noiseSeed(10);

  showGridToggle = createCheckbox("Show grid", false);
  showVectorsToggle = createCheckbox("Show vectors", false);

  for (let y = 0; y < H / PPS - 1; y++) {
    let row = [];
    for (let x = 0; x < W / PPS - 1; x++) {
      const r = noise(x * noiseScale, y * noiseScale);
      const v = p5.Vector.fromAngle(r * 2 * PI);
      row.push(v);
    }
    vecs.push(row);
  }
}

function draw() {
  background(255);
  frameRate(1);

  for (let y = 0; y < H / PPS - 1; y++) {
    for (let x = 0; x < W / PPS - 1; x++) {
      let pos = createVector(x * PPS, y * PPS);
      for (let i = 20; i > 0; i--) {
        const xi = round(pos.x / PPS);
        const yi = round(pos.y / PPS);

        if (xi < 0 || yi < 0 || xi >= vecs[0].length || yi >= vecs.length) {
          break;
        }

        const dir = getDirection(xi, yi, pos);
        const dir_scaled = p5.Vector.mult(dir, PPS / 4);

        const end = p5.Vector.add(pos, dir_scaled);

        stroke(0, 0, 255, 255);
        strokeWeight(4 * (i / 20));
        line(pos.x, pos.y, end.x, end.y);

        pos = end;
      }
    }
  }

  if (showGridToggle.checked()) drawGrid();
  if (showVectorsToggle.checked()) drawVectors();
}

function getDirection(xi, yi, pos) {
  const dc = 1 / dist(pos.x, pos.y, xi * PPS, yi * PPS);
  const dxm = 1 / dist(pos.x, pos.y, (xi - 1) * PPS, yi * PPS);
  const dxp = 1 / dist(pos.x, pos.y, (xi + 1) * PPS, yi * PPS);
  const dym = 1 / dist(pos.x, pos.y, xi * PPS, (yi - 1) * PPS);
  const dyp = 1 / dist(pos.x, pos.y, xi * PPS, (yi + 1) * PPS);
  const d = dc + dxm + dxp + dym + dyp;

  let rv = p5.Vector.mult(vecs[yi][xi], dc / d);

  if (xi > 1) {
    rv.add(p5.Vector.mult(vecs[yi][xi - 1], dxm / d));
  }

  if (yi > 1) {
    rv.add(p5.Vector.mult(vecs[yi - 1][xi], dym / d));
  }

  if (xi + 1 < vecs[0].length) {
    rv.add(p5.Vector.mult(vecs[yi][xi + 1], dxp / d));
  }

  if (yi + 1 < vecs.length) {
    rv.add(p5.Vector.mult(vecs[yi + 1][xi], dyp / d));
  }

  return rv;
}

function drawGrid() {
  push();
  for (let y = 0; y < H / PPS - 1; y++) {
    for (let x = 0; x < W / PPS - 1; x++) {
      const xcv = x * PPS + 1;
      const ycv = y * PPS + 1;

      stroke(0);
      strokeWeight(1);
      fill(0, 0, 0, 0);

      square(xcv, ycv, PPS);
    }
  }
  pop();
}

function drawVectors() {
  push();
  for (let y = 0; y < H / PPS - 1; y++) {
    for (let x = 0; x < W / PPS - 1; x++) {
      const xcv = x * PPS;
      const ycv = y * PPS;

      const l_start = createVector(xcv, ycv);
      const dir = vecs[y][x];
      drawArrow(l_start, p5.Vector.mult(dir, PPS / 2 - 1), "black");
    }
  }
  pop();
}

function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(1);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  const arrowSize = 4;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}
