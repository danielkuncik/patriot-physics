// a range box is a rectangle around text, a circle, an arc, or a curve.
// it has two purposes:
// 1 - to ensure that the space around an irregular object is included in the full range of a diagram
// 2 - to become a boarder if required (often for text)
class RangeBox {
    constructor(lowerLeftPoint, width, height) {
        this.lowerLeftPoint = lowerLeftPoint;
        this.upperLeftPoint = lowerLeftPoint.translateAndReproduce(constructZeroMagnitude(), height);
        this.lowerRightPoint = lowerLeftPoint.translateAndReproduce(width, constructZeroMagnitude());
        this.upperRightPoint = lowerLeftPoint.translateAndReproduce(width, height);
        this.resetMinAndMax();
        this.resetWidthAndHeight();
        this.centerPoint = this.lowerLeftPoint.interpolate(this.upperRightPoint, new Magnitude('0.5',undefined,undefined,true));
        this.segments = [];
        this.rotation = constructZeroAngle();
    }

    resetWidthAndHeight() {
        this.width = this.lowerRightPoint.x.subtractMag(this.lowerLeftPoint.x);
        this.height = this.upperLeftPoint.y.subtractMag(this.lowerLeftPoint.y);
    }

    resetMinAndMax() {
        let xMin = this.lowerLeftPoint.x, xMax = this.lowerLeftPoint.x, yMin = this.lowerLeftPoint.y, yMax = this.lowerLeftPoint.y;
        [this.lowerRightPoint, this.upperRightPoint, this.upperLeftPoint].forEach((point) => {
            if (point.x.isLessThan(xMin)) {
                xMin = point.x;
            }
            if (point.x.isGreaterThan(xMax)) {
                xMax = point.x;
            }
            if (point.y.isLessThan(yMin)) {
                yMin = point.y;
            }
            if (point.y.isGreaterThan(yMax)) {
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
        this.lowerLeftPoint.translate(horizontalExtension.reverseSign(), verticalExtension.reverseSign());
        this.upperLeftPoint.translate(horizontalExtension.reverseSign(), verticalExtension);
        this.lowerRightPoint.translate(horizontalExtension, verticalExtension.reverseSign());
        this.upperRightPoint.translate(horizontalExtension, verticalExtension);
        if (currentRotation) {
            this.rotateCounterClockwiseAboutCenter(currentRotation.reverseSign())
        }
        this.resetMinAndMax();
        this.resetWidthAndHeight();
    }


    rotateCounterClockwiseAboutCenter(angle) {
        this.rotation = this.rotation.addAngle(angle);
        this.lowerLeftPoint.rotate(angle, this.centerPoint); // i need unit tests for the point rotate method
        this.upperLeftPoint.rotate(angle, this.centerPoint);
        this.lowerRightPoint.rotate(angle, this.centerPoint);
        this.upperRightPoint.rotate(angle, this.centerPoint);
        this.resetMinAndMax();
    }

    rotateClockwiseAboutCenter(angle) {
        this.rotation = this.rotation.subtractAngle(angle);
        this.lowerLeftPoint.rotate(angle.reverseSign(), this.centerPoint);
        this.upperLeftPoint.rotate(angle.reverseSign(), this.centerPoint);
        this.lowerRightPoint.rotate(angle.reverseSign(), this.centerPoint);
        this.upperRightPoint.rotate(angle.reverseSign(), this.centerPoint);
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
        const horizontalExtension = this.width.multiplyMag(xMultiplier.subtractMag(constructMagnitudeFromFloat('1',undefined,undefined,true)));
        const verticalExtension = this.height.multiplyMag(yMultiplier.subtractMag(constructMagnitudeFromFloat('1',undefined,undefined,true)));
        this.extend(horizontalExtension, verticalExtension);
    }

    isPointInsideBox(point) { // UNTESTED
        return (point.x.isGreaterThan(this.xMin) && point.x.isLessThan(this.xMax) && point.y.isGreaterThan(this.yMin) && point.y.isLessThan(this.yMax))
    }

    ////// up to here!
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
            if (endA.getDistanceToAnotherPoint(intersection1).isLessThan(endA.getDistanceToAnotherPoint(intersection2))) {
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


    segmentConnectingRangeBoxes(anotherRangeBox, displacement = 0) {
        let center1 = this.centerPoint;
        let center2 = anotherRangeBox.centerPoint;

        // add diplacement here
        let theta = center1.getAngleToAnotherPoint(center2).subtractAngle(get90Degrees());
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
            if (segment1.point1.getDistanceToAnotherPoint(anotherRangeBox.centerPoint).isLessThan(segment2.point1.getDistanceToAnotherPoint(anotherRangeBox.centerPoint))) {
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
            if (segment1.point1.getDistanceToAnotherPoint(this.centerPoint).isLessThan(segment2.point1.getDistanceToAnotherPoint(this.centerPoint))) {
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
    let lowerLeftPoint = centerPoint.translateAndReproduce((width.divideMagExactConstant(2)).reverseSign(), (height.divideMagExactConstant(2)).reverseSign());
    return new RangeBoxF(lowerLeftPoint, width, height);
}

function constructRangeBoxFromExtremePointsF(minX, minY, maxX, maxY) {
    if (maxX <= minX) {
        console.log('ERROR: range box error- max X must be greater than min X');
        return false
    }
    if (maxY <= minY) {
        console.log('ERROR: range box error- maxY must be greater than min Y');
        return false
    }
    let width = maxX.subtractMag(minX);
    let height = maxY.subtractMag(minY);
    return new RangeBoxF(new Point(minX, minY), width, height);
}
