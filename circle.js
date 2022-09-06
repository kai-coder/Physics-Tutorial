
sketches.push(new p5(function( s ) {
  var c1 = new circleCollider(0, 0, 20)
  var c2 = p5.createVector()
  p5.setup = function() {
    var canvas = p5.createCanvas(s.select('#sketch0').width, p5.select('#sketch0').height);
    canvas.parent('sketch0');
    p5.pixelDensity(s.displayDensity());
    p5.noLoop();
  }
  p5.draw = function() {
    c1.set(s.mouseX, p5.mouseY)
    c2.set(s.width/2, p5.height/2)
    p5.strokeWeight(s.height/200);
    p5.background(200, 220, 230);
    p5.fill(230, 240, 225);
    p5.circle(c2.x, c2.y, p5.height / 2);
    p5.fill(50, 150);
    p5.circle(c1.x, c1.y, p5.height / 10);
  }
}));


