function polygon(s, points) {
s.beginShape();
for (let i = 0; i < points.length; i++) {
pointPos = points[i]
s.vertex(pointPos.x * s.height / 400, pointPos.y * s.height / 400);
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
        this.orgPoints = points
        for (let i = 0; i < this.shapes.length; i++){
                if(this.shapes[i].constructor.name == "Circle"){
                        if(this.shapes[i].orgPoints === undefined){
                                this.shapes[i].orgPoints = triangulate(points)
                        }
                }
        }
        this.points = points
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
        this.points = scalePoly(this.orgPoints, 1);
        this.points = rotPoly(this.s, this.orgPoints, this.orientation);
        for (let i = 0; i < this.points.length; i++) {
                this.points[i].add(this.pos)
        }
}
draw(){
        this.s.fill(this.color[0], this.color[1], this.color[2])
        this.s.stroke(0, 0, 0)
        polygon(this.s, this.points)
        for (let i = 0; i <  this.shapes.length; i++){
                this.shapes[i].draw();
        }
}
}
function getPoints(pointIndexes, points){
        let retPoints = []
        for (let i = 0; i < pointIndexes.length; i++){
                retPoints.push(points[pointIndexes[i]])
        }
        return retPoints;
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
constructor(s, offset, scale, points=undefined) {
        this.s = s;
        this.pos = this.s.createVector(0, 0);
        this.offset = offset;
        this.orgPoints = points;
        this.triangleIndex = triangulate(points)
        this.triangles;
        this.points;
        this.scale = scale;
        this.AABB;
}

update(pos, orientation){
        this.triangles = []
        this.pos = p5.Vector.add(pos, this.offset);
        this.points = scalePoly(this.orgPoints, 1);
        for (let i = 0; i < this.points.length; i++) {
                this.points[i].add(this.offset)
        }
        this.points = rotPoly(this.s, this.points, orientation);
        for (let i = 0; i < this.points.length; i++) {
                this.points[i].add(pos)
        }
        var newAABB = genAABB(this.s, this.points)
        this.AABB = new AABB(newAABB[0], newAABB[1]);
        for (let i = 0; i < this.triangleIndex.length; i++) {
                this.triangles.push(new Triangle(this.s, this.pos, getPoints(this.triangleIndex[i], this.points)))
        }
}

draw(){
        this.s.stroke(0, 0, 0)
        //this.s.noFill()
       // this.AABB.draw(this.s)
        
        //this.s.noFill()
        
        //this.s.fill(255)
        
        polygon(this.s, this.points)
        /*for (let i = 0; i < this.triangles.length; i++) {
                polygon(this.s, this.triangles[i].points)
        }*/
        this.s.fill(255, 0,0 )
        //this.s.circle(this.pos.x, this.pos.y, 5)
        
}
}
class Triangle{
        constructor(s, pos, points) {
                this.s = s;
                tot = s.createVector()
                for (let i = 0; i < points.length; i++) {
                        tot.add(points[i])
                }
                this.pos = tot.div(points.length);
                this.points = points
                let newAABB = genAABB(s, points)
                this.AABB = new AABB(newAABB[0], newAABB[1])
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
function farPointAlongNormalIndex(norm, points){
var farIndex;
let maxDist = -Infinity;

for (var i = 0; i < points.length; i++){
        let pointDist = norm.dot(points[i]);
        if (pointDist > maxDist){
        maxDist = pointDist;
        farIndex = i;
        }
        
}

return farIndex;
}
function loopIndex(array, index){
len = array.length
return ((index % len) + len) % len
}

function farPointsAlongNormalDist(norm, points){
        // Store min and max distances
        let minDist = Infinity;
        let maxDist = -Infinity;

        for (var i = 0; i < points.length; i++){
                // Get point dist along normal
                let pointDist = points[i].dot(norm);

                // Check pointDist with min and max dist
                if (pointDist < minDist){
                        minDist = pointDist;
                }
                if (pointDist > maxDist){
                        maxDist = pointDist;
                }
        }

        // Return distances
        return [minDist, maxDist];
}

function separatingAxisCheck(s, a, b, manifold) {
        let pointsA = a.points;
        let pointsB = b.points;
        side2 = 0
        for (let pointIndex = 0; pointIndex < pointsA.length; pointIndex++) {
                // Get next point and store side
                let nextPointIndex = loopIndex(pointsA, pointIndex + 1);
                let side = [pointsA[pointIndex], pointsA[nextPointIndex]];
                
                // Get normal of side
                let norm = getNorm(s, side).normalize();

                // Get pointsA min and max dist along normal
                let aMinMax = farPointsAlongNormalDist(norm, pointsA);
                let aMin = aMinMax[0];
                let aMax = aMinMax[1];

                // Get pointsB min and max dist along normal
                let bMinMax = farPointsAlongNormalDist(norm, pointsB);
                let bMin = bMinMax[0];
                let bMax = bMinMax[1];
                
                // Check if it is a separating axis
                if (aMax < bMin || bMax < aMin) {
                        return true;
                }
                axisDepth = s.min(aMax - bMin, bMax - aMin);
                
                if (axisDepth < manifold.pen){
                        manifold.pen = axisDepth
                        manifold.norm = norm
                }
        }
}

function SAT(s, pointsA, pointsB, manifold){
        manifold.pen = Infinity;

        // Check if there is a separating axis
        if (separatingAxisCheck(s, pointsB, pointsA, manifold)){
                return true;
        }
        if (separatingAxisCheck(s, pointsA, pointsB, manifold)){
                return true;
        }

        dir = p5.Vector.sub(pointsB.pos, pointsA.pos)
        if (dir.dot(manifold.norm) < 0){
                manifold.norm.mult(-1)
        }
        return false;
        
}

function makeSideClockwise(pos, side){
        a = side[0]
        b = side[1]
        aT = p5.Vector.sub(a, pos)
        bT = p5.Vector.sub(b, pos)
        if ((aT.x * bT.y) - (aT.y * bT.x) < 0){
                return [b, a]
        }
        return [a, b]
}


function genManifoldSides(s, norm, points) {
        let farPointIndex = farPointAlongNormalIndex(norm, points);

        let nextPointIndex = loopIndex(points, farPointIndex + 1);
        let backPointIndex = loopIndex(points, farPointIndex - 1);

        let side = [points[farPointIndex], points[nextPointIndex]];
        let side2 = [points[backPointIndex], points[farPointIndex]];

        let sideNorm = getNorm(s, side).normalize();
        let sideNorm2 = getNorm(s, side2).normalize();

        let normAxisDif = s.abs(cross(sideNorm, norm));
        let normAxisDif2 = s.abs(cross(sideNorm2, norm));

        var shapeInfo;
        var sideInfo;

        if (normAxisDif < normAxisDif2) {
                shapeInfo = [normAxisDif, points[farPointIndex], sideNorm];
                
                let clipSide = [points[backPointIndex], points[farPointIndex]];

                let selectPointNextPointIndex = loopIndex(points, nextPointIndex + 1);
                let clipSide2 = [points[nextPointIndex], points[selectPointNextPointIndex]];

                sideInfo = [side, clipSide, clipSide2];
        } else {
                shapeInfo = [normAxisDif2, points[farPointIndex], sideNorm2];
                
                let clipSide = [points[farPointIndex], points[nextPointIndex]];

                let selectPointNextPointIndex = loopIndex(points, backPointIndex - 1);
                let clipSide2 = [points[selectPointNextPointIndex], points[backPointIndex]];
                
                sideInfo = [side2, clipSide, clipSide2];
        }
        return [shapeInfo, sideInfo];
}


function insideLine(side, p){
        return (side[1].x - side[0].x) * (p.y - side[0].y) > (side[1].y - side[0].y) * (p.x - side[0].x);
}

function lineIntersection(s, sideA, sideB) {
        let lineA = p5.Vector.sub(sideA[0], sideA[1]);
        let yInterceptA = cross(sideA[0], sideA[1]);

        let lineB = p5.Vector.sub(sideB[0], sideB[1]);
        let yInterceptB = cross(sideB[0], sideB[1]);

        let xRates = s.createVector(lineA.x, lineB.x);
        let yRates = s.createVector(lineA.y, lineB.y);
        let yIntercepts = s.createVector(yInterceptA, yInterceptB);

        let lineCross = cross(lineA, lineB);
        if (lineCross != 0){
                let xCoord = cross(yIntercepts, xRates) / lineCross;
                let yCoord = cross(yIntercepts, yRates) / lineCross;
                return s.createVector(xCoord, yCoord);
        }

        return s.createVector(0, 0);
}


function clipSides(s, aInfo, bInfo, manifold){
        let info = aInfo[0];
        let aSides = aInfo[1];
        let bSides = bInfo[1];
        for (let i = 1; i < 3; i++){
                for (let j = 0; j < 2; j++){
                        if(insideLine(aSides[i], bSides[0][j])){
                                continue;
                        }

                        bSides[0][j] = lineIntersection(s, aSides[i], bSides[0]);
                }
        }
        let circles = [];
        for (let j = 0; j < 2; j++){
                if(insideLine(aSides[i], bSides[0][j])){
                        circles.push(bSides[0][j]);
                }
        }
        manifold.contactPoint = circles;
        

        
        
        /*min = Infinity
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
        s.stroke(255, 0, 0)
        s.circle(aInfo[1][0].x, aInfo[1][0].y, 5)
        s.stroke(255, 255, 255)
        s.circle(aInfo[1][1].x, aInfo[1][1].y, 5)
        s.fill(0)*/

}

function circleManifold(s, manifold){
        let a = manifold.A;
        let b = manifold.B;
        if(SAT(s, a, b, manifold)){
                return false;
        }
        let norm = manifold.norm.copy();
        let aInfo = genManifoldSides(s, norm, a.points);
        
        norm.mult(-1);
        let bInfo = genManifoldSides(s, norm, b.points);

        if(aInfo[0][0] < bInfo[0][0]){
                clipSides(s, aInfo, bInfo, manifold);
        }else{
                clipSides(s, bInfo, aInfo, manifold);
        }

        return true;
}

function PositionalCorrection(s, manifold, num){
        pen = manifold.pen
        n = manifold.norm
        b = manifold.body
        b2 = manifold.body2
        percent = 0.2
        slop = 0.05
        correction = p5.Vector.mult(n, s.max(pen - slop, 0.0) / (b.mass + b2.mass) * percent).div(num)
        b.pos.sub(p5.Vector.mult(correction, b.mass))
        b2.pos.add(p5.Vector.mult(correction, b2.mass))
}

function cross(a, b){
        return a.x * b.y - a.y * b.x
}

function addImpulse(manifold, impulseList, radiusListA, radiusListB){
        let a = manifold.body
        let b = manifold.body2
        for (let i = 0; i < impulseList.length; i++){
                a.vel.sub(p5.Vector.mult(impulseList[i], a.mass))
                b.vel.add(p5.Vector.mult(impulseList[i], b.mass))
                a.angularVelocity -= cross(radiusListA[i], impulseList[i]) * a.rotateHard
                b.angularVelocity += cross(radiusListB[i], impulseList[i]) * b.rotateHard
        }
}
function manImpulse(s, manifold){
        let a = manifold.body;
        let b = manifold.body2;
        let contactNum = manifold.contactPoint.length;

        let impulseList = [];
        let radiusListA = [];
        let radiusListB = [];
        let jList = [];

        for (let i = 0; i < contactNum; i++){
                let radiusA = p5.Vector.sub(manifold.contactPoint[i], a.pos);
                let radiusB = p5.Vector.sub(manifold.contactPoint[i], b.pos);
                
                radiusListA.push(radiusA);
                radiusListB.push(radiusB);

                let radiusPerpA = s.createVector(-radiusA.y, radiusA.x);
                let radiusPerpB = s.createVector(-radiusB.y, radiusB.x);

                if (a.mass + b.mass == 0){ 
                        return;
                }
                
                let velA = p5.Vector.mult(radiusPerpA, a.angularVelocity).add(a.vel);
                let velB = p5.Vector.mult(radiusPerpB, b.angularVelocity).add(b.vel);

                let relVel = p5.Vector.sub(velB, velA);
                let contactVel = p5.Vector.dot(relVel, manifold.norm);

                if (contactVel > 0){ 
                        return;
                }

                let e = s.min(a.e, b.e);
                
                let raCrossN = p5.Vector.dot(radiusPerpA, manifold.norm);
                let rbCrossN = p5.Vector.dot(radiusPerpB, manifold.norm);

                let ms = a.mass + b.mass + raCrossN**2 * a.rotateHard + rbCrossN**2 * b.rotateHard;

                let j = -(1 + e) * contactVel;
                j /= ms;
                j /= contactNum;
                jList.push(j);
                imp = p5.Vector.mult(manifold.norm, j);
                impulseList.push(imp);
        }

        addImpulse(manifold, impulseList, radiusListA, radiusListB);

        impulseList = [];
        for (let i = 0; i < contactNum; i++){
                let radiusA = radiusListA[i];
                let radiusB = radiusListB[i];

                let radiusPerpA = s.createVector(-radiusA.y, radiusA.x);
                let radiusPerpB = s.createVector(-radiusB.y, radiusB.x);
                
                let velA = p5.Vector.mult(radiusPerpA, a.angularVelocity).add(a.vel);
                let velB = p5.Vector.mult(radiusPerpB, b.angularVelocity).add(b.vel);

                let relVel = p5.Vector.sub(velB, velA);

                let relCrossN = p5.Vector.dot(relVel, manifold.norm);
                let tan = p5.Vector.sub(relVel, p5.Vector.mult(manifold.norm, relCrossN));

                if (tan.x * tan.x + tan.y * tan.y < 0.0001){
                        continue;
                }
                tan.normalize();

                let raCrossN = p5.Vector.dot(radiusPerpA, tan);
                let rbCrossN = p5.Vector.dot(radiusPerpB, tan);

                let ms = a.mass + b.mass + raCrossN**2 * a.rotateHard + rbCrossN**2 * b.rotateHard;

                let jt = -p5.Vector.dot(relVel, tan);
                jt /= ms;
                jt /= contactNum;

                if (s.abs(jt) <= jList[i] * 0.6){
                        imp = p5.Vector.mult(tan, jt);
                }else{
                        imp = p5.Vector.mult(tan, jList[i]).mult(-0.4);
                }
                impulseList.push(imp);
        }
        addImpulse(manifold, impulseList, radiusListA, radiusListB);
}

function changePenAlongNorm(s, norm, manifold){
        let pointsA = manifold.A.points;
        let pointsB = manifold.B.points;

        // Get pointsA min and max dist along normal
        let aMinMax = farPointsAlongNormalDist(norm, pointsA);
        let aMin = aMinMax[0];
        let aMax = aMinMax[1];

        // Get pointsB min and max dist along normal
        let bMinMax = farPointsAlongNormalDist(norm, pointsB);
        let bMin = bMinMax[0];
        let bMax = bMinMax[1];

        axisDepth = s.min(aMax - bMin, bMax - aMin);
        if (axisDepth < manifold.pen){
                manifold.pen = axisDepth
        }
        manifold.norm = norm
}

function simplifyTriangles(points, triangles){
        allMergeTriangles = []
        found = true
        while(found){
        found = false
        allMergeTriangles = []
        for (let i = 0; i < triangles.length; i++){
                for (let j = i + 1; j < triangles.length; j++){
                        mergeTriangles = []
                        for (let k = 0; k < triangles[i].length; k++){
                                for (let l = 0; l < triangles[j].length; l++){
                                        if(triangles[i][k] == triangles[j][l]){
                                                mergeTriangles.push([k, l])
                                        }
                                }
                        }
                        if (mergeTriangles.length == 2){
                                indexChecking = 0
                                
                                z = 0
                                z2 = 0
                                checkIndex = loopIndex(triangles[i], mergeTriangles[0][0] + 1)
                                if(triangles[i][mergeTriangles[1][0]] == triangles[i][checkIndex]){
                                        checkIndex = loopIndex(triangles[i], mergeTriangles[1][0] + 1)
                                        z = 1
                                }
                                checkIndex2 = loopIndex(triangles[j], mergeTriangles[0][1] - 1)
                                if(triangles[i][mergeTriangles[1][0]] == triangles[j][checkIndex2]){
                                        checkIndex2 = loopIndex(triangles[j], mergeTriangles[1][1] - 1)
                                        z = 1
                                }
                                if(z ==0){
                                        z2 = 1
                                }
                                checkIndex3 = loopIndex(triangles[i], mergeTriangles[z][0] + 1)
                                if(triangles[i][mergeTriangles[z2][0]] == triangles[i][checkIndex3]){
                                        checkIndex3 = loopIndex(triangles[i], mergeTriangles[z2][0] + 1)
                                }
                                checkIndex4 = loopIndex(triangles[j], mergeTriangles[z2][1] + 1)
                                if(triangles[i][mergeTriangles[z2][0]] == triangles[j][checkIndex4]){
                                        checkIndex4 = loopIndex(triangles[j], mergeTriangles[z][1] + 1)
                                }
                                
                                sides = [[triangles[i][mergeTriangles[z][0]], triangles[i][checkIndex]], [triangles[i][mergeTriangles[z][0]], triangles[j][checkIndex2]],
                                [triangles[i][mergeTriangles[z2][0]], triangles[i][checkIndex3]], [triangles[i][mergeTriangles[z2][0]], triangles[j][checkIndex4]]]
                                allMergeTriangles.push([triangles[i], triangles[j], sides])
                        }
                }
        }
        
        for (let i = 0; i < allMergeTriangles.length; i++){
                side1 = allMergeTriangles[i][2][0]
                side2 = allMergeTriangles[i][2][1]
                side3 = allMergeTriangles[i][2][2]
                side4 = allMergeTriangles[i][2][3]
                side1 = p5.Vector.sub(points[side1[1]], points[side1[0]])
                side2 = p5.Vector.sub(points[side2[1]], points[side2[0]])
                side3 = p5.Vector.sub(points[side3[1]], points[side3[0]])
                side4 = p5.Vector.sub(points[side4[1]], points[side4[0]])
                if (cross(side2, side1) <= 0 && cross(side4, side3) >= 0){
                        found = true
                        triangles.splice(triangles.indexOf(allMergeTriangles[i][0]), 1)
                        triangles.splice(triangles.indexOf(allMergeTriangles[i][1]), 1)
                        triangles.push([...new Set(allMergeTriangles[i][0].concat(allMergeTriangles[i][1]).sort(function(a, b) {
                                return a - b;
                            }))])
                        break;
                }
        }
        
        
}
}

function triangulate(points){
        index = []
        for (let i = 0; i < points.length; i++){
                index.push(i)
        }
        triangles = []
        while (index.length > 3){
                for (let i = 0; i < index.length; i++){
                        b = index[loopIndex(index, i - 1)]
                        a = index[i]
                        c = index[loopIndex(index, i + 1)]

                        vb = points[b]
                        va = points[a]
                        vc = points[c]
                        ba = p5.Vector.sub(vb, va)
                        ca = p5.Vector.sub(vc, va)
                        
                        if (cross(ba, ca) > 0){
                                continue
                        }
                        isEar = true;
                        for (let j = 0; j < index.length; j++){
                                if (index[j] == a || index[j] == b || index[j] == c){
                                        continue
                                }
                                p = points[index[j]]
                                if (pointInTriangle(p, points[b], points[a], points[c])){
                                        isEar = false
                                        break;
                                }
                        }
                        if (isEar){
                                triangles.push([b, a, c])
                                index.splice(i, 1)
                                break;
                        }
                }
                
        }
        triangles.push([index[0], index[1], index[2]])
        simplifyTriangles(points, triangles)
        return triangles
}

function pointInTriangle(p, a, b, c){
        ab = p5.Vector.sub(b, a)
        bc = p5.Vector.sub(c, b)
        ca = p5.Vector.sub(a, c)

        ap = p5.Vector.sub(p, a)
        bp = p5.Vector.sub(p, b)
        cp = p5.Vector.sub(p, c)

        cross1 = cross(ab, ap)
        cross2 = cross(bc, bp)
        cross3 = cross(ca, cp)

        if (cross1 < 0 || cross2 < 0 || cross3 < 0){
                return false;
        }
        return true
}

function centerPoly(s, poly){
        tot = s.createVector()
        for (let i = 0; i < poly.length; i++){
                tot.add(poly[i]) 
        }
        tot.div(poly.length)
        for (let l = 0; l < poly.length; l++){
                poly[l].sub(tot)
        }
}
function offsetPoly(s, poly, x, y){
        for (let i = 0; i < poly.length; i++){
                poly[i].add(s.createVector(x, y)) 
        }
}

sketches.push(new p5(function( s ) {
var circles = []
var fps = 180;
var dt = 1 / fps;
var acc = 0;
var fs = new Date().getTime()
var won = true;

s.keyPressed = function() {
        if (s.keyCode === s.UP_ARROW) {
                circles[1].vel.set(0, -5);
        } else if (s.keyCode === s.DOWN_ARROW) {
                circles[1].vel.set(0, 5);
        }
        if (s.keyCode === s.LEFT_ARROW) {
                circles[1].vel.set(-5, 0);
        } else if (s.keyCode === s.RIGHT_ARROW) {
                circles[1].vel.set(5, 0);
        }
}
s.setup = function() {
        var canvas = s.createCanvas(s.select('#sketch0').width, s.select('#sketch0').height);
        canvas.parent('sketch0');
        s.pixelDensity(s.displayDensity());
        s.noLoop();
        s.frameRate(60)
        alphabet = []
        poly = [s.createVector(-250, -450), s.createVector(-150, -450), s.createVector(0, -150), 
                s.createVector(150, -450), 
                s.createVector(250, -450), s.createVector(250, 0), s.createVector(150, 0), s.createVector(150, -200),
                s.createVector(50, 0), s.createVector(-50, 0), s.createVector(-150, -200), s.createVector(-150, 0),
                s.createVector(-250, 0)]
        poly=scalePoly(poly, 0.1)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (30**2 + 40**2)])
        poly = [s.createVector(-250, 50), s.createVector(-250, -450), s.createVector(0, -450), 
                s.createVector(0, -350), 
                s.createVector(-150, -350), s.createVector(-150, -250), s.createVector(-50, -250), s.createVector(-50, -150),
                s.createVector(-150, -150), s.createVector(-150, -50), s.createVector(0, -50), s.createVector(0, 50)]
        poly=scalePoly(poly, 0.1)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (25**2 + 45**2)])
        poly = [s.createVector(-250, 0), s.createVector(-250, -400), s.createVector(0, -400), 
                s.createVector(0, -200), 
                s.createVector(-100, -200), s.createVector(0, 0), s.createVector(-100, 0), s.createVector(-150, -100),
                s.createVector(-150, 0)]
        poly=scalePoly(poly, 0.12)
        centerPoly(s, poly)
        offsetPoly(s, poly, 0, 10)
        alphabet.push([poly, 1/12 * (20**2 + 50**2)])
        poly = [s.createVector(-300, -350), s.createVector(-200, -350), s.createVector(-150, -250), 
                s.createVector(-100, -350), s.createVector(0, -350), s.createVector(-100, -150), s.createVector(-100, 0), s.createVector(-200, 0), s.createVector(-200, -150)]
        poly=scalePoly(poly, 0.13)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (10**2 + 40**2)])
        poly = [s.createVector(0, 0), s.createVector(-300, 0), s.createVector(-300, -350), 
                s.createVector(0, -350), s.createVector(0, -250), s.createVector(-200, -250), s.createVector(-200, -100), s.createVector(0, -100)]
        poly=scalePoly(poly, 0.12)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (30 ** 2 + 30**2)])
        poly = [s.createVector(-200, 0), s.createVector(-300, 0), s.createVector(-300, -400), 
                s.createVector(-200, -400), s.createVector(-200, -250), s.createVector(-100, -250), s.createVector(-100, -400), s.createVector(0, -400), s.createVector(0, 0), s.createVector(-100, 0), s.createVector(-100, -150), s.createVector(-200, -150)]
        poly=scalePoly(poly, 0.115)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (40 ** 2 + 50**2)])
        poly = [s.createVector(-100, 0), s.createVector(-100, -400), s.createVector(0, -400), 
                s.createVector(0, 0)]
        poly=scalePoly(poly, 0.12)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (10 ** 2 + 30**2)])
        poly = [s.createVector(-250, -100), s.createVector(-250, -400), s.createVector(0, -400), s.createVector(0, -300), s.createVector(-150, -300), s.createVector(-150, -200), s.createVector(0, -200), s.createVector(0, 100), s.createVector(-250, 100), s.createVector(-250, 0), s.createVector(-100, 0), s.createVector(-100, -100)]
        poly=scalePoly(poly, 0.1)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (10 ** 2 + 30**2)])
        poly = [s.createVector(-300, -400), s.createVector(0, -400), s.createVector(0, -300), s.createVector(-100, -300), s.createVector(-100, 0), s.createVector(-200, 0), s.createVector(-200, -300), s.createVector(-300, -300)]
        poly=scalePoly(poly, 0.11)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (10 ** 2 + 30**2)])
        poly = [s.createVector(-300, 0), s.createVector(-300, -500), s.createVector(0, -500), s.createVector(0, 0), s.createVector(-100, 0), s.createVector(-100, -200), s.createVector(-200, -200), s.createVector(-200, 0)]
        poly=scalePoly(poly, 0.09)
        centerPoly(s, poly)
        alphabet.push([poly, 1/12 * (10 ** 2 + 30**2)])
        for (let i = 0; i < 14; i++){
                //var pos = s.createVector(400 + 1 * i,  700 - i * 500);
                var pos = s.createVector(400,  0 + i * -100);
                var gravity = s.createVector(0, 9.8);
                
                points = regPolygon(s, 1, 4)
                points2 = [s.createVector(-2, -1.5), s.createVector(-1, -1.5), s.createVector(0, 0), s.createVector(0, 2), s.createVector(-2, 2)]
                tot = s.createVector()
                points = scalePoly(points, 10)
                points = rotPoly(s, regPolygon(s, 10, 4), s.PI/4)
                points2 = scalePoly(points2, 10)
                
                tot = s.createVector()
                poly=scalePoly(poly, 0.1)
                if(i%3==0){
                        color = [187, 37, 40]
                }else if(i%3==1){
                        color = [20, 107, 58]
                }else{
                        color = [255, 255, 255]
                }
                q = i
                if (i == 14){
                        q = 7
                }else if (i == 13){
                        q = 7
                }else if (i == 11){
                        q = 0
                }else if(i > 11){
                        q = i - 3
                }else if (i == 7){
                        q = 2
                }else if(i > 7){
                        q = i - 2
                }else if (i == 3){
                        q = 2
                }else if(i > 3){
                        q = i - 1
                }
                for (let i = 0; i < poly.length; i++){
                        tot.add(poly[i]) 
                }
                tot.div(poly.length)
                for (let l = 0; l < poly.length; l++){
                        poly[l].sub(tot)
                }
                var collider = new Circle(s, s.createVector(0, 0), 1, alphabet[q][0])
                var collider2 = new Circle(s, s.createVector(-0, 0), 1, points)
                var collider3 = new Circle(s, s.createVector(-0, 0), 1, points)
                var collider4 = new Circle(s, s.createVector(-0, 0), 1, points)
                points = rotPoly(s, regPolygon(s, 10, 4), s.PI/4)
                

                b = new body(s, pos, [collider],0.0,alphabet[q][1], 1, gravity, 0.2, [], color, "ijdi")
                circles.push(b)
        }
        var pos = s.createVector(400,  200);
        points = [s.createVector(1, -1.5), s.createVector(2, -1.5), s.createVector(2, 2), s.createVector(0, 2), s.createVector(0, 0)]
        points2 = [s.createVector(-2, -1.5), s.createVector(-1, -1.5), s.createVector(0, 0), s.createVector(0, 2), s.createVector(-2, 2)]
        points = scalePoly(points, 100)
        points2 = scalePoly(points2, 100)
        
        poly = [s.createVector(-450, -400), s.createVector(-350, 0), s.createVector(-50, 0), 
                s.createVector(50, -400), 
                s.createVector(100, -300), s.createVector(0, 100), s.createVector(-400, 100), s.createVector(-500, -300)]
        tot = s.createVector()
        poly=scalePoly(poly, 0.5)
        for (let i = 0; i < poly.length; i++){
                tot.add(poly[i]) 
        }
        tot.div(poly.length)
        poly2 = triangulate(poly)
        for (let l = 0; l < poly.length; l++){
                tot.add(poly[l])
        }
        tot.div(poly.length)
        for (let l = 0; l < poly.length; l++){
                poly[l].sub(tot)
        }
        collider = new Circle(s, s.createVector(0, 0), 1, poly)
        collider2 = new Circle(s, s.createVector(-100, 0), 1, points2)
        //console.log(collider.orgPoints)
        b = new body(s, pos, [collider],0.0, 1/12 * 0 * (110 * 110 + 110 * 110), 0, s.createVector(0, 0), 1, [], color, "ijdi")
        //console.log(b.shapes[0].orgPoints)
        circles.push(b)
        temp = circles[0]
        circles[0] = circles[1]
        circles[1] = temp
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
        s.strokeWeight(s.height/200);
        
        for (let i = 0; i < poly2.length; i++){
                //polygon(s, getPoints(poly2[i], poly))
        }
                //c1.update();
        for (let i = 0; i < circles.length; i++){
                for (let j = i + 1; j < circles.length; j++){
                for (let k = 0; k < circles[i].shapes.length; k++){
                        tempMan = []
                        for (let l = 0; l < circles[j].shapes.length; l++){
                                if(AABBvsAABB(circles[i].shapes[k].AABB, 
                                        circles[j].shapes[l].AABB) &&
                                        circles[i].mass + circles[j].mass > 0){
                                for (let z = 0; z < circles[i].shapes[k].triangles.length; z++){
                                        for (let c = 0; c < circles[j].shapes[l].triangles.length; c++){
                                                if(AABBvsAABB(circles[i].shapes[k].triangles[z].AABB, 
                                                circles[j].shapes[l].triangles[c].AABB)){
                                                        manifold = new Manifold(circles[i].shapes[k].triangles[z],
                                                        circles[j].shapes[l].triangles[c], circles[i], circles[j])
                                                        if (circleManifold(s, manifold)){
                                                                tempMan.push(manifold)
                                                        }
                                                 }
                                        }
                                }
                        }
                        if (tempMan.length > 0){
                                manifolds.push(tempMan)
                        }
                }
                }
        }
        }
        if (manifolds.length > 0){
                for (let c = 0; c < 16; c++){
                        for (let i = 0; i < manifolds.length; i++){
                                for (let j = 0; j < manifolds[i].length; j++){
                                        manImpulse(s, manifolds[i][j])
                                }
                        }
                }
                for (let i = 0; i < manifolds.length; i++){
                        for (let j = 0; j < manifolds[i].length; j++){
                                PositionalCorrection(s, manifolds[i][j], manifolds[i].length)      
                        }
                }
        }
        
        /*for (let i = 0; i < manifolds.length; i++){
                if(manifolds[i].body.label == "break"){
                manifolds[i].body.scale -= 1;
                } 
                if(manifolds[i].body2.label == "break"){
                manifolds[i].body2.scale -= 1;
                }
        }*/
        acc -= dt
        }
        /*for (let i = 0; i < circles.length; i++){
        if (circles[i].label == "break2"){
                if(circles[i].pos.y > 410 || circles[i].pos.x > 810 || circles[i].pos.x < -10 || circles[i].r <= 2){
                circles[i].pos = s.createVector(s.random(0, 800), -s.random(0, 100));
                circles[i].vel.set(s.random(-50, 50), s.random(-50, 50));
                circles[i].r = 7
                }
        }else if (circles[i].r <= 2 && circles[i].label == "break"){
                circles.splice(i, 1)
        }
        }*/
        s.strokeWeight(s.height/200);
        
        for (let i = 0; i < poly2.length; i++){
                //polygon(s, getPoints(poly2[i], poly))
        }
                //c1.update();
        //s.fill(230, 240, 225);
        for (let i = 0; i < circles.length; i++){
        circles[i].draw();
        }
       //console.log(triangulate(regPolygon(s,10,4)))
 /*      points = [s.createVector(-250, -450), s.createVector(-150, -450), s.createVector(0, -150), 
        s.createVector(150, -450), 
        s.createVector(250, -450), s.createVector(250, 0), s.createVector(150, 0), s.createVector(150, -200),
        s.createVector(50, 0), s.createVector(-50, 0), s.createVector(-150, -200), s.createVector(-150, 0),
        s.createVector(-250, 0)]
       //points = [s.createVector(-35, -55), s.createVector(-25, -45), s.createVector(-10, -55), 
        //s.createVector(-25, -35)]
        //points=regPolygon(s, 10, 10)
        points = scalePoly(points,0.2)
       triangles = triangulate(points)
       for (let i = 0; i < points.length; i++){
        points[i].add(s.createVector(100, 100))
       }
       console.log(points)
       simplifyTriangles(s, points, triangles)
       for (let i = 0; i < triangles.length; i++){
        polygon(s, getPoints(triangles[i], points))
}
for (let i = 0; i < points.length; i++){
        s.fill(i * 255 / (points.length - 1))
        s.circle(points[i].x, points[i].y, 10)
}
        wfww*/
}
}));


