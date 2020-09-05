/*
I need to add something here:
open and or closed circles on the end, some segments have open circles on the end


To Do =>
to the point on segment, add a num sig figs argument
 */

class Segment {
    constructor(point1, point2, closedCircleAtPoint1 = true, closedCircleAtPoint2 = true) {
        this.point1 = point1;
        this.point2 = point2;
        this.closedCircleAtPoint1 = closedCircleAtPoint1;
        this.closedCircleAtPoint2 = closedCircleAtPoint2;
        this.line = new Line(point1, point2); // a corresponding infinite line through this point
        this.diagramQualities = {
            thickness: 2,
            color: "#000000",
            cap: "butt",
            dotted: false,
            dashed: false
        };


        // adopting convention of first and second points
        this.firstPoint = undefined;
        this.secondPoint = undefined;
        this.closedCircleAtFirstPoint = undefined;
        this.closedCircleAtSecondPoint = undefined;
        if (this.isVertical()) { // if vertical, first point always below
            if (this.point1.y.isLessThan(this.point2.y)) {
                this.firstPoint = this.point1;
                this.secondPoint = this.point2;
                this.closedCircleAtFirstPoint = this.closedCircleAtPoint1;
                this.closedCircleAtSecondPoint = this.closedCircleAtPoint2;
            } else {
                this.firstPoint = this.point2;
                this.secondPoint = this.point1;
                this.closedCircleAtFirstPoint = this.closedCircleAtPoint2;
                this.closedCircleAtSecondPoint = this.closedCircleAtPoint1;
            }
        } else { // else, first point always to right
            if (this.point1.x.isLessThan(this.point2.x)) {
                this.firstPoint = this.point1;
                this.secondPoint = this.point2;
                this.closedCircleAtFirstPoint = this.closedCircleAtPoint1;
                this.closedCircleAtSecondPoint = this.closedCircleAtPoint2;
            } else {
                this.firstPoint = this.point2;
                this.secondPoint = this.point1;
                this.closedCircleAtFirstPoint = this.closedCircleAtPoint2;
                this.closedCircleAtSecondPoint = this.closedCircleAtPoint1;
            }
        }

    }

    // do i want thickness to scale with the rest of the image??
    // right now, line thickness is the only thing that does not scale
    // setThickness(newThickness) {
    //     this.thickness = newThickness;
    // }

    isHorizontal() {
        if (this.line.horizontal) {
            return true
        } else {
            return false
        }
    }
    isVertical() {
        if (this.line.vertical) {
            return true
        } else {
            return false
        }
    }

    setThickness(newThickness) {
        this.diagramQualities.thickness = newThickness
    }

    setColor(newColor) {
        this.diagramQualities.color = newColor;
    }

    getLength() {
        return this.point1.getDistanceToAnotherPoint(this.point2);
    }

    /// i need a way to customize dot sizes and dash sizes!!!
    /// right now, it is set to 1/30 times the average of the width and height of the whole canvas!
    turnIntoDottedLine() {
        this.diagramQualities.dotted = true;
        this.setThickness(1);
    };

    turnIntoDashedLine() {
        this.diagramQualities.dashed = true;
    }

    // // if Point 1 were the origin, returns the angle to the horizontal of Point 2
    // // returns angles theta such that 0 <= theta < 2pi
    // getAngleToHorizontal() {
    //     return this.point1.getAngleToAnotherPoint(this.point2);
    // }
    //
    // getPerpendicularAngle() {
    //     return this.point1.getPerpendicularAngle(this.point2);
    // }

    // gets slope of line
    // if line is vertical, returns 1e10, rather than infinity
    getSlope() {
        return this.line.slope
    }

    getCenter() {
        return this.point1.interpolate(this.point2, new Magnitude('0.5', undefined,undefined,true)) /// does this need to be different if there is a unit?????
    }

    // gets the slope of a line perpendicular to this line
    getPerpendicularSlope(point1, point2) {
        return this.line.getPerpendicularSlope();
        // const originalSlope = getSlope(point1, point2);
        // if (originalSlope >= 1e10) {return 0;} // due to floating Point arithmetic, a slope zero usually doesn't actually come out as zero!
        // else if (originalSlope <= 1e-10) {return 1e10;} // if it returned Infinity, could lead to NaNs in later calculations
        // else {return -1 / originalSlope;}
    }



    isPointOnSegment(point, numSigFigs) { // UNTESETD
        if (this.line.isPointOnLine(point, numSigFigs)) { // point must be on line in order to be on a segment!
            if (this.isVertical()) {
                return ((this.closedCircleAtPoint1 && point.y.isGreaterThanOrEqualTo(this.point1.y, numSigFigs)) || point.y.isGreaterThan(this.point1.y, numSigFigs)) && ((this.closedCircleAtPoint2 && point.y.isLessThanOrEqualTo(this.point2.y, numSigFigs)) || point.y.isLessThan(this.point2.y, numSigFigs))
            } else {
                 return ((this.closedCircleAtPoint1 && point.x.isGreaterThanOrEqualTo(this.point1.x, numSigFigs)) || point.x.isGreaterThan(this.point1.x, numSigFigs)) && ((this.closedCircleAtPoint2 && point.x.isLessThanOrEqualTo(this.point2.x, numSigFigs)) || point.x.isLessThan(this.point2.x, numSigFigs))
            }
        } else {
            return false
        }
    }

    intersectionWithAnotherSegment(anotherSegment) { // UNTESTED
        const intersectionPoint  = this.line.findIntersectionWithAnotherLine(anotherSegment.line);
        if (!intersectionPoint) {
            return false
        }
        if (this.isPointOnSegment(intersectionPoint) && anotherSegment.isPointOnSegment(intersectionPoint)) {
            return intersectionPoint
        }
    }

    getAngleToHorizontal() {
      return this.pointA.getAngleToAnotherPoint(this.pointB)
    }

}
