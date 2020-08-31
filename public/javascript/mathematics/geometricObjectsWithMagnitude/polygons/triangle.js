/// should I make this a subclass of polygon?????
/// there isn't anything about these methods that make it inconsistent with the methods of polygon!!
// triangle can be a subclass of polygon, with verxtexA, vertexB, and vertexC => none of these variables are defined in the polygon method!
// and many of the methods are consistent
class Triangle extends Polygon {
    constructor(vertexA, vertexB, vertexC) {
        super([vertexA, vertexB, vertexC]);

        this.vertexA = vertexA;
        this.vertexB = vertexB;
        this.vertexC = vertexC;

        this.triangle = true;


        this.calculateTriangleParameters();

        this.recommendedFontSize = (this.sideLengthA.getFloat() + this.sideLengthB.getFloat() + this.sideLengthC.getFloat()) / 3 * .2;

        //this.area = this.calculateArea();
    }

    calculateTriangleParameters() {

        this.sideLengthA = this.vertexB.getDistanceToAnotherPoint(this.vertexC);
        this.sideLengthB = this.vertexA.getDistanceToAnotherPoint(this.vertexC);
        this.sideLengthC = this.vertexA.getDistanceToAnotherPoint(this.vertexB);

        this.angleA = getAngleFromLawOfCosines(this.sideLengthA, this.sideLengthB, this.sideLengthC);
        this.angleB = getAngleFromLawOfCosines(this.sideLengthB, this.sideLengthC, this.sideLengthA);
        this.angleC = getAngleFromLawOfCosines(this.sideLengthC, this.sideLengthA, this.sideLengthB); // could also divide by 180

        this.right = this.isRightTriangle();

        this.segmentA = new Segment(this.vertexB, this.vertexC);
        this.segmentB = new Segment(this.vertexC, this.vertexA);
        this.segmentC = new Segment(this.vertexA, this.vertexB);
    }


    isRightTriangle(numSigFigs) {
        return this.angleA.isRight(numSigFigs) || this.angleB.isRight(numSigFigs) || this.angleC.isRight(numSigFigs)
    }

    // 8-13-2020: giving answers slightly too high, a problem with 'get length?, or 'get altitude?'
    calculateArea() {
        let area;
        if (this.right) { // what if it is right, but a different function was used to get it and C is not the right angle
            if (this.angleC.isRight()) {
                return (this.sideLengthA.multiplyMag(this.sideLengthB)).multiplyMagExactConstant(0.5)
            } else if (this.angleB.isRight()) {
                return (this.sideLengthA.multiplyMag(this.sideLengthC)).multiplyMagExactConstant(0.5)
            } else if (this.angleA.isRight()) {
                return (this.sideLengthB.multiplyMag(this.sideLengthC)).multiplyMagExactConstant(0.5)
            }
        } else {
            console.log('WARNING: calculate triangle area function can give slightly incorrect answers');
            area = (this.sideLengthA.multiplyMag(this.getAltitude('A').getLength())).multiplyMagExactConstant(0.5);
        }
        return area
    }

    /// i took this out bc it did nothing but cause problems!
    /// if you use the specific right triangle generators, you get this convention
    /// otherwise, you don't!
    // if a triangle is a right triangle,
    /// rotates verticies so the hypotenuse is angle C
    // setRightTriangleConvention() {
    //     if (Math.abs(this.angleA - 90) < 1e-10) {
    //         this.rotateTriangleVertices();
    //         this.rotateTriangleVertices();
    //     } else if (Math.abs(this.angleB - 90) < 1e-10) {
    //         this.rotateTriangleVertices();
    //     }
    // }

    // this wasn't a very good idea
    // findAngleClosestTo90() {
    //     const ninetyMinusA = Math.abs(this.angleA - 90);
    //     const ninetyMinusB = Math.abs(this.angleB - 90);
    //     const ninetyMinusC = Math.abs(this.angleC - 90);
    //
    //     let result;
    //     if (ninetyMinusA <= ninetyMinusB && ninetyMinusA <= ninetyMinusC) {
    //         result = 'A';
    //     } else if (ninetyMinusB <= ninetyMinusA && ninetyMinusB <= ninetyMinusC) {
    //         result = 'B';
    //     } else if (ninetyMinusC <= ninetyMinusA && ninetyMinusC <= ninetyMinusB) {
    //         result = 'C';
    //     }
    //     return result
    // }

