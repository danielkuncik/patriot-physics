
// for making shapes etc.
class GeometryPad extends Diagram {
    constructor() {
        super();
        this.triangles = [];
        this.orientation = 'clockwise';
        this.fontSize = 0;
        this.fontMultiplier = 1;
    }

    makeOrientationCounterClockwise() {
      this.orientation = 'counterclockwise';
    }
    makeOrientationClockwise() {
      this.orientation = 'clockwise';
    }

    calculateFontSize() {
        let numerator = 0, denominator = 0;
        // this.triangles.forEach((triangle) => {
        //     numerator += triangle.recommendedFontSize;
        //     denominator += 1;
        // });
        this.segments.forEach((segment) => {
            numerator += segment.getLength();
            denominator += 1;
        });
        return this.setFontSize(numerator / denominator * 0.1);
    }
    setFontSize(newFontSize) {
        this.fontSize = newFontSize;
        return newFontSize
    }

    getFarAwayPoint() { // returns a point far away from the points of the problems
        super.getRange();
        const newX = (this.xMax + this.xMin) / 2;
        const yUp = (this.yMax - this.yMin) * 0.2;
        return new Point(newX, this.yMax + yUp);
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

    labelAngle(vertex, label, degreeSymbol, triangleObject, moveToKey) {
        if (this.fontSize === 0) {
            this.calculateFontSize();
        }
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

      let textOnAorB = 'A'; //confusing here, this means something different than the A, B, and C verticies of the triangle !
        /// this is one the parameters of the 'label angle' function that determines on which segment the label appears
      let outsidePoint1, vertexPoint, outsidePoint2, segmentAboveText; // segment above text is the segment that could potentially intersect a text box, creating a problem
        if (vertex === 'A') {
        outsidePoint1 = triangleObject.vertexC;
        vertexPoint = triangleObject.vertexA;
        outsidePoint2 = triangleObject.vertexB;
        if (textOnAorB === 'A') {
            segmentAboveText = triangleObject.segmentC;
        } else if (textOnAorB === 'B') {
            segmentAboveText = triangleObject.segmentB;
        }
      } else if (vertex === 'B') {
        outsidePoint1 = triangleObject.vertexA;
        vertexPoint = triangleObject.vertexB;
        outsidePoint2 = triangleObject.vertexC;
          if (textOnAorB === 'A') {
              segmentAboveText = triangleObject.segmentA;
          } else if (textOnAorB === 'B') {
              segmentAboveText = triangleObject.segmentC;
          }
      } else if (vertex === 'C') {
        outsidePoint1 = triangleObject.vertexB;
        vertexPoint = triangleObject.vertexC;
        outsidePoint2 = triangleObject.vertexA;
          if (textOnAorB === 'A') {
              segmentAboveText = triangleObject.segmentB;
          } else if (textOnAorB === 'B') {
              segmentAboveText = triangleObject.segmentA;
          }
      }
      //     labelAngle(label, outsidePointA, vertex, outsidePointB, interiorOrExterior, textOnAorB, addDegreeLabel, radiusProportion, fontProportion) {
        // creates a problem if one of the points is the origin

        if (moveToKey) {
            let text = super.labelAngle('θ', outsidePoint1, vertexPoint, outsidePoint2, 'interior', textOnAorB, false, undefined, undefined, this.fontSize);
            let newLabel = `θ = ${label}`;
            if (degreeSymbol) {
                newLabel = newLabel + '°';
            }
            super.addLineToKey(newLabel);
        } else {
            let text = super.labelAngle(label, outsidePoint1, vertexPoint, outsidePoint2, 'interior', textOnAorB, degreeSymbol, undefined, undefined, this.fontSize);
        }
    /// i might want to do something with 'textOnAOrB' to avoid awkward text


    }
    /*
    Essentially, if the label intersects the space above it, then it should be moved
     */


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
function SOHCAHTOAsideProblem(legA, hypotenuse, knownAngle, knownSide, unknownSide, fontSize, moveAngleLabelToKey) {
    let myTriangle = new GeometryPad();
    if (fontSize) {
        myTriangle.setFontSize(fontSize);
    }
    myTriangle.addTriangleSSS(legA,Math.sqrt(hypotenuse**2 - legA**2), hypotenuse,true);
    myTriangle.makeOrientationCounterClockwise();
    myTriangle.addRightAngleMarker();
    myTriangle.labelAngle(knownAngle,undefined,undefined,undefined, moveAngleLabelToKey);
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

function sineProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) {
    const knownSide = 'C';
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize,moveAngleLabelToKey);
}
function cosineProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) {
    const knownSide = 'C';
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize,moveAngleLabelToKey);
}
function tangentProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) {
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = knownAngle;
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}
function secantProblem(legA,hypotenuse,knownAngle = 'A', fontSize, moveAngleLabelToKey) { // reciprocal of cosine
    const knownSide = selectTheOtherLeg(knownAngle);
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function cosecantProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) { // reciprocal of sine
    const knownSide = knownAngle;
    const unknownSide = 'C';
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function cotangentProblem(legA,hypotenuse,knownAngle ='A', fontSize, moveAngleLabelToKey) { //reciprocal of tangent
    const knownSide = knownAngle;
    const unknownSide = selectTheOtherLeg(knownAngle);
    return SOHCAHTOAsideProblem(legA,hypotenuse,knownAngle,knownSide,unknownSide, fontSize, moveAngleLabelToKey);
}

function inverseSineProblem(opposite, hypotenuse, unknownAngle = 'A', fontSize) {
    const adjacent = Math.sqrt(hypotenuse**2 - opposite**2);

}

function inverseCosineProblem(adjacent, hypotenuse, unknownAngle = 'A', fontSize) {
    const opposite = Math.sqrt(hypotenuse**2 - adjacent**2);
}

function inverseTangentProblem(opposite, adjacent, unknownAngle = 'A', fontSize) {
    let triangle = new GeometryPad();
    triangle.addTriangleSAS(opposite,90,adjacent);
    triangle.makeOrientationCounterClockwise();
    triangle.addRightAngleMarker();
    if (unknownAngle === 'A') {

    } else if (unknownAngle === 'B') {

    }
}