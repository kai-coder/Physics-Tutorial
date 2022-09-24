sketches.push(new p5(function( s ) {
    function clickFunct(s){
        circArray = []
        for (i = 0; i < 10; i++){
            pos = s.createVector(randRange(0, 800), randRange(0, 400))
            radius = randRange(5, 50)
            vel = s.createVector(randRange(-5, 5), randRange(-5, 5))
            circArray.push(new circleCollider(pos, radius, vel, 0.8))
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
            circArray.push(new circleCollider(pos, radius, vel, 0.8))
        }
    }

    s.draw = function() {
        s.strokeWeight(s.height/200);
        s.background(200, 220, 230);
        s.fill(230, 240, 225)
        for (i = 0; i < circArray.length; i++){
            circArray[i].update(0.2)
        }
        for (l = 0; l < 3; l++){
            for (i = 0; i < circArray.length; i++){
                circArray[i].boundaryCheck(0, 0, 800, 400, 1)
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