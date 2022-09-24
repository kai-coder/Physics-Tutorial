function dotLine(s, l1, l2, l){
    l1 = p5.Vector.mult(l1, s.height / 400)
    l2 = p5.Vector.mult(l2, s.height / 400)
    l = l * s.height / 400
    dx = l2.x - l1.x
    dy = l2.y - l1.y
    dist = p5.Vector.sub(l1, l2).mag()
    loop = dist / l
    for (f = 0; f < parseInt(loop); f++){
        if (parseInt(f) % 2 == 0) {
            s.line((dx/loop) * f + l1.x, (dy/loop) * f + l1.y, (dx/loop) * (f+1) + l1.x, (dy/loop) * (f+1) + l1.y)
        }
    }
    if (parseInt(loop) % 2 == 0){
        if (loop > 1){
            s.line((dx/loop) * (f)+l1.x, (dy/loop) * (f)+l1.y, l2.x, l2.y)
        }else{
            s.line(l1.x, l1.y, l2.x, l2.y) 
        } 
    }
}

function line(s, l1, l2){
    l1 = p5.Vector.mult(l1, s.height / 400)
    l2 = p5.Vector.mult(l2, s.height / 400)
    s.line(l1.x, l1.y, l2.x, l2.y)
}

function circle(s, pos, r){
    pos = p5.Vector.mult(pos, s.height / 400)
    r *= s.height / 400
    s.circle(pos.x, pos.y, r * 2);
}

function rect(s, pos, size){
    pos = p5.Vector.mult(pos, s.height / 400)
    size = p5.Vector.mult(size, s.height / 400)
    s.rect(pos.x, pos.y, size.x, size.y);
}

function txt(s, txt, pos){
    pos = p5.Vector.mult(pos, s.height / 400);
    s.text(txt, pos.x, pos.y);
}

function txtLine(s, txt, l1, l2, angle, ox = 0, oy = 0){
    l1 = p5.Vector.mult(l1, s.height / 400)
    l2 = p5.Vector.mult(l2, s.height / 400)
    dxy = p5.Vector.sub(l1, l2)
    s.push();
    dist = dxy.mag()
    if (angle === undefined){
        angle = s.atan2(dxy.y, dxy.x);
        if (s.abs(angle) > s.PI/2){
            angle += s.PI 
        }
    }
    s.translate(p5.Vector.add(l1, l2).div(2).add(s.createVector(ox, oy).mult(s.height / 400)));
    s.rotate(angle);
    s.text(txt, 0, 0);
    s.pop();
}

function randRange(min, max) {
    return Math.random() * (max - min) + min;
}