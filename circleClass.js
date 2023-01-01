class gameObject {
        constructor(s, pos, r) {
                this.s = s;
                this.pos = pos;
                this.r = r;
        }
    
        draw() {
                circle(this.s, this.pos, this.r);
        }
}
    
class rigidBody {
        constructor(s, parent, gravity) {
                this.s = s;
                this.parent = parent;
                this.gravity = gravity;
                this.vel = this.s.createVector(0, 0);
        }

        update(){
                // Accelerate rigidBody with gravity
                this.vel.add(this.gravity);

                // Update parent position with velocity
                this.parent.pos.add(this.vel);
        }
}

sketches.push(new p5(function( s ) {
    var c1;
    var c2;
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        // Create two gameObjects
        pos = s.createVector(0, 0);
        c1 = new gameObject(s, pos, 20);

        pos = s.createVector(400, 0);
        c2 = new gameObject(s, pos, 100);

        // Create rigidBody of gameObject
        gravity = s.createVector(0, 0.01);
        c2.rigidBody = new rigidBody(s, c2, gravity);
    }
    s.draw = function() {
        s.strokeWeight(s.height/200);
        s.background(200, 220, 230);
        c1.pos.set(mouseCoords(s));
        c2.rigidBody.update();
        s.fill(230, 240, 225)
        c2.draw(s)
        s.fill(50, 150);
        c1.draw(s)
    }
}));