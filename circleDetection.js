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

sketches.push(new p5(function( s ) {
    var c1;
    var c2;
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch1').width, s.select('#sketch1').height);
        canvas.parent('sketch1');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        s.textStyle(s.BOLD);
        c1 = new circleCollider(s.createVector(0, 0), 20)
        c2 = new circleCollider(s.createVector(400, 200), 100)
    }
    
    s.draw = function() {
        s.background(200, 220, 230);
        s.stroke(0)
        c1.pos.set(mouseCoords(s))
        s.strokeWeight(s.height/200);
        if (circleCircle(c1, c2)){
            s.fill(250, 200, 90);
        } else{
            s.fill(230, 240, 225)
         }
        c2.draw(s)
        s.fill(50, 150);
        c1.draw(s)
        dotLine(s, c2.pos, s.createVector(c1.pos.x, c2.pos.y), 10)
        dotLine(s, c1.pos, s.createVector(c1.pos.x, c2.pos.y), 10)
        s.strokeWeight(s.height/100);
        line(s, c1.pos, c2.pos)

        s.fill(0, 160, 160)
        s.textSize(s.width/32)
        s.stroke(200, 220, 230)
        s.strokeWeight(s.height/100)
        s.textAlign(s.CENTER, s.BOTTOM)
        txtLine(s, "c", c1.pos, c2.pos)
        s.textAlign(s.CENTER, s.TOP)
        txtLine(s, "a", c2.pos, s.createVector(c1.pos.x, c2.pos.y))
        s.textAlign(s.LEFT, s.CENTER)
        txtLine(s, "b", s.createVector(c1.pos.x - 40, c1.pos.y), s.createVector(c1.pos.x, c2.pos.y), 0);
    }
}));
