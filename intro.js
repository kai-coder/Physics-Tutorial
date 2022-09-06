
sketches.push(new p5(function( s ) {
  var c1 = s.createVector()
  var c2 = s.createVector()
  s.setup = function() {
    var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
    canvas.parent('sketch0');
    s.pixelDensity(s.displayDensity());
    s.noLoop();
  }
  s.draw = function() {
    c1.set(s.mouseX, s.mouseY)
    c2.set(s.width/2, s.height/2)
    s.strokeWeight(s.height/200);
    s.background(200, 220, 230);
    s.fill(230, s.randomGaussian(0, 255), 225);
    s.circle(c2.x, c2.y, s.height / 2);
    s.fill(50, 150);
    s.circle(c1.x, c1.y, s.height / 10);
  }
}));


