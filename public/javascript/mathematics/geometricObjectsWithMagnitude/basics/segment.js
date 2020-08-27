class Segment {
    constructor(point1, point2) {
        this.point1 = point1;
        this.point2 = point2;
        // this.thickness = 2;
        // this.color = "#000000";
        // this.cap = "butt";
        // this.dotted = false;
        // this.dashed = false;

        this.line = new Line(point1, point2); // a corresponding infinite line through this point
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

    setColor(newColor) {
        this.color = newColor;
    }

    getLength() {
        return this.point1.getDistanceToAnotherPoint(this.point2);
    }

    /// i need a way to customize dot sizes and dash sizes!!!
    /// right now, it is set to 1/30 times the average of the width and height of the whole canvas!
    turnIntoDottedLine() {
        this.dotted = true;
        this.setThickness(1);
    };

    turnIntoDashedLine() {
        this.dashed = true;
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

    // gets the slope of a line perpendicular to this line
    getPerpendicularSlope(point1, point2) {
        const originalSlope = getSlope(point1, point2);
        if (originalSlope >= 1e10) {return 0;} // due to floating Point arithmetic, a slope zero usually doesn't actually come out as zero!
        else if (originalSlope <= 1e-10) {return 1e10;} // if it returned Infinity, could lead to NaNs in later calculations
        else {return -1 / originalSlope;}
    }


    // fix to adapt to magnitudes
    isPointOnSegment(point) { // UNTESETD
        if (this.line.isPointOnLine(point)) {
            if (this.isVertical()) {
                let firstY;
                let secondY;
                if (this.point1.y <= this.point2.y) {
                    firstY = this.point1.y;
                    secondY = this.point2.y;
                } else {
                    firstY = this.point2.y;
                    secondY = this.point1.y;
                }
                if (point.y >= firstY && point.y <= secondY) {
                    return true
                } else {
                    return false
                }
            } else { // a point is on this segment if it intersects the line and it is within the domain of this segment
                let firstX;
                let secondX;
                if (this.point1.x <= this.point2.x) {
                    firstX = this.point1.x;
                    secondX = this.point2.x;
                } else {
                    firstX = this.point2.x;
                    secondX = this.point1.x;
                }
                if (point.x >= firstX && point.x <= secondX) {
                    return true
                } else {
                    return false
                }
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

}
