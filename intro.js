function polygon(s, points) {
    s.beginShape();
    for (let i = 0; i < points.length; i++) {
      pointPos = points[i]
      s.vertex(pointPos.x, pointPos.y);
    }
    s.endShape(s.CLOSE);
}

function regPolygon(s, r, pointNum){
    points = []
    a = 2 * s.PI / pointNum;
    for (let i = 0; i < pointNum; i ++) {
        points.push(s.createVector(s.cos(i * a), s.sin(i * a)).mult(r));
    }
    return points
}

function rotPoly(s, points, a){
    rotPoints = []
    for (let i = 0; i < points.length; i++) {
        rotPoints.push(s.createVector(points[i].x * s.cos(a) - points[i].y * s.sin(a), points[i].x * s.sin(a) + points[i].y * s.cos(a)));
    }
    return rotPoints;
}

function scalePoly(points, s){
    scalePoints = []
    for (let i = 0; i < points.length; i++) {
        scalePoints.push(p5.Vector.mult(points[i], s));
    }
    return scalePoints;
}

function genAABB(s, points){
    var minMax = [s.createVector(Infinity, Infinity), s.createVector(-Infinity, -Infinity)]
    for (let i = 0; i < points.length; i++){
        if(points[i].x < minMax[0].x){
            minMax[0].x = points[i].x
        }
        if(points[i].y < minMax[0].y){
            minMax[0].y = points[i].y
        }
        if(points[i].x > minMax[1].x){
            minMax[1].x = points[i].x
        }
        if(points[i].y > minMax[1].y){
            minMax[1].y = points[i].y
        }
    }
    return minMax
}

class body{
    constructor(s, pos, shapes, torque, rotateHard, mass, g, e, points, color=[255, 255, 255], label="gameObject"){
        this.label = label;
        this.s = s
        this.pos = pos
        this.shapes = shapes
        this.torque = torque
        this.points = points
        for (let i = 0; i < this.shapes.length; i++){
            if(this.shapes[i].constructor.name == "Circle"){
                if(isNaN(this.shapes[i].points)){
                    this.shapes[i].orgPoints = points
                }
            }
        }
        if (mass == 0){
            this.mass = 0
        }else{
            this.mass = 1 / mass
        }
        this.vel = this.s.createVector(0, 0)
        this.f = this.s.createVector(0, 0)
        this.g = g
        this.e = e
        this.orientation = 0
        this.angularVelocity = 0
        if (rotateHard == 0){
            this.rotateHard = 0
        }else{
            this.rotateHard = 1 / rotateHard
        }
        this.color = color
    }
    update(dt){
        this.f.add(this.g)
        this.vel.add(this.f.mult(dt))
        this.pos.add(p5.Vector.mult(this.vel, dt))
        this.angularVelocity += this.torque * dt
        this.orientation += this.angularVelocity * dt
        for (let i = 0; i <  this.shapes.length; i++){
            this.shapes[i].update(this.pos, this.orientation)
        }
        this.f.set(0, 0)
    }
    draw(){
        this.s.fill(this.color[0], this.color[1], this.color[2])
        this.s.stroke(0, 0, 0)
        polygon(this.s, this.pos, rotPoly(this.s, this.points, this.orientation))
        for (let i = 0; i <  this.shapes.length; i++){
            this.shapes[i].draw();
        }
    }
}

class AABB{
    constructor(min, max){
        this.min = min
        this.max = max
    }
    draw(s){
        s.noFill()
        s.stroke(0)
        s.rect(this.min.x, this.min.y, this.max.x - this.min.x, this.max.y - this.min.y)
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
        this.contactPoint = 0
    }
}

class Circle{
    constructor(s, offset, scale, points=NaN) {
        this.s = s;
        this.pos = this.s.createVector(0, 0);
        this.offset = offset;
        this.orgPoints = points;
        this.points;
        this.scale = scale;
        this.AABB;
    }

    update(pos, orientation){
        this.pos = p5.Vector.add(pos, this.offset);
        this.points = scalePoly(this.orgPoints, 1);
        this.points = rotPoly(this.s, this.orgPoints, orientation);
        for (let i = 0; i < this.points.length; i++) {
            this.points[i].add(pos)
        }
        var newAABB = genAABB(this.s, this.points)
        this.AABB = new AABB(newAABB[0], newAABB[1]);
    }

