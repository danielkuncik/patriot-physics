// the box should always belong to an object!
class RangeBoxF {
    constructor(lowerLeftX, lowerLeftY, width, height) {
        this.lowerLeftPoint = new PointF(lowerLeftX, lowerLeftY);
        this.upperLeftPoint = new PointF(lowerLeftX, lowerLeftY + height);
        this.lowerRightPoint = new PointF(lowerLeftX + width, lowerLeftY);
        this.upperRightPoint = new PointF(lowerLeftX + width, lowerLeftY + height);
        this.resetMinAndMax();
        this.resetWidthAndHeight();
        this.centerPoint = new PointF(this.xMin + width / 2, this.yMin + height / 2);
        this.segments = [];
        this.rotation = 0;
    }

    resetWidthAndHeight() {
        this.width = this.lowerRightPoint.x - this.lowerLeftPoint.x;
        this.height = this.upperLeftPoint.y - this.lowerLeftPoint.y;
    }

    resetMinAndMax() {
        let xMin = this.lowerLeftPoint.x, xMax = this.lowerLeftPoint.x, yMin = this.lowerLeftPoint.y, yMax = this.lowerLeftPoint.y;
        [this.lowerRightPoint, this.upperRightPoint, this.upperLeftPoint].forEach((point) => {
            if (point.x < xMin) {
                xMin = point.x;
            }
            if (point.x > xMax) {
                xMax = point.x;
            }
            if (point.y < yMin) {
                yMin = point.y;
            }
            if (point.y > yMax) {
                yMax = point.y;
            }
            this.xMin = xMin;
            this.xMax = xMax;
            this.yMin = yMin;
            this.yMax = yMax;
        });
    }


    // can also be used to contract, with negative values
    // what if I rotate?
    extend(horizontalExtension, verticalExtension) {
        let currentRotation = this.rotation;
        if (currentRotation) {
            this.rotateCounterClockwiseAboutCenter(currentRotation)
        }
        this.lowerLeftPoint.translate(-1 * horizontalExtension, -1 * verticalExtension);
        this.upperLeftPoint.translate(-1 * horizontalExtension, verticalExtension);
        this.lowerRightPoint.translate(horizontalExtension, -1 * verticalExtension);
        this.upperRightPoint.translate(horizontalExtension, verticalExtension);
        if (currentRotation) {
            this.rotateCounterClockwiseAboutCenter(-1 * currentRotation)
        }
        // const h = Math.sqrt(horizontalExtension**2 + verticalExtension**2);
        // if (h === 0) {
        //     return false
        // }
        // let phi;
        // if (horizontalExtension === 0) {
        //     phi = Math.PI / 2;
        // } else if (verticalExtension === 0) {
        //     phi = 0;
        // } else {
        //     phi = Math.atan(verticalExtension/ horizontalExtension);
        // }
        // console.log(phi);
        // const theta = phi + this.rotation;
        //   // console.log(theta);
        //   const rotatedHorizontalExtension = horizontalExtension * Math.cos(this.rotation) - verticalExtension * Math.sin(this.rotation);
        //   const rotatedVerticalExtension = horizontalExtension * Math.sin(this.rotation) + verticalExtension * Math.cos(this.rotation);
        //   console.log(rotatedHorizontalExtension, rotatedVerticalExtension);
        //   /// problem here!
        // this.lowerLeftPoint.translate(-1 * rotatedHorizontalExtension, -1 * rotatedVerticalExtension);
        // this.upperLeftPoint.translate(-1 * rotatedHorizontalExtension, rotatedVerticalExtension);
        // this.lowerRightPoint.translate(rotatedHorizontalExtension, -1 * rotatedVerticalExtension);
        // this.upperRightPoint.translate(rotatedHorizontalExtension, rotatedVerticalExtension);
        this.resetMinAndMax();
        this.resetWidthAndHeight();
    }


    /// How do I reset min and max in this situation!
    rotateCounterClockwiseAboutCenter(angleInRadians) {
        this.rotation += angleInRadians;
        this.lowerLeftPoint.rotate(angleInRadians, this.centerPoint); // i need unit tests for the point rotate method
        this.upperLeftPoint.rotate(angleInRadians, this.centerPoint);
        this.lowerRightPoint.rotate(angleInRadians, this.centerPoint);
        this.upperRightPoint.rotate(angleInRadians, this.centerPoint);
        this.resetMinAndMax();
    }

