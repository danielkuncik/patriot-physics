
// for making shapes etc.
class GeometryPad extends Diagram {
    constructor() {
        super();
        this.triangles = [];
        this.orientation = 'clockwise';
        this.fontSize = 0;
    }

    makeOrientationCounterClockwise() {
      this.orientation = 'counterclockwise';
    }
    makeOrientationClockwise() {
      this.orientation = 'clockwise';
    }

    calculateFontSize() {
        let numerator = 0, denominator = 0;
        this.triangles.forEach((triangle) => {
            numerator += triangle.recommendedFontSize;
            denominator += 1;
        });
        return this.setFontSize(numerator / denominator);
    }
    setFontSize(newFontSize) {
        this.fontSize = newFontSize;
        return newFontSize
    }

    addTriangleSAS(side1, angleInDegrees, side2, forceRight, vertexA) {
      if (vertexA === undefined) {
        vertexA = makeOrigin();
      }
        let newTriangle = constructTriangleSAS(side1, angleInDegrees, side2, forceRight, vertexA);
        this.triangles.push(newTriangle);
        this.addExistingTriangleObject(newTriangle);
        return newTriangle
    }

    addTriangleSSS(side1, side2, side3, forceRight, vertexA) {
      if (vertexA === undefined) {
        vertexA = makeOrigin();
      }
      let newTriangle = constructTriangleSSS(side1, side2, side3, forceRight, vertexA);
      this.triangles.push(newTriangle);
      this.addExistingTriangleObject(newTriangle);
      return newTriangle
    }

    labelSide(oppositeVertex, label, triangleObject) {
        if (this.fontSize === 0) { /// may create issues !!!
            this.calculateFontSize();
        }
      if (triangleObject === undefined) {
        triangleObject = this.triangles[0];
      }
      let end1, end2, value;
      if (oppositeVertex === 'A') {
        end1 = triangleObject.vertexB;
        end2 = triangleObject.vertexC;
        value = roundValue(triangleObject.sideLengthA,2);
      } else if (oppositeVertex === 'B') {
        end1 = triangleObject.vertexC;
        end2 = triangleObject.vertexA;
        value = roundValue(triangleObject.sideLengthB,2);
      } else if (oppositeVertex === 'C') {
        end1 = triangleObject.vertexA;
        end2 = triangleObject.vertexB;
        value = roundValue(triangleObject.sideLengthC,2);
      }
      if (label === undefined) {
          label = String(value);
      }
      const textLocation = getOptimalLocationOfText(end1, end2, this.orientation); // clockwise orientiation default
      if (textLocation === 'above' || textLocation === 'left') {
        this.labelLineAbove(end1, end2, label, this.fontSize / 2 , this.fontSize);
      } else if (textLocation === 'below' || textLocation === 'right') {
        this.labelLineBelow(end1, end2, label, this.fontSize / 2, this.fontSize);
      }
      // label line outside function
    }

    labelAngle(vertex, label, degreeSymbol, fontProportion, triangleObject) {
      if (triangleObject === undefined) {
        triangleObject = this.triangles[0];
      }
      if (label === undefined) {
        if (vertex === 'A') {
          label = String(roundValue(triangleObject.angleA,2)); /// FIX ROUNDING!!!!!
        } else if (vertex === 'B') {
          label = String(roundValue(triangleObject.angleB,2));
        } else if (vertex === 'C') {
          label = String(roundValue(triangleObject.angleC,2));
        }
        if (degreeSymbol === undefined) { // add degree symbol if label is default
          degreeSymbol = true;
        }
      }

      let outsidePoint1, vertexPoint, outsidePoint2;
      if (vertex === 'A') {
        outsidePoint1 = triangleObject.vertexC;
        vertexPoint = triangleObject.vertexA;
        outsidePoint2 = triangleObject.vertexB;
      } else if (vertex === 'B') {
        outsidePoint1 = triangleObject.vertexA;
        vertexPoint = triangleObject.vertexB;
        outsidePoint2 = triangleObject.vertexC;
      } else if (vertex === 'C') {
        outsidePoint1 = triangleObject.vertexB;
        vertexPoint = triangleObject.vertexC;
        outsidePoint2 = triangleObject.vertexA;
      }
      //     labelAngle(label, outsidePointA, vertex, outsidePointB, interiorOrExterior, textOnAorB, addDegreeLabel, radiusProportion, fontProportion) {
        // creates a problem if one of the points is the origin
      super.labelAngle(label, outsidePoint1, vertexPoint, outsidePoint2, 'interior', undefined, degreeSymbol, undefined, fontProportion);
    }

    labelAngleTheta(vertex, triangleObject) {
      this.labelAngle(vertex,'θ',false, triangleObject);
    }
    labelAnglePhi(vertex, triangleObject) {
      this.labelAngle(vertex,'φ',false, triangleObject);
    }