    draw(){
        this.s.stroke(0, 0, 0)
        //this.s.noFill()
        polygon(this.s, this.points)
        //this.AABB.draw(this.s)
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

function getNorm(s, side){
    return s.createVector(-(side[0].y - side[1].y), side[0].x - side[1].x);
}
function genminMax(s, n, a){
    scales = [Infinity, -Infinity]
    for (var i = 0; i < a.length; i++){
        scale = n.dot(a[i])
        if (scale < scales[0]){
            scales[0] = scale
        }
        if (scale > scales[1]){
            scales[1] = scale
        }
    }
    return scales
}
function SAT(s, a, b){
    for (var i = 0; i < a.points.length; i++){
        if (i == a.points.length - 1){
            j = 0
        }else{
            j = i + 1
        }
        norm = getNorm(s, [a.points[i], a.points[j]])
        aMinMax = genminMax(s, norm, a.points)
        //console.log(aMinMax)
        bMinMax = genminMax(s, norm, b.points)
        //console.log(bMinMax)
        /*s.line(0, 0, s.abs(norm.x) * 1000, s.abs(norm.y) * 1000)  
        s.line(0, 0, s.abs(norm.x) * 1000, s.abs(norm.y) * 1000) 
        s.strokeWeight(40)
        s.stroke(255, 0, 0)
        s.line(0, 0, s.abs(norm.x) * aMinMax[0], s.abs(norm.y) * aMinMax[0])
        s.strokeWeight(2) 
        s.line(s.abs(norm.x) * aMinMax[0], s.abs(norm.y) * aMinMax[0], s.abs(norm.x) * aMinMax[0] + s.abs(norm.y) * aMinMax[0], s.abs(norm.y) * aMinMax[0] - s.abs(norm.x) * aMinMax[0]) 
        s.strokeWeight(30)
        s.stroke(0, 0, 255)
        s.line(0, 0, s.abs(norm.x) * aMinMax[1], s.abs(norm.y) * aMinMax[1]) 
        s.strokeWeight(2)
        s.line(s.abs(norm.x) * aMinMax[1], s.abs(norm.y) * aMinMax[1], s.abs(norm.x) * aMinMax[1] + s.abs(norm.y) * aMinMax[1], s.abs(norm.y) * aMinMax[1] - s.abs(norm.x) * aMinMax[1]) 
        s.stroke(0, 255, 255)
        s.strokeWeight(20)
        s.line(0, 0, s.abs(norm.x) * bMinMax[0], s.abs(norm.y) * bMinMax[0]) 
        s.strokeWeight(2)
        s.line(s.abs(norm.x) * bMinMax[0], s.abs(norm.y) * bMinMax[0], s.abs(norm.x) * bMinMax[0] + s.abs(norm.y) * bMinMax[0], s.abs(norm.y) * bMinMax[0] - s.abs(norm.x) * bMinMax[0]) 
        s.strokeWeight(10)
        s.stroke(0, 255, 0)
        s.line(0, 0, s.abs(norm.x) * bMinMax[1], s.abs(norm.y) * bMinMax[1]) 
        s.strokeWeight(2)
        s.line(s.abs(norm.x) * bMinMax[1], s.abs(norm.y) * bMinMax[1], s.abs(norm.x) * bMinMax[1]+s.abs(norm.y) * bMinMax[1], s.abs(norm.y) * bMinMax[1]-s.abs(norm.x) * bMinMax[1])
        */
        //s.line(a.points[i].x, a.points[i].y, a.points[i].x + norm.x * 10, a.points[i].y + norm.y * 10) 
       if (aMinMax[1] < bMinMax[0] || aMinMax[0] > bMinMax[1]){
            return false
        }else{
            continue
        }
    }
    for (var i = 0; i < b.points.length; i++){
        if (i == b.points.length - 1){
            j = 0
        }else{
            j = i + 1
        }
        norm = getNorm(s, [b.points[i], b.points[j]])
        aMinMax = genminMax(s, norm, a.points)
        //console.log(aMinMax)
        bMinMax = genminMax(s, norm, b.points)
        //console.log(bMinMax)
        //s.line(b.points[i].x, b.points[i].y, b.points[i].x + norm.x * 10, b.points[i].y + norm.y * 10)   
        if (aMinMax[1] < bMinMax[0] || aMinMax[0] > bMinMax[1]){
            return false
        }else{
            continue
        }
    }
    return true
}
function farAlongNormal(n, points){
    var farIndex;
    let farDist = -Infinity;

    for (var i = 0; i < points.length; i++){
        currDist = n.dot(points[i])
        if (currDist > farDist){
            farDist = currDist
            farIndex = i
        }
    }
    return farIndex
}
function loopIndex(array, index){
    len = array.length
    return ((index % len) + len) % len
}
function clockPoints(pos, a, b){
    aT = p5.Vector.sub(a, pos)
    bT = p5.Vector.sub(b, pos)
    if ((aT.x * bT.y) - (aT.y * bT.x) < 0){
        return [b, a]
    }
    return [a, b]
}
function genManifoldSides(s, n, a){
    var aInfo = [];
    for (let i = 0; i < a.points.length; i++){
        j = farAlongNormal(n, a.points)

        s.fill(255, 0, 225);

        k = loopIndex(a.points, j + 1)
        k2 = loopIndex(a.points, j - 1)
        norm = getNorm(s, clockPoints(a.pos, a.points[j], a.points[k])).normalize();
        norm2 = getNorm(s, clockPoints(a.pos, a.points[j], a.points[k2])).normalize();
        dot = p5.Vector.dot(norm, n.normalize());
        dot2 = p5.Vector.dot(norm2, n.normalize());

        incIndex = 0
        
        if(s.abs(dot) > s.abs(dot2)){
            incIndex = k
            k3 = loopIndex(a.points, j - 1)
            k4 = loopIndex(a.points, k + 1)
        }else{
            norm = norm2
            incIndex = k2
            k3 = loopIndex(a.points, j + 1)
            k4 = loopIndex(a.points, k2 - 1)
        }
        aDot = s.max(s.abs(dot), s.abs(dot2))
        aInfo.push([aDot, a.points[j], norm])
        aInfo.push(clockPoints(a.pos, a.points[j], a.points[incIndex]))
        aInfo.push(clockPoints(a.pos, a.points[j], a.points[k3]))
        aInfo.push(clockPoints(a.pos, a.points[incIndex], a.points[k4]))
    }
    return aInfo;
}
function outsideLine(a1, a2, p){
    return (a2.x - a1.x) * (p.y - a1.y) < (a2.y - a1.y) * (p.x - a1.x)
}
function clipSides(s, aInfo, bInfo, manifold){
    circles = []
    for (let i = 3; i > 0; i--){
        for (let j = 0; j < 2; j++){
            if(outsideLine(aInfo[i][0], aInfo[i][1], bInfo[1][j])){
                if (i != 1){
                    dc = p5.Vector.sub(aInfo[i][0], aInfo[i][1])
                    dp = p5.Vector.sub(bInfo[1][0], bInfo[1][1])
                    n1 = aInfo[i][0].x * aInfo[i][1].y - aInfo[i][0].y * aInfo[i][1].x
                    n2 = bInfo[1][0].x * bInfo[1][1].y - bInfo[1][0].y * bInfo[1][1].x
                    n3 =  1 / (dc.x * dp.y - dc.y * dp.x)
                    bInfo[1][j] = s.createVector((n1 * dp.x - n2 * dc.x) * n3, (n1 * dp.y - n2 * dc.y) * n3)
                }
            }else if (i == 1){
                circles.push(bInfo[1][j])
            }
        }
    }
    if (outsideLine(aInfo[1][0], aInfo[1][1], manifold.B.pos)){
        manifold.norm = aInfo[0][2]
    }else{
        manifold.norm = s.createVector(-aInfo[0][2].x, -aInfo[0][2].y)
    }
    min = Infinity
    for (let j = 0; j < circles.length; j++){
        //s.circle(circles[j].x, circles[j].y, 30)
        refC = p5.Vector.dot(manifold.norm, s.createVector(aInfo[1][0], aInfo[1][1]))
        subVal = p5.Vector.sub(aInfo[1][1], aInfo[1][0]).normalize()
        subDot = p5.Vector.dot(p5.Vector.sub(circles[j], aInfo[1][1]), subVal);
        pen = p5.Vector.sub(circles[j], subVal.mult(subDot).add(aInfo[1][1])).dot(manifold.norm)
        manifold.pen += pen
    }
    manifold.contactPoint = circles;
    manifold.pen /= circles.length
    /*s.stroke(255, 0, 0)
    s.circle(aInfo[1][0].x, aInfo[1][0].y, 5)
    s.stroke(255, 255, 255)
    s.circle(aInfo[1][1].x, aInfo[1][1].y, 5)
    s.fill(0)*/
    
}

function circleManifold(s, manifold){
    let a = manifold.A;
    let b = manifold.B;
    if(SAT(s, a, b)){
        n = p5.Vector.sub(b.pos, a.pos)
        aInfo = genManifoldSides(s, n, a)
        
        n = p5.Vector.sub(a.pos, b.pos)
        bInfo = genManifoldSides(s, n, b)

        s.strokeWeight(10)
        if(aInfo[0][0] > bInfo[0][0]){
            s.fill(255)
            //s.line(aInfo[1][0].x, aInfo[1][0].y, aInfo[1][1].x, aInfo[1][1].y)
            clipSides(s, aInfo, bInfo, manifold)
        }else{
            s.fill(0)
            //s.line(bInfo[1][0].x, bInfo[1][0].y, bInfo[1][1].x, bInfo[1][1].y)
            clipSides(s, bInfo, aInfo, manifold)
        }
        return true
    }
    return false
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
function cross(a, b){
    return a.x * b.y - a.y * b.x
}
function cross2(b, a){
    return a.x * b - a.y * b
}
function manImpulse(s, manifold){
    a = manifold.body
    b = manifold.body2
    ms = a.mass + b.mass
    impulseList = []
    raList = []
    rbList = []
    jList = []
    for (let i = 0; i < manifold.contactPoint.length; i++){
        ra = p5.Vector.sub(manifold.contactPoint[i], a.pos)
        rb = p5.Vector.sub(manifold.contactPoint[i], b.pos)
        raList.push(ra)
        rbList.push(rb)
        ra = s.createVector(-ra.y, ra.x)
        rb = s.createVector(-rb.y, rb.x)
        if (ms == 0){ 
            return
        }
        aLVelA = p5.Vector.mult(ra, a.angularVelocity).add(a.vel)
        aLVelB = p5.Vector.mult(rb, b.angularVelocity).add(b.vel)
        //rv = p5.Vector.sub(b.vel, a.vel)
        rv = p5.Vector.sub(aLVelB, aLVelA)
        contactVel = p5.Vector.dot(rv, manifold.norm)
        //console.log(contactVel)
        if (contactVel > 0){ 
            return
        }
        e = s.min(a.e, b.e)
        raCrossN = p5.Vector.dot(ra, manifold.norm)
        rbCrossN = p5.Vector.dot(rb, manifold.norm)
        ms = a.mass + b.mass + raCrossN**2 * a.rotateHard + rbCrossN**2 * b.rotateHard
        j = -(1 + e) * contactVel
        //console.log(j)
        //console.log(raCrossN**2)
        j /= ms
        j /= manifold.contactPoint.length
        jList.push(j)
        imp = p5.Vector.mult(manifold.norm, j)
        impulseList.push(imp)
    }
    for (let i = 0; i < impulseList.length; i++){
        a.vel.sub(p5.Vector.mult(impulseList[i], a.mass))
        b.vel.add(p5.Vector.mult(impulseList[i], b.mass))
        a.angularVelocity -= cross(raList[i], impulseList[i]) * a.rotateHard
        b.angularVelocity += cross(rbList[i], impulseList[i]) * b.rotateHard
    }
    impulseList = []
    raList = []
    rbList = []
    for (let i = 0; i < manifold.contactPoint.length; i++){
        ra = p5.Vector.sub(manifold.contactPoint[i], a.pos)
        rb = p5.Vector.sub(manifold.contactPoint[i], b.pos)
        raList.push(ra)
        rbList.push(rb)
        ra = s.createVector(-ra.y, ra.x)
        rb = s.createVector(-rb.y, rb.x)
        aLVelA = p5.Vector.mult(ra, a.angularVelocity).add(a.vel)
        aLVelB = p5.Vector.mult(rb, b.angularVelocity).add(b.vel)
        //rv = p5.Vector.sub(b.vel, a.vel)
        rv = p5.Vector.sub(aLVelB, aLVelA)
        tan = p5.Vector.sub(rv, p5.Vector.mult(manifold.norm, p5.Vector.dot(rv, manifold.norm)))
        if (tan.x * tan.x + tan.y * tan.y < 0.0001){
            continue;
        }
        tan.normalize()
        raCrossN = p5.Vector.dot(ra, tan)
        rbCrossN = p5.Vector.dot(rb, tan)
        ms = a.mass + b.mass + raCrossN**2 * a.rotateHard + rbCrossN**2 * b.rotateHard
        e = s.min(a.e, b.e)
        jt = -p5.Vector.dot(rv, tan)
        //console.log(j)
        //console.log(raCrossN**2)
        jt /= ms
        jt /= manifold.contactPoint.length
        if (s.abs(jt) <= jList[i] * 0.6){
            imp = p5.Vector.mult(tan, jt)
        }else{
            imp = p5.Vector.mult(tan, j).mult(-0.4)
        }
        impulseList.push(imp)
    }
    for (let i = 0; i < impulseList.length; i++){
        a.vel.sub(p5.Vector.mult(impulseList[i], a.mass))
        b.vel.add(p5.Vector.mult(impulseList[i], b.mass))
        a.angularVelocity -= cross(raList[i], impulseList[i]) * a.rotateHard
        b.angularVelocity += cross(rbList[i], impulseList[i]) * b.rotateHard
    }
}

sketches.push(new p5(function( s ) {
    var circles = []
    var fps = 180;
    var dt = 1 / fps;
    var acc = 0;
    var fs = new Date().getTime()
    var won = true;
    for (let i = 0; i < 2; i++){
        //var pos = s.createVector(400 + 1 * i,  700 - i * 500);
        var pos = s.createVector(400 + i* 100,  200 - 200*(i!=0) - 100 * i);
        var gravity = s.createVector(0, 9.8 *(i!=0));
        var collider = new Circle(s, s.createVector(0, 0), 1)
        color = [245, 190, 185]
        points = rotPoly(s, regPolygon(s, 50, 4+ 0 * (i <= 0)), s.PI/4 + s.PI/6 * i)
        points = scalePoly(points, 1 * (i != 0) + 3 * (i <= 0))
        b = new body(s, pos, [collider],0.,1/12 * (75 * 75 + 75 * 75  * (i!=0)) + 1/12 * (110 * 110 + 110 * 110  * (i==0)), 1 * (i != 0), gravity, 0.1, points, color, "ijdi")
        circles.push(b)
    }
    s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        s.frameRate(30)
        /*for (let i = 0; i < circles.length; i++){
            circles[i].update(dt);
        }
        s.fill(230, 240, 225);
        for (let i = 0; i < circles.length; i++){
            circles[i].draw();
        }
        if (SAT(s, circles[0].shapes[0], circles[1].shapes[0])){
            console.log("s")
        }*/
    }
    s.draw = function() {
        s.background(200, 220, 230);
        //console.log((new Date().getTime() - fs) / 1000)
        ct = new Date().getTime()
        acc += ct - fs
        fs = ct
        if (acc > 0.2){
            acc = 0.2
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
            if (manifolds.length > 0){
                for (let i = 0; i < manifolds.length; i++){
                    //PositionalCorrection(s, manifolds[i])
                }
                for (let c = 0; c < 8; c++){
                    for (let i = 0; i < manifolds.length; i++){
                        manImpulse(s, manifolds[i])
                    }
                }
            }
           
            for (let i = 0; i < manifolds.length; i++){
                if(manifolds[i].body.label == "break"){
                    manifolds[i].body.scale -= 1;
                } 
                if(manifolds[i].body2.label == "break"){
                    manifolds[i].body2.scale -= 1;
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
        //c1.update();
        s.fill(230, 240, 225);
        for (let i = 0; i < circles.length; i++){
            circles[i].draw();
        }
    }
}));