    // how do i result min and Max in this situation!
    rotateClockwiseAboutCenter(angleInRadians) {
        this.rotation -= angleInRadians;
        this.lowerLeftPoint.rotate(-1 * angleInRadians, this.centerPoint);
        this.upperLeftPoint.rotate(-1 * angleInRadians, this.centerPoint);
        this.lowerRightPoint.rotate(-1 * angleInRadians, this.centerPoint);
        this.upperRightPoint.rotate(-1 * angleInRadians, this.centerPoint);
        this.resetMinAndMax();
    }


    translate(xTranslation, yTranslation) {
        this.centerPoint.translate(xTranslation, yTranslation);
        this.lowerLeftPoint.translate(xTranslation, yTranslation);
        this.upperLeftPoint.translate(xTranslation, yTranslation);
        this.upperRightPoint.translate(xTranslation, yTranslation);
        this.lowerRightPoint.translate(xTranslation, yTranslation);
        this.resetMinAndMax();
    }

    stretch(xMultiplier, yMultiplier) {
        const horizontalExtension = this.width * (xMultiplier - 1);
        const verticalExtension = this.height * (yMultiplier - 1);
        this.extend(horizontalExtension, verticalExtension);
    }

    isPointInsideBox(point) { // UNTESTED
        return (point.x > this.xMin && point.x < this.xMax && point.y > this.yMin && point.y < this.yMax)
    }

    // determines if a range box intersects a segment
    doesItIntersectSegment(segment) { // UNTESTED
        if (this.isPointInsideBox(segment.point1) && this.isPointInsideBox(segment.point2)) { // segment entirely inside of box
            return true
        } else if (segment.intersectionWithAnotherSegment(new SegmentF(this.lowerLeftPoint,this.lowerRightPoint))) { // if the segment intersects the segments of this box
            return true
        } else if (segment.intersectionWithAnotherSegment(new SegmentF(this.lowerRightPoint,this.upperRightPoint))) {
            return true
        } else if (segment.intersectionWithAnotherSegment(new SegmentF(this.lowerLeftPoint,this.upperLeftPoint))) {
            return true
        } else if (segment.intersectionWithAnotherSegment(new SegmentF(this.upperLeftPoint,this.upperRightPoint))) {
            return true
        } else {
            return false
        }
    }

    intersectionsWithSegment(segment) {
        let intersections = [];
        let possibility1 = segment.intersectionWithAnotherSegment(new SegmentF(this.lowerLeftPoint,this.lowerRightPoint));
        let possibility2 = segment.intersectionWithAnotherSegment(new SegmentF(this.lowerRightPoint,this.upperRightPoint));
        let possibility3 = segment.intersectionWithAnotherSegment(new SegmentF(this.lowerLeftPoint,this.upperLeftPoint));
        let possibility4 = segment.intersectionWithAnotherSegment(new SegmentF(this.upperLeftPoint,this.upperRightPoint));
        if (possibility1) {
            intersections.push(possibility1);
        }
        if (possibility2) {
            intersections.push(possibility2);
        }
        if (possibility3) {
            intersections.push(possibility3);
        }
        if (possibility4) {
            intersections.push(possibility4);
        }
        return intersections
    }

    // cuts a segment so it does not include pieces within the range box
    // returns an array of segments!
    cutSegment(segment) {
        const intersections = this.intersectionsWithSegment(segment);
        let result = [];
        if (intersections.length === 0) {
            // pass
            // but what if the whole segment is inside?
        } else if (intersections.length === 1) {
            // finds one intersection point
            // one end point is inside rangebox
            if (this.isPointInsideBox(segment.point1)) {
                let newSegment = new SegmentF(intersections[0], segment.point2);
                result.push(newSegment);
            } else if (this.isPointInsideBox(segment.point2)) {
                let newSegment = new SegmentF(intersections[0], segment.point1);
                result.push(newSegment);
            } else {
                console.log('ERROR: intersection found but segment not determined to be inside box', segment, this);
            }
        } else if (intersections.length === 2) {
            let intersection1 = intersections[0];
            let intersection2 = intersections[1];
            let endA = segment.point1;
            let endB = segment.point2;
            if (endA.getDistanceToAnotherPoint(intersection1) < endA.getDistanceToAnotherPoint(intersection2)) {
                let newSegment1 = new SegmentF(endA, intersection1);
                let newSegment2 = new SegmentF(endB, intersection2);
                result.push(newSegment1);
                result.push(newSegment2);
            } else {
                let newSegment1 = new SegmentF(endB, intersection1);
                let newSegment2 = new SegmentF(endA, intersection2);
                result.push(newSegment2);
                result.push(newSegment1);
            }
            // more complicated, will return 2 segments
        }
        return result
    }
    /// odd results possible if the point lands on the range box?

