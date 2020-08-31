class Rectangle extends Polygon {
    constructor(width, height, vertex0) {
        const vertex1 = vertex0.translateAndReproduce(0,height);
        const vertex2 = vertex0.translateAndReproduce(width,height);
        const vertex3 = vertex0.translateAndReproduce(width,0);
        super([vertex0, vertex1, vertex2, vertex3]);
        this.area = width * height;
    }

    // diagonal through vertex 0 and vertex 2
    getDiagonal0() {
        return new Segment(this.vertices[0],this.vertices[2]);
    }
    getDiagonal1() {
        return new Segment(this.vertices[1],this.vertices[3]);
    }
    getCenter() {
        return this.getDiagonal0().intersectionWithAnotherSegment(this.getDiagonal1())
    }
    spinAboutCenter(angleInDegrees) {
        super.rotateAboutPoint(angleInDegrees, this.getCenter())
    }

}

class Square extends Rectangle {
    constructor(sideLength, vertex0) {
        super(sideLength, sideLength, vertex0);
    }
}
