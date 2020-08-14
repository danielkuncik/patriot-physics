
/*
To do: (8-12-2020)
- make sure triangles appear as polygons
- add all of the functions to create different types of polygon
- use this to create a very good AREA pod
- create functions to label polygons
 */

// for making shapes etc.
class GeometryPad extends Diagram {
    constructor() {
        super();
        this.triangles = [];
        this.unclassifiedPolygons = [];
        this.rectangles = [];
        this.orientation = 'counterclockwise'; // default
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


    /// ##########################################
    /// TRIANGLE METHODS
    addTriangleObject(triangleObject) {
      this.triangles.push(triangleObject);
      super.addExistingPoint(triangleObject.vertexA);
      super.addExistingPoint(triangleObject.vertexB);
      super.addExistingPoint(triangleObject.vertexC);
      super.addExistingSegment(triangleObject.segmentA);
      super.addExistingSegment(triangleObject.segmentB);
      super.addExistingSegment(triangleObject.segmentC);
      return triangleObject
    }


    addTriangleSAS(side1, angleInDegrees, side2, forceRight, vertexA = makeOrigin()) {
        let newTriangle = constructTriangleSAS(side1, angleInDegrees, side2, forceRight, vertexA);
        return this.addTriangleObject(newTriangle)
    }

    addTriangleSSS(side1, side2, side3, forceRight, vertexA = makeOrigin()) {
      let newTriangle = constructTriangleSSS(side1, side2, side3, forceRight, vertexA);
      return this.addTriangleObject(newTriangle)
    }

    addTriangleASA(angle1inDegrees, side, angle2inDegrees, forceRight, vertexA = makeOrigin()) {
        let newTriangle = constructTriangleASA(angle1inDegrees, side, angle2inDegrees, forceRight, vertexA);
        return this.addTriangleObject(newTriangle)
    }

    addTriangleSAA(side, angle1inDegrees, angle2inDegrees, forceRight, vertexA = makeOrigin()) {
        let newTriangle = constructTriangleSAA(side, angle1inDegrees, angle2inDegrees, forceRight, vertexA);
        return this.addTriangleObject(newTriangle)
    }

    addEquilateralTriangle(sideLength, vertexA = makeOrigin()) {
      let newTriangle = constructEquilateralTriangle(sideLength, vertexA);
      return this.addTriangleObject(newTriangle)
    }

    addRightTriangleHypotenuseAngle(hypotenuse, angleA, vertexA = makeOrigin()) {
      let newTriangle = constructRightTriangleHypotenuseAngle(hypotenuse, angleA, vertexA);
      return this.addTriangleObject(newTriangle)
    }

    labelSideOfTriangle(oppositeVertex, label, triangleObject = this.triangles[0]) {
        if (this.fontSize === 0) { /// may create issues !!!
            this.calculateFontSize();
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

    labelAngleOfTriangle(vertex, label, degreeSymbol, triangleObject = this.triangles[0], moveToKey) {
        if (this.fontSize === 0) {
            this.calculateFontSize();
        }
      if (moveToKey === undefined) {
          const minSideLength = this.fontSize * 3;
          const minAngle = 15;
          if (vertex === 'A') {
              moveToKey = triangleObject.angleA < minAngle || triangleObject.sideLengthB < minSideLength || triangleObject.sideLengthC < minSideLength;
          } else if (vertex === 'B') {
              moveToKey = triangleObject.angleB < minAngle || triangleObject.sideLengthA < minSideLength || triangleObject.sideLengthC < minSideLength;
          } else if (vertex === 'C') {
              moveToKey = triangleObject.angleC < minAngle || triangleObject.sideLengthA < minSideLength || triangleObject.sideLengthB < minSideLength;
          }
          if (label === 'θ') {
              moveToKey = false;
          }
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


    labelAngleOfTriangleTheta(vertex, triangleObject) {
      this.labelAngleOfTriangle(vertex,'θ',false, triangleObject);
    }
    labelAngleOfTrianglePhi(vertex, triangleObject) {
      this.labelAngleOfTriangle(vertex,'φ',false, triangleObject);
    }

    // addTriangleToDiagram(triangleObject) {
    //     this.addExistingSegment(triangleObject.segmentA);
    //     this.addExistingSegment(triangleObject.segmentB);
    //     this.addExistingSegment(triangleObject.segmentC);
    // }

    addRightTriangleMarker(squareLength,triangleObject = this.triangles[0]) {
        if (this.fontSize === 0) { /// may create issues !!!
            this.calculateFontSize();
        }

        if (squareLength === undefined) {
            if (triangleObject.right) {
                squareLength = Math.min(this.fontSize, triangleObject.sideLengthA * 0.3, triangleObject.sideLengthB * 0.3);
            } else {
                squareLength = this.fontSize;
            }
        }
        if (Math.abs(triangleObject.angleA - 90) < 1e-10) {
            super.squareAngle(triangleObject.vertexC, triangleObject.vertexA, triangleObject.vertexB, squareLength);
        } else if (Math.abs(triangleObject.angleB - 90) < 1e-10) {
            super.squareAngle(triangleObject.vertexA, triangleObject.vertexB, triangleObject.vertexC, squareLength);
        } else if (Math.abs(triangleObject.angleC - 90) < 1e-10) {
            super.squareAngle(triangleObject.vertexB, triangleObject.vertexC, triangleObject.vertexA, squareLength);
        }
    }

    // under what conditions should i move information to the key?
    // very low angles or very short sides
    showAllTriangleInformation(triangleObject = this.triangles[0]) {
        if (triangleObject.right) {
            this.addRightTriangleMarker(undefined, triangleObject);
            this.labelAngleOfTriangle('A',undefined,true,triangleObject);
            this.labelAngleOfTriangle('B',undefined,true,triangleObject);
        } else {
            this.labelAngleOfTriangle('A',undefined,true,triangleObject);
            this.labelAngleOfTriangle('B',undefined,true,triangleObject);
            this.labelAngleOfTriangle('C',undefined,true,triangleObject);
        }
        this.labelSideOfTriangle('A',undefined,triangleObject);
        this.labelSideOfTriangle('B',undefined,triangleObject);
        this.labelSideOfTriangle('C',undefined,triangleObject);
    }


    labelUnknownSideOfTriangle(side,triangleObject = this.triangles[0]) {
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
        this.labelSideOfTriangle(side,label,triangleObject);
    }

    spinTriangle(angleInDegrees, triangleObject = this.triangles[0]) {
        triangleObject.spin(angleInDegrees);
    }


    // #####################################################################
    /// POLYGON METHODS
    /// "polygon" here refers to the polygon object, which covers all polygons with 4 or more sides, but not triangles

    addNonTrianglePolygonToDiagram(polygonObject) {
      let i, thisVertex, lastVertex = polygonObject.vertices[polygonObject.vertices.length - 1];
      for (i = 0; i < polygonObject.vertices.length; i++) {
        thisVertex = polygonObject.vertices[i];
        super.addSegment(lastVertex,thisVertex);
        lastVertex = thisVertex;
      }
    }

    addSquare(sideLength, vertex0 = makeOrigin()) {
      let newSquare = new Square(sideLength);
      this.rectangles.push(newSquare);
      this.addNonTrianglePolygonToDiagram(newSquare);
    }

    addRectangle(width, height, vertex0 = makeOrigin()) {
      let newRectangle = new Rectangle(width, height, vertex0);
      this.rectangles.push(newRectangle);
      this.addNonTrianglePolygonToDiagram(newRectangle);
    }

    spinRectangle(angleInDegrees, rectangleObject = this.rectangles[0]) {
      rectangleObject.spinAboutCenter(angleInDegrees);
    }

    addTrapezoid() {

    }

    addIsoscelesTrapezoid() {

    }

    addRightTrapezoid() {

    }

    addParallelogram() {

    }

    addRhombus() {

    }

    addRegularPentagon() {

    }

    addHomePlate() {

    }

    addRegularHexagon() {

    }

    addRegularOctagon(sideLength) {

    }

    addStopSign(sideLength) {
        this.addRegularOctagon(sideLength);
    }

    labelAngleOfPolygon(vertexIndex, label, degreeSymbol, polygonObject = this.polygons[0]) {
        if (this.fontSize === 0) {this.calculateFontSize();}
    }

    squareAngleOfPolygon(vertexIndex, polygonObject = this.polygons[0]) {
        if (this.fontSize === 0) {this.calculateFontSize();}
    }

    squareAllRightAnglesOfPolygon(polygonObject = this.polygons[0]) {

    }

    labelSideOfPolygon(vertexIndex, label, polygonObject = this.polygons[0]) {
        if (this.fontSize === 0) {this.calculateFontSize();}
    }

}