    // this wsan't a very good idea
    // whichever angle is closest to 90 degrees is set to 90 degrees and the triangle is reformed
    // forceRight() {
    //     const angleClosestTo90 = this.findAngleClosestTo90();
    //     if (angleClosestTo90 === 'A') {
    //         this.rotateTriangleVertices();
    //         this.rotateTriangleVertices();
    //     } else if (angleClosestTo90 === 'B') {
    //         this.rotateTriangleVertices();
    //     } else if (angleClosestTo90 === 'C') {
    //         // pass
    //     }
    //     const newVertexC = this.vertexC;
    //     const newVertexA = new Point(newVertexC.x, newVertexC.y + this.sideLengthA);
    //     const newVertexB = new Point(newVertexC.x - this.sideLengthB, newVertexC.y);
    //
    //     this.vertexA = newVertexA;
    //     this.vertexB = newVertexB;
    //     this.vertexC = newVertexC;
    //     this.calculateTriangleParameters();
    // }

    // altitude is a segment that begins at one vertex and makes a right angle with the opposite segment
    getAltitude(whichVertex) {
        if (whichVertex === 'A') {
            return new Segment(this.vertexA, this.segmentA.line.findIntersectionWithAnotherLine(this.segmentA.line.findPerpendicularLine(this.vertexA)));
        } else if (whichVertex === 'B') {
            return new Segment(this.vertexB, this.segmentB.line.findIntersectionWithAnotherLine(this.segmentB.line.findPerpendicularLine(this.vertexB)));
        } else if (whichVertex === 'C') {
            return new Segment(this.vertexC, this.segmentC.line.findIntersectionWithAnotherLine(this.segmentC.line.findPerpendicularLine(this.vertexC)));
        } else {
            return undefined
        }
    }

    // a median is a segment that begins at one vertex and ends at the midpoint of the opposite segment
    getMedian(whichVertex) {
        if (whichVertex === 'A') {
            return new Segment(this.vertexA, this.vertexB.interpolate(this.vertexC, new Magnitude(0.5, undefined, undefined, true)));
        } else if (whichVertex === 'B') {
            return new Segment(this.vertexB, this.vertexC.interpolate(this.vertexA, new Magnitude(0.5, undefined, undefined, true)));
        } else if (whichVertex === 'C') {
            return new Segment(this.vertexC, this.vertexA.interpolate(this.vertexB, new Magnitude(0.5, undefined, undefined, true)));
        } else {
            return undefined
        }
    }

    // the centroid is the point at which all medians intersect
    getCentroid() {
        let medianA = this.getMedian('A');
        let medianB = this.getMedian("B");
        return medianA.line.findIntersectionWithAnotherLine(medianB.line);
    }

    getSideLength(oppositeVertex) {
        if (oppositeVertex === 'A') {
            return this.sideLengthA
        } else if (oppositeVertex === 'B') {
            return this.sideLengthB
        } else if (oppositeVertex === 'C') {
            return this.sideLengthC
        }
    }

    translate(xTranslation, yTranslation) {
        // how will this affect altitudes and medians?....need to think about this.
    }

    /// check if i ever use this, I don't think i do, and i'm not sure I want this to be a part of this object!
    addToDiagramObject(DiagramObject) {
        DiagramObject.addExistingSegment(this.segmentA);
        DiagramObject.addExistingSegment(this.segmentB);
        DiagramObject.addExistingSegment(this.segmentC);
    }

    // definitely does not work!!!!
    /// FIX THIS! I need it to make my triangles face the correct way all the time!
    spin(angleObject) {
        const centroid = this.getCentroid();
        this.vertexA.rotate(angleObject, centroid);
        this.vertexB.rotate(angleObject, centroid);
        this.vertexC.rotate(angleObject, centroid);
    }
}

function constructEquilateralTriangle(sideLength, vertexA = makeOrigin()) { // clockwise orientation
    let vertexB = vertexA.translateAndReproduce(sideLength.multiplyMagExactConstant(0.5), sideLength.multiplyMagExactConstant(0.5 * Math.sqrt(3)));
    let vertexC = vertexA.translateAndReproduce(sideLength, constructZeroMagnitude(undefined, true));
    return new Triangle(vertexA, vertexB, vertexC);
}

