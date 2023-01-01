sketches.push(new p5(function( s ) {
    var c1;
    var c2;
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        c1 = new circleCollider(s.createVector(0, 0), 20)
        c2 = new circleCollider(s.createVector(400, 200), 100)
    }
    s.draw = function() {
        c1.pos.set(mouseCoords(s))
        s.strokeWeight(s.height/200);
        s.background(200, 220, 230);
        if (circleCircle(c1, c2)){
            s.fill(250, 200, 90);
        }else{
            s.fill(230, 240, 225)
        }
        c2.draw(s)
        s.fill(50, 150);
        c1.draw(s)
    }
}));


