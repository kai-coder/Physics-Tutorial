sketches.push(new p5(function( s ) {
    function clickFunct(s){
        circArray = []
        for (i = 0; i < 10; i++){
            pos = s.createVector(randRange(0, 800), randRange(0, 400))
            radius = randRange(5, 50)
            vel = s.createVector(randRange(-5, 5), randRange(-5, 5))
            circArray.push(new circleCollider(pos, radius, vel))
        }
    }

    var circArray = []
    
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        canvas.mouseClicked(function (){
            clickFunct(s)});
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        for (i = 0; i < 10; i++){
            pos = s.createVector(randRange(0, 800), randRange(0, 400))
            radius = randRange(5, 50)
            vel = s.createVector(randRange(-5, 5), randRange(-5, 5))
            circArray.push(new circleCollider(pos, radius, vel))
        }
    }

    s.draw = function() {
        s.strokeWeight(s.height/200);
        s.background(200, 220, 230);
        s.fill(230, 240, 225)
        for (i = 0; i < circArray.length; i++){
            circArray[i].update(0)
        }
        for (i = 0; i < circArray.length; i++){
            circArray[i].boundaryCheck(0, 0, 800, 400)
        }
        for (i = 0; i < circArray.length; i++){
            circArray[i].resolve()
        }
        for (i = 0; i < circArray.length; i++){
            circArray[i].draw(s)
        }
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
        c1 = new circleCollider(s.createVector(0, 0), 20)
        c2 = new circleCollider(s.createVector(0, 0), 20)
    }
    s.draw = function() {
        c1.pos.set(mouseCoords(s))
        c2.pos.set(mouseCoords(s))
        s.background(200, 220, 230);
        s.noStroke()

        s.fill(230, 240, 225)
        s.square(s.width / 2 - s.width / 8, s.height / 2 - s.width / 8, s.width / 4)

        s.strokeWeight(s.height/100);
        s.stroke(0)
        if (c1.pos.y - c1.radius < 100){
            c2.pos.y = 100 + c1.radius
            s.stroke(250, 200, 90)
        }
        line(s, s.createVector(300, 100), s.createVector(500, 100))
        s.stroke(0)
        if (c1.pos.y + c1.radius > 300){
            c2.pos.y = 300 - c1.radius
            s.stroke(250, 200, 90)
        }
        line(s, s.createVector(300, 300), s.createVector(500, 300))
        s.stroke(0)
        if (c1.pos.x - c1.radius < 300){
            c2.pos.x = 300 + c1.radius
            s.stroke(250, 200, 90)
        }
        line(s, s.createVector(300, 100), s.createVector(300, 300))
        s.stroke(0)
        if (c1.pos.x + c1.radius > 500){
            c2.pos.x = 500 - c1.radius
            s.stroke(250, 200, 90)
        }
        line(s, s.createVector(500, 100), s.createVector(500, 300))
        s.strokeWeight(s.height/200);
        s.stroke(0)
        s.fill(250, 200, 90)
        c2.draw(s);
        s.fill(50, 150)
        c1.draw(s);
    }
}));