function constructIsoscelesTriangle(width, height, vertexA = makeOrigin()) { // clockwise orientation, B is the top
    let vertexB = vertexA.translateAndReproduce(width.multiplyMagExactConstant(0.5), height);
    let vertexC = vertexA.translateAndReproduce(width, constructZeroMagnitude(undefined,true));
    return new Triangle(vertexA, vertexB, vertexC)
}

// this will be tougher
function constructRightTriangleHypotenuseAngle(hypotenuse, angleA, swapLegs, vertexA = makeOrigin()) { // clockwise orientation
    let x = (angleA.cosAngle()).multiplyMag(hypotenuse);
    let y = (angleA.sinAngle()).multiplyMag(hypotenuse);
    if (swapLegs) {
        const oldX = x;
        const oldY = y;
        x = oldY;
        y = oldX;
    }
    const vertexC = vertexA.translateAndReproduce(x,constructZeroMagnitude(undefined,true));
    const vertexB = vertexA.translateAndReproduce(x,y);
    return new Triangle(vertexA, vertexB, vertexC);
}

function constructRightTriangleTwoLegs(xLeg, yLeg, swapLegs, vertexA = makeOrigin()) { // clockwise orientation
    if (swapLegs) {
        const oldxLeg = xLeg;
        const oldyLeg = yLeg;
        xLeg = oldyLeg;
        yLeg = oldxLeg;
    }
    const vertexC = vertexA.translateAndReproduce(xLeg,0);
    const vertexB = vertexA.translateAndReproduce(xLeg,yLeg);
    return new Triangle(vertexA, vertexB, vertexC);
}

// add error message if hypotenuse is shorter than leg
function constructRightTriangleHypotenuseLeg(hypotenuse, xLeg, swapLegs, vertexA = makeOrigin()) { // clockwise orientation
    const yLeg = hypotenuse.pythagoreanSubtractMag(xLeg);
    return constructRightTriangleTwoLegs(xLeg, yLeg, swapLegs, vertexA)
}


function constructTriangleSAS(sideC, angleB, sideA, vertexA = makeOrigin()) { // counterlockwise orientation
    let vertexB = vertexA.translateAndReproduce(sideC, constructZeroMagnitude(undefined, true));
    const xTrans = (sideA.multiplyMag(angleB.cosAngle())).reverseSign();
    const yTrans = sideA.multiplyMag(angleB.sinAngle());
    let vertexC = vertexB.translateAndReproduce(xTrans, yTrans);
    let newTriangle = new Triangle(vertexA, vertexB, vertexC);
    newTriangle.setOrientationCounterClockwise();
    return newTriangle
}


//// this much more!!!!
// 8 -30-2020 exhausted from coding!

// its possible that the angles do not
function constructTriangleASA(angleAinDegrees, sideC, angleBinDegrees, vertexA = makeOrigin()) { // counterclockwise orientation
    const angleCinDegrees = 180 - angle1inDegrees - angle2inDegrees;
    if (angle3inDegrees <= 0) {
        console.log('cannot have a triangle with total angle greater than 180');
        return false
    }
    const angleAinRadians = convertDegreesToRadians(angleAinDegrees);
    const angleBinRadians = convertDegreesToRadians(angleBinDegrees);


    const lineB = new constructLineFromPointAndAngle(vertexA, angleAinRadians);
    const vertexB = vertexA.translateAndReproduce(sideC, 0);
    const lineA = new constructLineFromPointAndAngle(vertexB, Math.PI - angleBinRadians);
    const vertexC = lineA.findIntersectionWithAnotherLine(lineB);
    let newTriangle = new Triangle(vertexA, vertexB, vertexC);
    newTriangle.setOrientationCounterClockwise();
    return newTriangle
}

function constructTriangleSSS(sideC, sideB, sideA, vertexA) { // counterclockwise orientation
    let angleB = getAngleFromLawOfCosines(sideA, sideB, sideC); // in degrees
    return constructTriangleSAS(sideC, angleB, sideA, vertexA);
}


function constructTriangleAAS(angleCinDegrees, angleAinDegrees, sideC, vertexA) { // counterclockwiseOrientation orientation
    const angleBinDegrees = 180 - angleCinDegrees - angleAinDegrees;
    if (angleBinDegrees <= 0) {
        console.log('cannot have a triangle with total angle greater than 180');
        return false
    }
    return constructTriangleASA(angleAinDegrees, sideC, angleBinDegrees, vertexA);
}
