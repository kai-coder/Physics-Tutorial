class body{
        constructor(s, pos, shapes, torque, mass, g, e, r=5, color=[255, 255, 255], label="gameObject"){
                this.label = label;
                this.s = s
                this.pos = pos
                this.shapes = shapes
                if (mass == 0){
                        this.mass = 0
                }else{
                        this.mass = 1 / mass
                }
                this.vel = this.s.createVector(0, 0)
                this.f = this.s.createVector(0, 0)
                this.g = g
                this.e = e
                this.r = r
                this.color = color
        }
        update(dt){
                this.pos.add(p5.Vector.mult(this.vel, dt))
                for (let i = 0; i <  this.shapes.length; i++){
                        this.shapes[i].update(this.pos, this.r)
                }
                this.f.add(this.g)
                this.vel.add(this.f.mult(dt))
                this.f.set(0, 0)
        }
        draw(s){
                s.stroke(0)
                s.fill(this.color[0], this.color[1], this.color[2])
                circle(s, this.pos, this.r - s.height / 400)
                for (let i = 0; i <  this.shapes.length; i++){
                        //this.shapes[i].draw(s)
                }
        }
}

class AABB{
        constructor(min, max){
                this.min = min
                this.max = max
        }
}

class Manifold{
        constructor(A, B, body, body2){
                this.A = A
                this.B = B
                this.body = body
                this.body2 = body2
                this.pen = 0
                this.norm = 0
        }
}

class Circle{
        constructor(s, offset, scale) {
                this.s = s;
                this.pos = this.s.createVector(0, 0);
                this.offset = offset;
                this.r = 0;
                this.scale = scale;
                this.AABB = new AABB(this.s.createVector(this.pos.x - this.r, this.pos.y - this.r), 
                                this.s.createVector(this.pos.x + this.r, this.pos.y + this.r));
        }

        update(pos, r){
                this.pos = p5.Vector.add(pos, this.offset);
                this.r = r * this.scale;
                this.AABB = new AABB(this.s.createVector(this.pos.x - this.r, this.pos.y - this.r), 
                                this.s.createVector(this.pos.x + this.r, this.pos.y + this.r));
        }
        
        draw(s){
                s.stroke(0, 255, 0)
                s.noFill()
                circle(s, this.pos, this.r - s.height / 400)
        }
}

function AABBvsAABB(a, b){
        if (a.max.x < b.min.x || a.min.x > b.max.x){
                return false
        }
        if (a.max.y < b.min.y || a.min.y > b.max.y){ 
                return false
        }
        
        return true
}

function circleManifold(s, manifold){
        a = manifold.A 
        b = manifold.B
        n = p5.Vector.sub(b.pos, a.pos)
        r = a.r + b.r
        if (p5.Vector.dot(n, n) > r * r){
                return false
        }
        d = n.mag()
        if (d!=0){
                manifold.pen = r - d
                manifold.norm = n.div(d)
                return true
        }else{
                manifold.pen = r
                a = s.random(0, 2 * s.PI)
                manifold.norm = s.createVector(s.cos(a), s.sin(a))
                return true
        }
}

function PositionalCorrection(s, manifold){
        pen = manifold.pen
        n = manifold.norm
        b = manifold.body
        b2 = manifold.body2
        percent = 0.8
        slop = 0.01
        correction = p5.Vector.mult(n, s.max(pen - slop, 0.0) / (b.mass + b2.mass) * percent)
        b.pos.sub(p5.Vector.mult(correction, b.mass))
        b2.pos.add(p5.Vector.mult(correction, b2.mass))
}

function manImpulse(s, manifold){
        b = manifold.body
        b2 = manifold.body2
        ms = b.mass + b2.mass
        if (ms == 0){ 
                return
        }
        vel = p5.Vector.sub(b2.vel, b.vel)
        velNormal = p5.Vector.dot(vel, manifold.norm)
        if (velNormal > 0){ 
                return
        }
        e = s.min(b.e, b2.e)
        j = -(1 + e) * velNormal
        j /= ms
        imp = p5.Vector.mult(manifold.norm, j)
        b.vel.sub(p5.Vector.mult(imp, b.mass))
        b2.vel.add(p5.Vector.mult(imp, b2.mass))
}

