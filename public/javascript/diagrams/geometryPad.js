
// for making shapes etc.
class GeometryPad extends Diagram {
    constructor() {
        super();
        this.triangles = [];
    }

    addTriangleSAS(vertexA, side1, angleInDegrees, side2) {
        let newTriangle = constructTriangleSAS(vertexA, side1, angleInDegrees, side2);
        this.triangles.push(newTriangle);
        this.addExistingTriangleObject(newTriangle);
        return newTriangle
    }

    addTriangleSSS(side1, side2, side3, vertexA) {
      let newTriangle = constructTriangleSSS(side1, side2, side3, vertexA);
      this.triangles.push(newTriangle);
      this.addExistingTraignleObject(newTriangle);
      return newTriangle
    }

    labelTriangleLength(triangleObject, label, oppositeVertex) {
      let end1, end2;
      if (oppositeVertex === 'A') {
        end1 = triangleObject.vertexB;
        end2 = triangleObject.vertexC;
      } else if (oppositeVertex === 'B') {
        end1 = triangleObject.vertexA;
        end2 = triangleObject.vertexC;
      } else if (oppositeVertex === 'C') {
        end1 = triangleObject.vertexA;
        end2 = triangleObject.vertexB;
      }
      const textLocation = getOptimalLocationOfText(end1, end2, 'clockwise'); // clockwise orientiation default
      console.log(textLocation);
      if (textLocation === 'above' || textLocation === 'left') {
        this.labelLineAbove(end1, end2, label);
      } else if (textLocation === 'below' || textLocation === 'right') {
        this.labelLineBelow(end1, end2, label);
      }
      // label line outside function
    }



    addExistingTriangleObject(triangleObject) {
        this.addExistingSegment(triangleObject.segmentA);
        this.addExistingSegment(triangleObject.segmentB);
        this.addExistingSegment(triangleObject.segmentC);
    }

}
