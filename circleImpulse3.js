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
        for (l = 0; l < 1; l++){
            for (i = 0; i < circArray.length; i++){
                circArray[i].boundaryCheck(0, 0, 800, 400)
                for (j = i + 1; j < circArray.length; j++){
                    circArray[i].circleCheck(s, circArray[j], 1)
                }
            }
            for (i = 0; i < circArray.length; i++){
                circArray[i].resolve()
            }
        }
        for (i = 0; i < circArray.length; i++){
            circArray[i].draw(s)
        }
    }
}));

sketches.push(new p5(function( s ) {    
    var vectorPos;
    var vectorDrag = false;
    var vectorPos2;
    var vectorDrag2 = false;
    var vel;
    var velDrag = false;
    var vel2;
    var velDrag2 = false;
    s.touchStarted = function(){
        checkPos = mouseCoords(s)
        clickR = 30
        if (s.touches.length > 0){
            clickR = 45
        }
        if (p5.Vector.sub(checkPos, p5.Vector.add(vectorPos, vel)).mag() < clickR){
            vel = p5.Vector.sub(checkPos, vectorPos)
            velDrag = true
        }else if (p5.Vector.sub(checkPos, vectorPos).mag() < clickR){
            vectorPos = checkPos
            vectorDrag = true
        }else if (p5.Vector.sub(checkPos, p5.Vector.add(vectorPos2, vel2)).mag() < clickR){
            vel2 = p5.Vector.sub(checkPos, vectorPos2)
            velDrag2 = true
        }else if (p5.Vector.sub(checkPos, vectorPos2).mag() < clickR){
            vectorPos2 = checkPos
            vectorDrag2 = true
        }
    }
    s.touchEnded = function(){
        vectorDrag = false
        vectorDrag2 = false
        velDrag = false
        velDrag2 = false
    }
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch1').width, s.select('#sketch1').height);
        canvas.parent('sketch1');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        s.textStyle(s.BOLD);
        vectorPos = s.createVector(400, 200)
        vectorPos2 = s.createVector(200, 100)
        vel = s.createVector(300, 0)
        vel2 = s.createVector(50, 100)
    }

    s.draw = function() {
        dragPos = mouseCoords(s)
        if (vectorDrag){
            vectorPos = dragPos
        }else if(vectorDrag2){
            vectorPos2 = dragPos
        }else if(velDrag){
            vel = p5.Vector.sub(dragPos, vectorPos)
        }else if(velDrag2){
            vel2 = p5.Vector.sub(dragPos, vectorPos2)
        }
        s.stroke(0)
        s.background(200, 220, 230);
        s.fill(250, 200, 90)
        s.strokeWeight(s.height/200);
        circle(s, vectorPos2, 50)
        s.fill(230, 240, 225)
        s.strokeWeight(s.height/200);
        circle(s, vectorPos, 50)
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos2, vectorPos)
        s.stroke(230, 240, 225)
        s.strokeWeight(s.height/50);
        line(s, vectorPos2, vectorPos)
        normalized = p5.Vector.sub(vectorPos2, vectorPos).normalize()
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.mult(normalized, 50)))
        s.strokeWeight(s.height/50);
        s.stroke(250, 200, 90)
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.mult(normalized, 50)))
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos2, p5.Vector.add(vectorPos2, vel2))
        s.strokeWeight(s.height/50);
        s.stroke(230, 240, 225)
        line(s, vectorPos2, p5.Vector.add(vectorPos2, vel2))
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, p5.Vector.add(vectorPos, vel), p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)))
        s.stroke(230, 240, 225)
        s.strokeWeight(s.height/50);
        line(s, p5.Vector.add(vectorPos, vel), p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)))
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos, p5.Vector.add(vectorPos, vel))
        s.strokeWeight(s.height/50);
        s.stroke(250, 200, 90)
        line(s, vectorPos, p5.Vector.add(vectorPos, vel))
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        s.stroke(0)
        dotProduct = p5.Vector.dot(p5.Vector.sub(vel, vel2), normalized)
        dotLine(s, p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)), p5.Vector.add(vectorPos, 
            p5.Vector.mult(normalized, dotProduct)), 20)
        s.strokeWeight(s.height/50);
        s.stroke(0, 167, 255)
        dotLine(s, p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)), p5.Vector.add(vectorPos, 
            p5.Vector.mult(normalized, dotProduct)), 20)
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)))
        s.strokeWeight(s.height/50);
        s.stroke(78, 91, 238)
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)))
        s.stroke(0)
        s.strokeWeight(s.height/50 + s.height/200 * 2);
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.mult(normalized, dotProduct)))
        s.strokeWeight(s.height/50);
        s.stroke(221, 105, 221)
        line(s, vectorPos, p5.Vector.add(vectorPos, p5.Vector.mult(normalized, dotProduct)))
        s.noStroke()
        s.fill(230, 240, 225, 150)
        circle(s, vectorPos2, 30)
        s.fill(230, 240, 225)
        s.stroke(0)
        s.strokeWeight(s.height/200);
        circle(s, vectorPos2, 10)
        s.noStroke()
        s.fill(230, 240, 225, 150)
        circle(s, p5.Vector.add(vectorPos2, vel2), 30)
        s.fill(230, 240, 225)
        s.stroke(0)
        s.strokeWeight(s.height/200);
        circle(s, p5.Vector.add(vectorPos2, vel2), 10)
        s.noStroke()
        s.fill(250, 200, 90, 150)
        circle(s, vectorPos, 30)
        s.fill(250, 200, 90)
        s.stroke(0)
        s.strokeWeight(s.height/200);
        circle(s, vectorPos, 10)
        s.noStroke()
        s.fill(250, 200, 90, 150)
        circle(s, p5.Vector.add(vectorPos, vel), 30)
        s.fill(250, 200, 90)
        s.stroke(0)
        s.strokeWeight(s.height/200);
        circle(s, p5.Vector.add(vectorPos, vel), 10)
        s.fill(0, 160, 160)
        s.textSize(s.width/32)
        s.stroke(200, 220, 230)
        s.strokeWeight(s.height/100)
        s.textAlign(s.CENTER, s.BOTTOM)
        txtLine(s, "velDif(a)", vectorPos, p5.Vector.add(vectorPos, p5.Vector.sub(vel, vel2)), undefined, 0, -10)
        s.textAlign(s.CENTER, s.TOP)
        txtLine(s, "Scalar * Norm", vectorPos, 
        p5.Vector.add(vectorPos, p5.Vector.mult(normalized, dotProduct)), undefined, 0, 10)
        s.textAlign(s.CENTER, s.BOTTOM)
        txtLine(s, "Norm(b)", vectorPos, p5.Vector.add(vectorPos, p5.Vector.mult(normalized, 50)), undefined, 0, -10)
    }
}));