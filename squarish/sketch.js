var polygons;
var fullW = 400;
var depth = 6;

function setup() {
  createCanvas(400, 400);

  var origin = p(0, 0);
  var initialPol = new Polygon([
    p(origin.x, origin.y),
    p(origin.x + fullW, origin.y),
    p(origin.x + fullW, origin.y + fullW),
    p(origin.x, origin.y + fullW)
  ]);

  // var initialPol = new Polygon([
  //   p(origin.x, origin.y),
  //   p(origin.x + 200, origin.y),
  //   p(origin.x + 300, origin.y + 250),
  //   p(origin.x + 50, origin.y + 300)
  // ])
  polygons = subPolys(initialPol, depth);
  background('blue');
  noLoop();
}



class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

function p(x, y) {
  return new Point(x, y);
}

class Polygon {
  constructor(vertices) {
    this.vertices = vertices;
  }

  draw() {
    fill(255,255,255,50);
    strokeWeight(0);
    beginShape();
    this.vertices.forEach(v => {
      vertex(v.x, v.y);
    })
    endShape(CLOSE);
  }
}

function splitVerticesEven(p1, p2) {
  return p(
    (p1.x + p2.x) / 2.,
    (p1.y + p2.y) / 2.
  );
}

function distance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function truncatedNormal(mean, stdDev, min, max) {
  var val = min - 1;  // guaranteed to fail
  while (val < min || val > max) {
    val = randomGaussian(mean, stdDev);
  }
  return val;
}

function splitVerticesRandom(p1, p2, randomizer) {
  var lenAlong = distance(p1, p2) * randomizer();
  var theta = Math.atan2(p2.y - p1.y, p2.x - p1.x);  // atan2 handles negatives better
  return p(
    p1.x + Math.cos(theta) * lenAlong,
    p1.y + Math.sin(theta) * lenAlong
  );
}
splitVerticesRandomUniform = (p1, p2) => { return splitVerticesRandom(p1, p2, Math.random) }
splitVerticesRandomNormal = (p1, p2) => {
  return splitVerticesRandom(
    p1,
    p2,
    () => truncatedNormal(.5, .15, 0, 1)
  );
}

function subPoly(poly) {
  var newVertices = [];

  for (var i = 0; i < poly.vertices.length; i++) {
    var p1 = poly.vertices[i];
    var p2 = poly.vertices[(i + 1) % poly.vertices.length];  // wrap
    newVertices.push(splitVerticesRandomNormal(p1, p2));
  }

  return new Polygon(newVertices);
}

function subPolys(poly, levels) {

  if (levels == 0) {
    return [];
  }

  var newPoly = subPoly(poly);

  var subSubs = subPolys(newPoly, levels - 1);
  subSubs.push(poly);
  return subSubs;
}


function draw() {
  // clear();
  // background('blue');
  print('hi')
  polygons.reverse().forEach((p, i) => {
    p.draw();
  })
}
