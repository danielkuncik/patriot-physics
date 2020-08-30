// start radians and end radians are based on starting at +X and going counter-clockwise
// always counterclockwise!
class Arc {
    constructor(centerPoint, radius, startRadians, endRadians) {
        this.center = centerPoint;
        this.radius = radius;
        startRadians = simplifyAngle(startRadians); // if the angle is outside the 0 to 2 pi range, converts into that range
        endRadians = simplifyAngle(endRadians);
        if (startRadians === endRadians) {
            return false
        }
        this.startRadians = startRadians;
        this.endRadians = endRadians;
        if (this.startRadians < this.endRadians) {
            this.lesserAngle = this.startRadians;
            this.greaterAngle = this.endRadians;
            this.crossZeroLine = false;
        } else {
            this.greaterAngle = this.startRadians;
            this.lesserAngle = this.endRadians;
            this.crossZeroLine = true;
        }

        // not quite perfect, look at some cases
        this.rangeBox = constructRangeBoxFromExtremePoints(this.getMinX(), this.getMinY(), this.getMaxX(), this.getMaxY());
    }

    // gets the closest point to a particular angle on
    getClosestPointToAngleAbsolute(angle) {  // need to do some different things if crossing the zero line
        return getAngleClosestToArc(this.startRadians, this.endRadians, angle)
    }

    // this is infuriating 4-17-2020
    // i need to create a set of unit tests for this function, bc it's a mess
    // TDD is the only way to make this work

    getMinIndexOfArray(array) {
        if (array.length === 0) {
            return undefined
        }
        let min = array[0];
        let min_i = 0;
        let i;
        for (i = 1; i < array.length; i++) {
            if (array[i] < min) {
                min = array[i];
                min_i = i;
            }
        }
        return  min_i
    }

    // returns the point, in radians, on this particular arc, that is closest to some other angle in radians
    // I need to write many unit tests for this function
    getClosestPointToAngle(angle) {
        let options = [this.getClosestPointToAngleAbsolute(angle), this.getClosestPointToAngleAbsolute(angle + Math.PI * 2), this.getClosestPointToAngleAbsolute(angle - Math.PI * 2)];
        let optionScores = [Math.abs(options[0] - angle), Math.abs(options[1] - (angle + Math.PI * 2)), Math.abs(options[2] - (angle - Math.PI * 2))];
        let index = this.getMinIndexOfArray(optionScores);
        return options[index];
    }

    getMaxY() {
        let highestAngle = this.getClosestPointToAngle(Math.PI / 2);
        return this.center.y + this.radius * Math.sin(highestAngle);
    }

    getMinY() {
        let lowestAngle = this.getClosestPointToAngle(Math.PI * 3 / 2);
        return this.center.y + this.radius * Math.sin(lowestAngle);
    }

    getMaxX() {
        let farthestRightAngle = this.getClosestPointToAngle(0);
        return this.center.x + this.radius * Math.cos(farthestRightAngle);
    }

    getMinX() {
        let farthestLeftAngle = this.getClosestPointToAngle(Math.PI);
        return this.center.x + this.radius * Math.cos(farthestLeftAngle);
    }

    rescaleSingleFactor(scaleFactor) {
        this.radius *= scaleFactor; // why is there a /2??? i don't know, but it is necessary for it to work
    }

    rescaleDoubleFactor(xFactor, yFactor) {
        // this.elipse = true; // can make it elliptical if i want
        // this.xRadius= this.radius * xFactor;
        // this.yRadius = this.radius * yFactor;
        if (xFactor <= yFactor) {
            this.radius *= xFactor;
        } else {
            this.radius *= yFactor;
        }
    }

}
