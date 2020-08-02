
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

    addTriangleSAS(side1, angleInDegrees, side2, vertexA) {
      if (vertexA === undefined) {
        vertexA = makeOrigin();
      }
        let newTriangle = constructTriangleSAS(vertexA, side1, angleInDegrees, side2);
        this.triangles.push(newTriangle);
        this.addExistingTriangleObject(newTriangle);
        return newTriangle
    }

    addTriangleSSS(side1, side2, side3, vertexA) {
      if (vertexA === undefined) {
        vertexA = makeOrigin();
      }
      let newTriangle = constructTriangleSSS(side1, side2, side3, vertexA);
      this.triangles.push(newTriangle);
      this.addExistingTriangleObject(newTriangle);
      return newTriangle
    }

    labelTriangleLength(oppositeVertex, label, triangleObject) {
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

    labelAngle(vertex, label, degreeSymbol, triangleObject) {
      if (triangleObject === undefined) {
        triangleObject = this.triangles[0];
      }
      if (label === undefined) {
        if (vertex === 'A') {
          label = String(Math.round(triangleObject.angleA,2));
        } else if (vertex === 'B') {
          label = String(Math.round(triangleObject.angleB,2));
        } else if (vertex === 'C') {
          label = String(Math.round(triangleObject.angleC,2));
        }
        if (degreeSymbol === undefined) { // add degree symbol if label is default
          degreeSymbol === true;
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
      super.labelAngle(label, outsidePoint1, vertexPoint, outsidePoint2, undefined, undefined, degreeSymbol);
    }

    labelAngleTheta(vertex, triangleObject) {
      this.labelAngle(vertex,'theta',false, triangleObject);
    }
    labelAnglePhi(vertex) {
      this.labelAngle(vertex,'phi',false, triangleObject);
    }

    addExistingTriangleObject(triangleObject) {
        this.addExistingSegment(triangleObject.segmentA);
        this.addExistingSegment(triangleObject.segmentB);
        this.addExistingSegment(triangleObject.segmentC);
    }

    makeRightTriangle(triangle, squareLength) {
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

}
