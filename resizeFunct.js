sketches = []

function enable(sketch){
    sketches[sketch].loop()
    for (enableNum = 0; enableNum < sketches.length; enableNum++){
        if (enableNum != sketch){
            sketches[enableNum].noLoop();
        }
    }
}

function windowResized() {
    for (sketchNum = 0; sketchNum < sketches.length; sketchNum++) {
        
        sketches[sketchNum].resizeCanvas(sketches[sketchNum].select('#sketch' + String(sketchNum)).width, 
        sketches[sketchNum].select('#sketch' + String(sketchNum)).height);
    }
}