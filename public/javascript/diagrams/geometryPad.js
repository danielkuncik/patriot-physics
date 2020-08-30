
/*
To do: (8-12-2020)
- make sure triangles appear as polygons
- add all of the functions to create different types of polygon
- use this to create a very good AREA pod
- create functions to label polygons


- this function should have its own draw canvas
- the labels need to be entered on their own

 */

// for making shapes etc.
class GeometryPad extends DiagramF {
    constructor() {
        super();
        this.triangles = [];
        this.unclassifiedPolygons = [];
        this.rectangles = [];
        this.fontSize = 0;
        this.fontMultiplier = 1;
        this.possibleUnknownAngleLabels = ['theta','phi','alpha','beta'];
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

    addTriangleVertices(vertexA, vertexB, vertexC) {
        let newTriangle = new TriangleF(vertexA, vertexB, vertexC);
        return this.addTriangleObject(newTriangle)
    }

    addEquilateralTriangle(sideLength, vertexA) {
      return this.addTriangleObject(constructEquilateralTriangleF(sideLength, vertexA));
    }
    addIsoscelesTriangle(width, height, vertexA) {
      return this.addTriangleObject(constructIsocelesTriangle(width, height, vertexA))
    }

    // PRIVATE METHOD!!!
    addRightTriangle(triangleObject, rightAngleMarker) {
      let newTriangle = this.addTriangleObject(triangleObject);
      if (rightAngleMarker) {
        this.squareTriangleVertexC(newTriangle)
      }
      return newTriangle
    }

    addRightTriangleHypotenuseAngle(hypotenuse, angleA, swapLegs, rightAngleMarker = true, vertexA) {
      return this.addRightTriangle(constructRightTriangleHypotenuseAngleF(hypotenuse, angleA, swapLegs, vertexA), rightAngleMarker);
    }

    addRightTriangleTwoLegs(xLeg, yLeg, swapLegs, rightAngleMarker = true, vertexA) {
       return this.addRightTriangle(constructRightTriangleTwoLegsF(xLeg, yLeg, swapLegs, vertexA), rightAngleMarker)
    }
    addRightTriangleHypotenuseLeg(hypotenuse, xLeg, swapLegs, rightAngleMarker = true, vertexA) {
      return this.addRightTriangle(constructRightTriangleHypotenuseLegF(hypotenuse, xLeg, swapLegs, vertexA), rightAngleMarker)
    }

    addTriangleSAS(sideC, angleBinDegrees, sideA, vertexA) {
      return this.addTriangleObject(constructTriangleSASF(sideC, angleBinDegrees, sideA, vertexA))
    }
    addTriangleASA(angleAinDegrees, sideC, angleBinDegrees, vertexA) {
      return this.addTriangleObject(constructTriangleASAF(angleAinDegrees, sideC, angleBinDegrees, vertexA))
    }
    addTriangleSSS(sideC, sideB, sideA, vertexA) {
      return this.addTriangleObject(constructTriangleSSSF(sideC, sideB, sideA, vertexA))
    }
    addTriangleAAS(angleCinDegrees, angleAinDegrees, sideC, vertexA) {
      return this.addTriangleObject(constructTriangleAASF(angleCinDegrees, angleAinDegrees, sideC, vertexA))
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
      const textLocation = getOptimalLocationOfText(end1, end2, triangleObject.orientation); // clockwise orientiation default
      if (textLocation === 'above' || textLocation === 'left') {
        this.labelLineAbove(end1, end2, label, this.fontSize / 2 , this.fontSize);
      } else if (textLocation === 'below' || textLocation === 'right') {
        this.labelLineBelow(end1, end2, label, this.fontSize / 2, this.fontSize);
      }
    }
    //    labelAngleOfTriangle(vertex, label, degreeSymbol, triangleObject = this.triangles[0], moveToKey) {

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


    // addTriangleToDiagram(triangleObject) {
    //     this.addExistingSegment(triangleObject.segmentA);
    //     this.addExistingSegment(triangleObject.segmentB);
    //     this.addExistingSegment(triangleObject.segmentC);
    // }

/// PRIVATE METHOD
    defaultSquareLengthOfTriangle(triangleObject) {
      if (this.fontSize === 0) {
        this.fontSize = this.calculateFontSize();
      }
      if (triangleObject.right) {
           return Math.min(this.fontSize, triangleObject.sideLengthA * 0.3, triangleObject.sideLengthB * 0.3);
      } else {
           return Math.min(this.fontSize, triangleObject.sideLengthA * 0.3, triangleObject.sideLengthB * 0.3, triangleObject.sideLengthC);
      }
    }

    squareTriangleVertexA(triangleObject = this.triangles[0], squareLength = this.defaultSquareLengthOfTriangle(triangleObject)) {
        super.squareAngle(triangleObject.vertexC, triangleObject.vertexA, triangleObject.vertexB, squareLength);
    }
    squareTriangleVertexB(triangleObject = this.triangles[0], squareLength = this.defaultSquareLengthOfTriangle(triangleObject)) {
        super.squareAngle(triangleObject.vertexA, triangleObject.vertexB, triangleObject.vertexC, squareLength);
    }
    squareTriangleVertexC(triangleObject = this.triangles[0], squareLength = this.defaultSquareLengthOfTriangle(triangleObject)) {
        super.squareAngle(triangleObject.vertexB, triangleObject.vertexC, triangleObject.vertexA, squareLength);
    }

    /// does this funciton have a use????? it's supposed to be vertex C
    addAutomaticRightTriangleMarker(triangleObject = this.triangles[0], squareLength = defaultSquareLengthOfTriangle(triangleObject)) {
        if (Math.abs(triangleObject.angleA - 90) < 1e-10) {
          this.squareTriangleVertexA(triangleObject, squareLength);
        } else if (Math.abs(triangleObject.angleB - 90) < 1e-10) {
          this.squareTriangleVertexB(triangleObject, squareLength);
        } else if (Math.abs(triangleObject.angleC - 90) < 1e-10) {
          this.squareTriangleVertexC(triangleObject, squareLength);
        }
    }

    // under what conditions should i move information to the key?
    // very low angles or very short sides
    showAllTriangleInformation(triangleObject = this.triangles[0]) {
        if (triangleObject.right) {
            this.addAutomaticRightTriangleMarker(undefined, triangleObject);
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

//    labelAngleOfTriangle(vertex, label, degreeSymbol, triangleObject = this.triangles[0], moveToKey) {

    // perhaps I could make an array of possible unknowns, and pop them out as i use them
    labelUnknownAngleOfTriangle(vertex, triangleObject = this.triangles[0]) {
      const label = this.possibleUnknownAngleLabels[0];
      this.possibleUnknownAngleLabels.shift();
      this.labelAngleOfTriangle(vertex, label, false, triangleObject);
      return label;
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
        return label
    }

    /// screws up all of the labels!!
    // i need to check how my pointers are working in order to fix this
    spinTriangle(angleInDegrees, triangleObject = this.triangles[0]) {
        triangleObject.spin(angleInDegrees);
    }

    addTriangleAltitude(whichVertex, dashed, squareLabel = true, triangleObject = this.triangles[0]) {
        let altitude = triangleObject.getAltitude(whichVertex);
        if (dashed) {
            altitude.turnIntoDashedLine();
        }
        super.addExistingSegment(altitude);
        if (squareLabel) {
            let otherVertex;
            if (whichVertex === 'A') {
                otherVertex = triangleObject.vertexB;
            } else if (whichVertex === 'B') {
                otherVertex = triangleObject.vertexC;
            } else if (whichVertex === 'C') {
                otherVertex = triangleObject.vertexA;
            }
            super.squareAngle(altitude.point1, altitude.point2, otherVertex, altitude.getLength() * 0.06);
        }
        return altitude
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

    addSquare(sideLength, vertex0 = makeOriginF()) {
      let newSquare = new SquareF(sideLength);
      this.rectangles.push(newSquare);
      this.addNonTrianglePolygonToDiagram(newSquare);
    }

    addRectangle(width, height, vertex0 = makeOriginF()) {
      let newRectangle = new RectangleF(width, height, vertex0);
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
