/// counterclockwise convention: the side that is counterclockwise of each vertex has the same name as that vertex
// counterclockwise convention: the angle counterclockwise on each vertex has the same name as that vertex
class Polygon {
    constructor(arrayOfVertices) {
        if (arrayOfVertices.length <= 2) {
            console.log('Must have greater than 2 vertices to create polygon!');
            return false
        } else {
            this.polygon = true;
            this.vertices = arrayOfVertices;
            this.calculateParameters();
        }
        this.orientation = 'clockwise'; // default orientation
    }

    setOrientationClockwise() {
        this.orientation = 'clockwise';
    }

    setOrientationCounterclockwise() {
        this.orientation = 'counterclockwise';
    }

    calculateParameters() {
        this.lengths = [];
        this.angles = [];
        let i;
        const penultimateVertex = this.vertices[this.vertices.length - 2];
        const lastVertex = this.vertices[this.vertices.length - 1];
        const firstVertex = this.vertices[0];
        const secondVertex = this.vertices[1];
        this.lengths.push(firstVertex.getDistanceToAnotherPoint(secondVertex));
        this.angles.push(convertRadiansToDegrees(getAngleOfTwoRays(lastVertex,firstVertex,secondVertex)));
        for (i = 1; i < this.vertices.length - 1; i++ ) {
            const previousVertex = this.vertices[i - 1];
            const thisVertex = this.vertices[i];
            const nextVertex = this.vertices[i + 1];
            this.lengths.push(thisVertex.getDistanceToAnotherPoint(nextVertex));
            this.angles.push(convertRadiansToDegrees(getAngleOfTwoRays(previousVertex, thisVertex, nextVertex))); // always returns the interior angle!!!! WILL NOT WORK FOR CONVEX polygons
        }
        this.lengths.push(lastVertex.getDistanceToAnotherPoint(firstVertex));
        this.angles.push(convertRadiansToDegrees(getAngleOfTwoRays(penultimateVertex, lastVertex, firstVertex)));

    }

    //returns three points with the vertex of the given index in the middle
    getThreeVertices(index) {
        let points;
        if (index === 0) {
            points = [ this.vertices[this.vertices.length - 1], this.vertices[0], this.vertices[1]];
        } else if (index === this.vertices.length - 1) {
            points = [this.vertices[index - 1], this.vertices[index], this.vertices[0]];
        } else if (index > this.vertices.length - 1) {
            console.log('ERROR: index given out of range');
        } else {
            points = [this.vertices[index - 1], this.vertices[index], this.vertices[index + 1]];
        }
        return points
    }

    // rotates vertices counterclockwise
    // the previous vertex0 becomes vertex1, the previous vertex1 becomes vertex2 etc.
    // the previous final vertex becomes vertex0
    rotateVertices() {
        if (this.vertices.length === 3) {
            console.log('ERROR: using rotateVerticies for triangle, use rotateTriangleVerticies function')
        }
        const oldVertexArray = this.vertices;
        const oldLengthArray = this.lengths;
        const oldAngleArray = this.angles;

        let newVertexArray = oldVertexArray[oldVertexArray.length - 1];
        let newLengthArray = oldLengthArray[oldVertexArray.length - 1];
        let newAngleArray = oldAngleArray[oldVertexArray.length - 1];

        let j;
        for (j = 1; j < oldVertexArray.length - 1; j++) {
            newVertexArray.push(oldVertexArray[j - 1]);
            newLengthArray.push(oldLengthArray[j - 1]);
            newAngleArray.push(oldAngleArray[j - 1]);
        }
        this.vertices = newVertexArray;
        this.lengths = newLengthArray;
        this.angles = newAngleArray;
    }


    rotateAboutPoint(angleInDegrees, centerPoint) {
        const theta = convertDegreesToRadians(angleInDegrees);
        this.vertices.forEach((vertex) => {
            console.log(vertex, centerPoint);
            vertex.rotate(theta, centerPoint);
        });
    }
}

/// THESE ALL NEED TO BE A COUNTERCLOCKWISE ORIENTATION!!!!
function rhombus(sideLength, angle1inDegrees, vertex0 = makeOrigin()) {
    const angle1inRadians = convertDegreesToRadians(angle1inDegrees);
    const angle2inRadians = Math.PI - angle1inRadians;
    const vertex1 = vertex0.translateAndReproducePolar(sideLength, Math.PI / 2 - angle1inRadians / 2);
    const vertex3 = vertex0.translateAndReproducePolar(sideLength, Math.PI / 2 + angle1inRadians / 2);
    const vertex2 = vertex3.translateAndReproducePolar(sideLength, angle2inRadians / 2);
    return new Polygon([vertex0, vertex1, vertex2, vertex3]);
}

function trapezoid(base1, base2, lowAngle1inDegrees, lowAngle2inDegrees, vertex0 = makeOrigin()) {
    const vertex1 = new Point(vertex0.x + base1, vertex0.y);
    //// NOT SURE WHERE TO GO FROM HERE!
}

function isoscelesTrapezoid(base1, base2, lowAngleInDegrees, vertex0) {
    return trapezoid(base1, base2, lowAngleInDegrees, lowAngleInDegrees, vertex0)
}


/// THESE ALL NEED TO BE A COUNTERCLOCKWISE ORIENTATION!!!!
function rightTrapezoid(base1, base2, height, vertex0 = makeOrigin()) {
    const vertex1 = vertex0.translateAndReproduce(0,height);
    const vertex2 = vertex3.translateAndReproduce(base2,0);
    const vertex3 = vertex0.translateAndReproduce(base1,0);
    return new Polygon([vertex0,vertex1,vertex2,vertex3])
}

function parallelogram() {

}

function regularPentagon(sideLength) {
    return constructRegularPolygon(5, sideLength)
}

function homePlate(scaleFactor, vertex0 = makeOrigin()) {
    const base = 17 * scaleFactor; // based on MLB official rules
    const height = 8.5 * scaleFactor;
    const topSides = 12 * scaleFactor;
    const theta = Math.acos(base / 2 / topSides);

    const vertex4 = vertex0.translateAndReproduce(base,0);
    const vertex3 = vertex1.translateAndReproducePolar(0,height);
    const vertex1 = vertex0.translateAndReproducePolar(0,height);
    const vertex2 = vertex4.translateAndReproducePolar(topSides, theta);
    return new Polygon([vertex0, vertex1, vertex2, vertex3, vertex4]);
}

function regularHexagon(sideLength) {
    return constructRegularPolygon(6, sideLength)

}

function regularOctagon(sideLength) {
    return constructRegularPolygon(8, sideLength)
}


//// INCOMPLETE!!!!!!!
function constructRegularPolygon(nSides, sideLength, vertex0 = makeOrigin()) {
    const theta =  convertDegreesToRadians((nSides - 2) * 180 / nSides);
    this.currentAngle = 0;
    let i;
    let vertexArray = [vertex0];
    for (i = 0; i < nSides; i++) {
        let phi = undefined;
        /// figure out a recursive function that always gives the next angle, relative to the horizontal, of a regular polygon
        vertexArray.push(vertexArray[i].translateAndReproducePolar(sideLength,phi));
    }
    return new Polygon(vertexArray)
}