    // // on or inside
    // isPointInside(point) {
    //   return point.x >= this.xMin && point.x <= this.xMax && point.y >= this.yMin && point.y <= this.yMax
    // }


    addToDiagram(DiagramObject) {
        DiagramObject.addExistingPoint(this.lowerLeftPoint);
        DiagramObject.addExistingPoint(this.lowerRightPoint);
        DiagramObject.addExistingPoint(this.upperLeftPoint);
        DiagramObject.addExistingPoint(this.upperRightPoint);
        DiagramObject.addExistingPoint(this.centerPoint);
    }


    addSegmentsToDiagram(DiagramObject, horizontalExtension = 0, verticalExtension = 0) {
        // let newLowerLeft = this.lowerLeftPoint.translateAndReproduce(-1 * horizontalExtension, -1 * verticalExtension);
        // let newUpperLeft = this.upperLeftPoint.translateAndReproduce(-1 * horizontalExtension, verticalExtension);
        // let newLowerRight = this.lowerRightPoint.translateAndReproduce(horizontalExtension, -1 * verticalExtension);
        // let newUpperRight = this.upperRightPoint.translateAndReproduce(horizontalExtension, verticalExtension);

        this.extend(horizontalExtension, verticalExtension);
        DiagramObject.addSegment(this.lowerLeftPoint, this.lowerRightPoint);
        DiagramObject.addSegment(this.lowerRightPoint, this.upperRightPoint);
        DiagramObject.addSegment(this.upperRightPoint, this.upperLeftPoint);
        DiagramObject.addSegment(this.upperLeftPoint, this.lowerLeftPoint);

        // DiagramObject.addSegment(newLowerLeft, newLowerRight);
        // DiagramObject.addSegment(newLowerRight, newUpperRight);
        // DiagramObject.addSegment(newUpperRight, newUpperLeft);
        // DiagramObject.addSegment(newUpperLeft, newLowerLeft);
    }

    segmentConnectingRangeBoxes(anotherRangeBox, displacement = 0) {
        let center1 = this.centerPoint;
        let center2 = anotherRangeBox.centerPoint;

        // add diplacement here
        let theta = center1.getAngleToAnotherPoint(center2) - Math.PI / 2;
        let start1 = center1.translateAndReproducePolar(displacement, theta);
        let start2 = center2.translateAndReproducePolar(displacement, theta);

        let testSegment1 = new SegmentF(start1, start2);

        let testSegment2;
        let result1 = this.cutSegment(testSegment1);
        if (result1.length === 0) {
            testSegment2 = testSegment1;
        } else if (result1.length === 1) {
            testSegment2 = result1[0];
        } else if (result1.length === 2) { // the segment was cut into two by the function, pick the one that goes closest to the center of the other box
            let segment1 = result1[0];
            let segment2 = result1[1];
            if (segment1.point1.getDistanceToAnotherPoint(anotherRangeBox.centerPoint) < segment2.point1.getDistanceToAnotherPoint(anotherRangeBox.centerPoint)) {
                testSegment2 = segment1;
            } else {
                testSegment2 = segment2;
            }

        }

        let testSegment3;
        let result2 = anotherRangeBox.cutSegment(testSegment2);
        if (result2.length === 0) {
            testSegment3 = testSegment2;
        } else if (result2.length === 1) {
            testSegment3 = result2[0];
        } else if (result2.length === 2) { // result formatted so that the non-intersecting end is point1
            let segment1 = result2[0];
            let segment2 = result2[1];
            if (segment1.point1.getDistanceToAnotherPoint(this.centerPoint) < segment2.point1.getDistanceToAnotherPoint(this.centerPoint)) {
                testSegment3 = segment1;
            } else {
                testSegment3 = segment2;
            }
        }

        return testSegment3;
    }

}
// does this make a duplicate of the center Point??
function constructRangeBoxFromCenterF(centerPoint, width, height) {
    let lowerLeftX = centerPoint.x - width/2;
    let lowerLeftY = centerPoint.y - height/2;
    let newRangeBox = new RangeBoxF(lowerLeftX, lowerLeftY, width, height);
    return newRangeBox;
}

function constructRangeBoxFromExtremePointsF(minX, minY, maxX, maxY) {
    if (maxX <= minX) {
        console.log('ERROR: range box error- max X must be greater than min X');
    }
    if (maxY <= minY) {
        console.log('ERROR: range box error- maxY must be greater than min Y');
    }
    let width = maxX - minX;
    let height = maxY - minY;
    return new RangeBoxF(minX, minY, width, height);
}
