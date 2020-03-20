
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

    addExistingTriangleObject(triangleObject) {
        this.addExistingSegment(triangleObject.segmentA);
        this.addExistingSegment(triangleObject.segmentB);
        this.addExistingSegment(triangleObject.segmentC);
    }

}