    addExistingTriangleObject(triangleObject) {
        this.addExistingSegment(triangleObject.segmentA);
        this.addExistingSegment(triangleObject.segmentB);
        this.addExistingSegment(triangleObject.segmentC);
    }

    addRightAngleMarker(squareLength,triangle) {
        if (this.fontSize === 0) { /// may create issues !!!
            this.calculateFontSize();
        }
        if (triangle === undefined) {
            triangle = this.triangles[0];
        }
        if (squareLength === undefined) {
          squareLength = this.fontSize;
        }
        if (Math.abs(triangle.angleA - 90) < 1e-10) {
            super.squareAngle(triangle.vertexC, triangle.vertexA, triangle.vertexB, squareLength);
        } else if (Math.abs(triangle.angleB - 90) < 1e-10) {
            super.squareAngle(triangle.vertexA, triangle.vertexB, triangle.vertexC, squareLength);
        } else if (Math.abs(triangle.angleC - 90) < 1e-10) {
            super.squareAngle(triangle.vertexB, triangle.vertexC, triangle.vertexA, squareLength);
        }
    }


    labelUnknownSideOfTriangle(side,triangleObject) {
        if (triangleObject === undefined) {
            triangleObject = this.triangles[0];
        }
        let label, selectedSegment;
        if (triangleObject.right && side === 'C') {
            label = 'H';
        } else {
            if (side === 'C') {
                selectedSegment = triangleObject.segmentC;
            } else if (side === 'A') {
                selectedSegment = triangleObject.segmentA;
            } else if (side === 'B') {
                selectedSegment = triangleObject.segmentB;
            }

            if (selectedSegment.isHorizontal()) {
                label = 'X';
            } else if (selectedSegment.isVertical()) {
                label = 'Y';
            } else {
                label = side;
            }
        }
        //    labelSide(oppositeVertex, label, triangleObject) {
        this.labelSide(side,label,triangleObject);
    }

}

/*
GEOMETRY PAD PROBLEMS
 */
function solveForHypotenuseProblem(leg1, leg2) {
    let myTriangle = new GeometryPad();
    myTriangle.addTriangleSAS(leg1,90,leg2);
    myTriangle.addRightAngleMarker();
    myTriangle.makeOrientationCounterClockwise();
    myTriangle.labelSide('A');
    myTriangle.labelSide('B');
    myTriangle.labelUnknownSideOfTriangle('C');
    return myTriangle
}

function solveForLegProblem(knownLeg, hypotenuse, squareLength) {
    let unknownLeg = Math.sqrt(hypotenuse**2 - knownLeg**2);
    let myTriangle = new GeometryPad();

    myTriangle.addTriangleSSS(knownLeg, unknownLeg, hypotenuse);
    myTriangle.addRightAngleMarker(squareLength);
    myTriangle.makeOrientationCounterClockwise();
    myTriangle.labelSide('A');
    myTriangle.labelSide('C');
    myTriangle.labelUnknownSideOfTriangle('B');
    return myTriangle
}

//    $("#triangle1").append(SOHCAHTOAsideProblem(5,12,13,'A','C','A').drawCanvas(250));
function SOHCAHTOAsideProblem(legA, hypotenuse, knownAngle, knownSide, unknownSide) {
    let myTriangle = new GeometryPad();
    myTriangle.addTriangleSSS(legA,Math.sqrt(hypotenuse**2 - legA**2), hypotenuse,true);
    myTriangle.makeOrientationCounterClockwise();
    myTriangle.addRightAngleMarker();
    myTriangle.labelAngle(knownAngle,undefined,undefined,undefined);
    myTriangle.labelSide(knownSide);
    myTriangle.labelUnknownSideOfTriangle(unknownSide);
    return myTriangle
}

function selectTheOtherLeg(thisLeg) {
    if (thisLeg === 'A') {
        return 'B'
    } else if (thisLeg === 'B') {
        return 'A'
    }
}

function sineProblem(legA,hypotenuse,knownAngle = 'A') {
    const knownSide = 'C';
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}
function cosineProblem(legA,hypotenuse,knownAngle = 'A') {
    const knownSide = 'C';
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}
function tangentProblem(legA,hypotenuse,knownAngle ='A') {
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}
function secantProblem(legA,hypotenuse,knownAngle = 'A') { // reciprocal of cosine
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}

function cosecantProblem(legA,hypotenuse,knownAngle ='A') { // reciprocal of sine
    const knownSide = knownAngle;
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}

function cotangentProblem(legA,hypotenuse,knownAngle ='A') { //reciprocal of tangent
    const knownSide = knownAngle;
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide);
}
