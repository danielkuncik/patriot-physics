class Point {
    constructor(xMagnitude, yMagnitude, name) {
        if (!xMagnitude.isAmagnitude || !yMagnitude.isAmagnitude) {
            return false
        }
        this.x = xMagnitude;
        this.y = yMagnitude;
        this.name = name;
        //    this.uuid = create_UUID();
    }

    setName(newName) {
        this.name = newName;
    }

    translate(xTranslation, yTranslation) {
        if (!xTranslation.isAmagnitude || !yTranslation.isAmagnitude) {
            return false
        }
        this.x = this.x.addMag(xTranslation);
        this.y = this.y.addMag(yTranslation);
    }

    // work on this!
    translatePolar(radius, angleObject) {
        if (!radius.isAmagnitude || !angleObject.isAmagnitude) {
            return false
        }
        let xTranslation = radius.multiplyMag(angleObject.cosMag());
        let yTranslation = radius.multiplyMag(angleObject.sinMag());
        this.translate(xTranslation, yTranslation);
    }


    translateAndReproduce(xTranslation, yTranslation) {
        if (!xTranslation.isAmagnitude || !yTranslation.isAmagnitude) {
            return false
        }
        let newX = this.x.addMag(xTranslation);
        let newY = this.y.addMag(yTranslation);
        let newPoint = new Point(newX, newY);
        return newPoint
    }

    /// I CHANGED THE NAME!!! (from trnalstae and reproduce polar)
    translatePolarAndReproduce(radius, angleObject) {
        if (!radius.isAmagnitude || !angleObject.isAmagnitude) {
            return false
        }
        let xTranslation = radius.multiplyMag(angleObject.cosMag());
        let yTranslation = radius.multiplyMag(angleObject.sinMag());
        return this.translateAndReproduce(xTranslation, yTranslation)
    }

    /// [do i want to keep tihis???]
    // creates a new point by rotating the canvas, then translating
    // does not work if rotation is negative
    rotatedRectangleTransformAndReproduce(rotationAngle, xTranslationMagnitude, yTranslationMagnitude) {
        let xPrime = xTranslation * Math.cos(rotation) - yTranslation * Math.sin(rotation) + this.x;
        let yPrime = yTranslation * Math.cos(rotation) + xTranslation * Math.sin(rotation) + this.y;
        // let newX = this.x + xTranslation * Math.cos(rotation) + yTranslation * Math.sin(rotation);
        // let newY = this.y + xTranslation * Math.sin(rotation) - yTranslation * Math.cos(rotation);
        // let newPoint = new Point(newX, newY);
        let newPoint = new Point(xPrime, yPrime);
        return newPoint
    }

    // rotates a Point around the center Point by a certain angle
    // default center Point is origin
    rotate(rotationAngleInRadians, centerRotationPoint) {
        if (centerRotationPoint === undefined) {centerRotationPoint = origin;}
        this.translate(-1 * centerRotationPoint.x, -1 * centerRotationPoint.y);
        let xPrime = this.x * Math.cos(rotationAngleInRadians) - this.y * Math.sin(rotationAngleInRadians);
        let yPrime = this.y * Math.cos(rotationAngleInRadians) + this.x * Math.sin(rotationAngleInRadians);
        this.x = xPrime;
        this.y = yPrime;
        this.translate(centerRotationPoint.x, centerRotationPoint.y);
    }

    rescaleSingleFactor(scaleFactor) {
        this.x *= scaleFactor;
        this.y *= scaleFactor;
    }


    rescaleDoubleFactor(xFactor, yFactor) {
        this.x *= xFactor;
        this.y *= yFactor;
        // doesn't work well if the diagram includes circles and arcs!
        // and the point must be coordinated with these!
    }

    reflectAboutXAxis() {
        this.y *= -1;
    }

    getQuadrant() {
        if (this.x.zero && this.y.zero) {return '0';} // change this name?
        else if (this.x.zero && this.y.zero) {return '+X';}
        else if (!this.x.positive && this.y.zero) {return '-X';}
        else if (this.x.zero && this.y.positive) {return '+Y';}
        else if (this.x.zero && !this.y.positive) {return '-Y';}
        else if (this.x.positive && this.y.positive) {return '1';}
        else if (!this.x.positive && this.y.positive) {return '2';}
        else if (!this.x.positive && !this.y.positive) {return '3';}
        else if (this.x.positive && !this.y.positive) {return '4';}
        else {return false;}
    }

    // returns the angle in radians between the x-axis and a line Segment from the origin to this Point
    // returns angles theta such that 0 <= theta < 2pi
    // remake this using sqwitch?
    getAngleToHorizontal() {
        let theta;
        const quadrant = this.getQuadrant();
        if (quadrant === '1') {theta = Math.atan(this.y / this.x);}
        /// inefficient, but very reliable
        else if (quadrant === '2') {theta = Math.PI / 2 + Math.atan(-1 * this.x / this.y);}
        else if (quadrant === '3') {theta = Math.PI + Math.atan((-1 * this.y) / (-1 * this.x));}
        else if (quadrant === '4') {theta = Math.PI * 3 / 2 + Math.atan(this.x / (-1 *  this.y));}
        else if (quadrant === '+X') {theta = 0;}
        else if (quadrant === '-X') {theta = Math.PI;}
        else if (quadrant === '+Y') {theta = Math.PI / 2;}
        else if (quadrant === '-Y') {theta = 3 * Math.PI / 2;}
        else theta = undefined;
        return theta
    }

    getMagnitude() {
        return Math.sqrt(this.x**2 + this.y**2)
    }

    getDistanceToAnotherPoint(anotherPoint) {
        return Math.sqrt((this.x - anotherPoint.x)**2 + (this.y - anotherPoint.y)**2);
    }

    /// if this Point were the origin, returns the angle to the horizontal of the other Point
    // returns angles theta such that 0 <= theta < 2pi
    getAngleToAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let theta = anotherPoint.getAngleToHorizontal();
        anotherPoint.translate(this.x, this.y);
        return theta;
    }

    isEqualToAnotherPoint(anotherPoint) {
        if ((this.x === anotherPoint.x) && (this.y === anotherPoint.y)) {
            return true
        } else {
            return false
        }
    }

    // if this Point were the origin
    // in what quadrant woul the other Point be?
    getQuadrantOfAnotherPoint(anotherPoint) {
        anotherPoint.translate(-1 * this.x, -1 * this.y);
        let quadrant = anotherPoint.getQuadrant();
        anotherPoint.translate(this.x, this.y);
        return quadrant;
    }

    // returns a new Point
    // on the ray beginning at this Point and pointing toward anotherPoint
    // at a distance the length between the points * proportion
    // so if propotion = 0.5, it will be halfway between the points
    // and if proportion = 2, it will be twice as far away as the other Point (so it can actually interpolate and extrapolate)
    interpolate(anotherPoint, proportion) {
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint) * proportion;
        let x = this.x + L * Math.cos(theta);
        let y = this.y + L * Math.sin(theta);
        return new Point(x, y);
    }

    // returns a new Point which is a particular length away at angle theta
    getAnotherPointWithTrig(length, thetaInRadians) {
        let newX, newY;
        newX = this.x + length * Math.cos(thetaInRadians);
        newY = this.y + length * Math.sin(thetaInRadians);
        return new Point(newX,newY)
    }

    // returns an angle theta in Radians
    // of  a line that is perpendicular to the line between this point and another point
    getPerpendicularAngle(anotherPoint) {
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        theta += Math.PI / 2;
        if (theta > Math.PI * 2) {
            theta -= Math.PI * 2;
        }
        return theta;
    }

    // gives x and y components of a vector made from this vector and another point
    getComponentsToAnotherPoint(anotherPoint, axisRotationInRadians) {
        if (axisRotationInRadians === undefined) {axisRotationInRadians = 0;}
        let xComponent, yComponent;
        let theta = this.getAngleToAnotherPoint(anotherPoint);
        let L = this.getDistanceToAnotherPoint(anotherPoint);
        xComponent = L * Math.cos(theta);
        yComponent = L * Math.sin(theta);
        return  {
            xComponent: xComponent,
            yComponent: yComponent
        }
    }
}
