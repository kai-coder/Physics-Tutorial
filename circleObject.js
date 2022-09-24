class circleCollider{
    constructor(pos, radius, vel, e=1) {
        this.pos = pos;
        this.radius = radius;
        this.vel = vel;
        this.mass = radius;
        this.posx = 0;
        this.posy = 0;
        this.numx = 0;
        this.numy = 0;
        this.velx = 0;
        this.vely = 0;
        this.velnumx = 0;
        this.velnumy = 0;
        this.e = e
    }
    update(g){
        this.vel.y += g
        this.pos.add(this.vel)
    }
    boundaryCheck(bx, by, bw, bh){
        if (this.pos.x - this.radius <= bx){
            this.vel.x *= -this.e
            this.velnumx+=1
            this.posx += bx + this.radius
            this.numx += 1
        }
        if (this.pos.x + this.radius >= bx + bw){
            this.vel.x *= -this.e
            this.velnumx+=1
            this.posx += bx + bw - this.radius
            this.numx += 1
        }

        if (this.pos.y - this.radius <= by){
            this.vel.y *= -this.e
            this.velnumy+=1
            this.posy += by + this.radius
            this.numy += 1
        }
        if (this.pos.y + this.radius >= by + bh){
            this.vel.y *= -this.e
            this.velnumy+=1
            this.posy += by + bh - this.radius
            this.numy += 1
        }
    }
    circleCheck(s, c2, b=1){
        if (circleCircle(this, c2)){
            var dx = c2.pos.x - this.pos.x
            var dy = c2.pos.y - this.pos.y
            var dist = p5.Vector.sub(this.pos, c2.pos).mag()
            var change = dist - (this.radius + c2.radius)
            var cos;
            var sin;
            if (dist > 0){
                cos = dx / dist
                sin = dy / dist
            }else{
                var a = randRange(0, s.PI * 2)
                cos = s.cos(a)
                sin = s.sin(a)
            }
            this.posx += this.pos.x + cos * change / 2
            this.posy += this.pos.y + sin * change / 2
            c2.posx += c2.pos.x - cos * change / 2
            c2.posy += c2.pos.y - sin * change / 2
            this.numx += 1
            this.numy += 1
            c2.numx += 1
            c2.numy += 1
            
            var veldif = p5.Vector.sub(this.vel, c2.vel)
            var posdif = p5.Vector.sub(c2.pos, this.pos).div(dist)
            var c = -(1 + this.e) * veldif.dot(posdif)
            var j = c * this.mass * c2.mass / (this.mass + c2.mass)
            this.vel.x += posdif.x * j / this.mass
            this.vel.y += posdif.y * j / this.mass
            c2.vel.x -= posdif.x * j / c2.mass
            c2.vel.y -= posdif.y * j / c2.mass
            /*
            var p = 2 * (this.vel.x * cos + this.vel.y * sin - c2.vel.x * cos - c2.vel.y * sin) / (this.radius + c2.radius)
            this.vel.x -=  p * c2.radius * cos
            this.vel.y -=  p * c2.radius * sin
            c2.vel.x +=  p * this.radius * cos
            c2.vel.y +=  p * this.radius * sin*/
        }
    }
    resolve(){
        if (this.numx > 0){
            this.pos.x = this.posx / this.numx
        }
        if (this.numy > 0){
            this.pos.y = this.posy / this.numy
        }
        this.velx = 0;
        this.vely = 0;
        this.velnumx = 0;
        this.velnumy = 0;
        this.posx = 0;
        this.posy = 0;
        this.numx = 0;
        this.numy = 0;
    }
    draw(s){
        circle(s, this.pos, this.radius - s.height / 400)
    }
}

function mouseCoords(s){
    return s.createVector(s.mouseX / (s.height / 400), s.mouseY / (s.height / 400))
}

function circleCircle(c1, c2){
    return p5.Vector.sub(c1.pos, c2.pos).mag() <= c1.radius + c2.radius;
}