sketches.push(new p5(function( s ) {
    var circles = []
    for (let i = 0; i < 10; i++){
        var pos = s.createVector(s.random(0, 800), -s.random(0, 100));
        var gravity = s.createVector(0, 9.8 * 100);
        var collider = new Circle(s, s.createVector(0, 0), 1)
        color = [245, 190, 185]
        b = new body(s, pos, [collider], 0, 1, gravity, 0.5, 7, color, "break2")
        b.vel.set(s.random(-50, 50), s.random(-50, 50))
        circles.push(b)
    }
    for (let o = 0; o < 2; o++){
        for (let i = 0; i < 3; i++){ 
            for (let j = 0; j < 16; j++){ 
                var pos = s.createVector(j * 50 + i % 2 * 25 + 25, o * 250 + i * 40 + 35);
                var gravity = s.createVector(0, 0);
                var collider = new Circle(s, s.createVector(0, 0), 1)
                if (j % 2 == 0 && i == 1){
                    color = [140, 160, 130]
                    label = "break"
                    r = 10
                }else{
                    color = [230, 240, 225]
                    label = "gameObject"
                    r = 5
                }
                if (j < 15 || i != 1){
                    circles.push(new body(s, pos, [collider], 0, 0, gravity, 0.5, r, color, label))
                }
            }
        }
    }
    for (let i = 0; i < 7 ; i++){ 
        var pos = s.createVector(i * 125 + 25, 200);
        var gravity = s.createVector(0, 0);
        var collider = new Circle(s, s.createVector(0, 0), 1)
        if (i % 2 == 1){
            label = "gameObject"
            color = [250, 200, 90]
            circles.push(new body(s, pos, [collider], 0, 0, gravity, 2, 50, color, label))
        }else{
            label = "break"
            color = [140, 160, 130]
            circles.push(new body(s, pos, [collider], 0, 0, gravity, 0.5, 10, color, label))
        }
    }
    var numCheck = 20
    var fps = 60 * numCheck;
    var dt = 1 / fps;
    var acc = 0;
    var fs = new Date().getTime()
    var won = true;
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
    }
    s.draw = function() {
        //console.log((new Date().getTime() - fs) / 1000)
        ct = Date.now()
        acc += (ct - fs) / 1000
        fs = ct
        if (acc / dt > 40){
            acc = dt * 40
        }
        while(acc > dt){
            var manifolds = []
            for (let i = 0; i < circles.length; i++){
                circles[i].update(dt);
            }
            for (let i = 0; i < circles.length; i++){
                for (let j = i + 1; j < circles.length; j++){
                    for (let k = 0; k < circles[i].shapes.length; k++){
                        for (let l = 0; l < circles[j].shapes.length; l++){
                            if(AABBvsAABB(circles[i].shapes[k].AABB, 
                            circles[j].shapes[l].AABB) &&
                            circles[i].mass + circles[j].mass > 0){
                                manifold = new Manifold(circles[i].shapes[k],
                                    circles[j].shapes[l], circles[i], circles[j])
                                if (circleManifold(s, manifold)){
                                    manifolds.push(manifold)
                                }
                            }
                        }
                    }
                }
            }
            for (let i = 0; i < manifolds.length; i++){
                PositionalCorrection(s, manifolds[i])
            }
            for (let c = 0; c < 8; c++){
                for (let i = 0; i < manifolds.length; i++){
                    manImpulse(s, manifolds[i])
                }
            }
            for (let i = 0; i < manifolds.length; i++){
                if(manifolds[i].body.label == "break"){
                    manifolds[i].body.r -= 1;
                } 
                if(manifolds[i].body2.label == "break"){
                    manifolds[i].body2.r -= 1;
                }
            }
            acc -= dt
        }
        for (let i = 0; i < circles.length; i++){
            if (circles[i].label == "break2"){
                if(circles[i].pos.y > 410 || circles[i].pos.x > 810 || circles[i].pos.x < -10 || circles[i].r <= 2){
                    circles[i].pos = s.createVector(s.random(0, 800), -s.random(0, 100));
                    circles[i].vel.set(s.random(-50, 50), s.random(-50, 50));
                    circles[i].r = 7
                }
            }else if (circles[i].r <= 2 && circles[i].label == "break"){
                circles.splice(i, 1)
            }
        }
        s.strokeWeight(s.height/200);
        s.background(200, 220, 230);
        //c1.update();
        s.fill(230, 240, 225);
        for (let i = 0; i < circles.length; i++){
            circles[i].draw(s);
        }
    }
}));


